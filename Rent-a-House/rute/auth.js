var express = require("express");
var router = express.Router();
var mysql = require('mysql');
var userLog= require("../models/userLog.js");
var md5 = require('MD5');

 var connection = mysql.createConnection({
   host: '188.166.166.100',
   user: 'pios',
   password: '6le7Wijz4H',
   database: 'pios'
 });


//--------------------------------------------------------------------
//                      LOGIN
//
//--------------------------------------------------------------------

//FORMA ZA LOGIN
router.get("/login", function(req, res) {
    //console.log("Login:" +global.id);
     res.render("login");
 });

router.get("/odjava", function(req, res){
    global.id = 0;
    global.uloga = 0;
    global.ime = "";
    global.nadimak = "";
    res.redirect("/");
});

//LOGIN RUTA
router.post('/login', function (req, res) {
  var post = req.body;

    var query = "SELECT * FROM ?? WHERE ?? = ? AND ??=?";
      var table = ["korisnici", "email", post.email, "lozinka", md5(post.lozinka)];
      query = mysql.format(query, table);

      connection.query(query, function(err, rows) {
            var numRows = rows.length;

            if (err) {
              res.json({
                "Error": true,
                "Status": 503
                //"Message": "Error executing MySQL query"
              });
            }

             else if (numRows == 0) {
              res.json({
                "User_exists": false
              });
            }
            
            else {
                //req.session.user_id = rows[0].id;
                global.id = rows[0].id;
                global.uloga = rows[0].id_uloga;
                global.ime = rows[0].ime;
                global.email = rows[0].email;
                
                spremiLog(global.id, global.email, req.path, req.ip);
                
                res.redirect("/vikendice");
            }

      });

});


//LOGIN GOTOV

//--------------------------------------------------------------------
//                      REGISTER
//
//--------------------------------------------------------------------


//FORMA ZA REGISTRACIJU
 router.get("/register", function(req, res) {
     
   var query = "SELECT * FROM ?? ORDER BY ?? ASC";
   var table = ["gradovi","ime_grada"];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
             if (err) {
               res.json({
                 "Error": true,
                 "Status": err
               });
             }
        
             else {
            res.render('register', { gradovi : rows});
             }

     });
 });


//  funkcija za spremanje logova
 function spremiLog(id ,em, act, ipadd){
      var log = new userLog({
          userID: id,
         email: em,
         action: act,
         ip: ipadd
      });
      
      log.save(function(err, savedLog){
          if(err){
            //   console.log(err);
          }else{
            //   console.log("log has been saved:" );
            //   console.log(savedLog);
          }
      });
 }
//  funkcija za spremanje logova KRAJ 



module.exports = router;