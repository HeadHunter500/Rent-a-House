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





 //---------------------REGISTRACIJA KORISNIKA
 router.post("/registracija", function(req, res) {

   var query = "INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?, ? ,?,?,?,NOW())";
   var table = ["korisnici", "nadimak", "lozinka", "email", "id_uloga", "ime", "prezime", "id_grad", "datum_registracije",
     req.body.nadimak, md5(req.body.lozinka), req.body.email, 1, req.body.ime, req.body.prezime, req.body.id_grad
   ];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {

     if (err) {
       res.json({
         "Error": true,
         "Status": err //503
       });
     }

     else {
         //console.log("Korisnik je uspješno registriran!"); 
         res.render("login");
     }

   });

 });

 //--------------------------------------------REGISTRACIJA KORISNIKA ZAVRŠAVA



//--------------------------------------------------------------------
//                      KORISNICI
//
//--------------------------------------------------------------------

 //---------------------PREGLED SVIH KORISNIKA
 router.get("/", function(req, res) {

   var query = "SELECT * FROM ??";
   var table = ["korisnici"];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
     var numRows = rows.length;

     if (err) {
       res.json({
         "Error": true,
         "Status": err
       });
     }

     else if (numRows == 0) {
       res.json({
         "Error": false,
         "Empty": true,
         "Status": 404
       });
     }


     else {
         //console.log("Korisnici:" +global.id);
        res.render('korisnici/', { korisnici : rows});
     }


   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //--------------------------------------------PREGLED SVIH KORISNIKA ZAVRŠAVA



 //---------------------PREGLED ODREĐENOG KORISNIKA 
 router.get("/:id", function(req, res) {

   var query = "SELECT * FROM ?? WHERE ?? = ?";
   var table = ["korisnici", "id", req.params.id];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
     var numRows = rows.length;

     if (err) {
       res.json({
         "Error": true,
         "Status": err
       });
     }

     else if (numRows == 0) {
       res.json({
         "Error": false,
         "Empty": true,
         "Status": 404
       });
     }else {
         
    res.render('korisnici/izmjena', {korisnik: rows[0]});
     }
   });
   
  if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //--------------------------------------------PREGLED ODREĐENOG KORISNIKA ZAVRŠAVA


//=--------------------------------------------BRISANJE KORISNIKA POCETAK

router.delete('/:id', function(req, res) {

    var query = "DELETE FROM ?? WHERE ?? = ?";
    var table = ["korisnici", "id", req.params.id];
    query = mysql.format(query, table);

    connection.query(query, function(err, rows) {

        if (err) {
            res.json({
                "Error": true,
                "Status": 503
            });
        }
        else {
            res.redirect('/korisnici');
        }

    });
    
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
});

//=--------------------------------------------BRISANJE KORISNIKA ZAVRSAVA

 // POST edit passenger profile
router.put("/:id", function(req, res) {

   var query = "SELECT ??,?? FROM ?? WHERE ?? = ?";
   var table = ["id", "email", "korisnici", "email", req.body.email];

   query = mysql.format(query, table);
   connection.query(query, function(err, rows) { //Email connect check
     var numRows = rows.length;

     if (err) {
       res.json({
         "Error": true,
         "Status": 503
       });
     }

     else if (numRows == 0 || (rows[0].id == req.params.id)) {

       var query = "SELECT ??,?? FROM ?? WHERE ?? = ?";
       var table = ["id", "nadimak", "korisnici", "nadimak", req.body.nadimak];

       query = mysql.format(query, table);
       connection.query(query, function(err, rows) { //nadimak conn check
         var numRows = rows.length;

         if (err) {
           res.json({
             "Error": true,
             "Status": 503
           });
         }



         else if (numRows == 0 || (rows[0].id == req.params.id)) {

           var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
           var table = ["korisnici",
             "korisnici.nadimak", req.body.nadimak,
             "korisnici.email", req.body.email,
             "korisnici.ime", req.body.ime,
             "korisnici.prezime", req.body.prezime,
             "korisnici.id_grad", req.body.id_grad,

             "korisnici.id", req.params.id
           ];

           query = mysql.format(query, table);

           connection.query(query, function(err, rows) {

             if (err) {
               res.json({
                 "Error": true,
                 "Status": 503
               });
             }

             else {
              res.redirect('/korisnici/');
             }
           });

         }
         else {
           res.json({
             "nadimak_postoji": true,
             "Status": 302
           });
         }
       }); //nadimak connect check end

     }

     else {
       res.json({
         "email_postoji": true,
         "Status": 302
       });
     }
   }); //email connect check end
   
   
  if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //END------------------edit passenger profile



//FORMA ZA BIRANJE NOVE LOZINKE
router.get("/lozinka/edit/:id", function(req, res){
    res.render("korisnici/reset_lozinka", {id : req.params.id});
    
    if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
});

  

 //-------------------------------------------------OVJEŽIVANJE LOZINKE KORISNIKA
 
 router.put("/lozinka/edit/:id", function(req, res) {
   var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
   var table = ["korisnici", "lozinka", md5(req.body.lozinka), "id", req.params.id];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {

     if (err) {
       res.json({
         "Error": true,
         "Status": 503
           //"Message": "Error executing MySQL query"
       });
     }


     else {
      /*
      res.json({
         "Error": false,
         "Empty": false,
         "Status": 200,
         "Message": "Osvježena lozinka za korisnika " + req.params.id
       });
       */
       res.redirect("/korisnici");
     }

   });

    if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //-------------------------------------------------OVJEŽIVANJE LOZINKE KORISNIKA ZAVRŠAVA
 
//  ----------------------------------------------Prikaz logova za odredenog korisnika

router.get("/logs/:id", function(req, res) {
    userLog.find({userID: req.params.id}, function(err, allLogs){
        if(err){
            // console.log(err);
        }else if(allLogs != null){
            res.render('korisnici/logs', {logs: allLogs});
        }else{
            res.render('korisnici/logs', {logs: {}});
        }
    });
});

//  ----------------------------------------------Prikaz logova za odredenog korisnika ZAVRSAVA

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