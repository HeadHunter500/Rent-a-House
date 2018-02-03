var express = require("express");
var router = express.Router();
var mysql = require('mysql');
var userLog= require("../models/userLog.js");

 var connection = mysql.createConnection({
   host: '188.166.166.100',
   user: 'pios',
   password: '6le7Wijz4H',
   database: 'pios'
 });



// ----------------- prijedlog vikendice forma
router.get('/', function(req, res) {
    
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
            res.render('vikendice/prijedlog', { gradovi : rows});
             }

     });
     
     if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
    
});


 //---------------------PRIJEDLOG VIKENDICE
 router.post("/", function(req, res) {

   var query = "INSERT INTO ?? (??,??,??,??,??,??,??, ??) VALUES (?,?,?,?,?,?,?,NOW())";
   var table = ["prijedlog_vikendica", "id_korisnika", "ime_vikendice", "adresa", "id_grad", "slika", "opis","cijena", "datum_zahtijeva",
     req.body.id_korisnika, req.body.ime_vikendice, req.body.adresa, req.body.id_grad, req.body.slika, req.body.opis, req.body.cijena
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
    //   res.json({
    //      "Error": false,
    //      "Status": 200,
    //      "Poruka": "Zahtijev za novom vikendicom je uspješno poslan na razmatranje!"
    //   });
        
        res.redirect('/vikendice');
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });



// ----------------- prijedlog vikendice popis Admin
router.get('/admin/', function(req, res) {
    
     var query = "SELECT * FROM ??";
   var table = ["prijedlog_vikendica"];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
             if (err) {
               res.json({
                 "Error": true,
                 "Status": err
               });
             }
        
             else {
            res.render('vikendice/pregled_prijedloga', { prijedlozi : rows});
             }

     });
     
     if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
    
});




// ----------------- prijedlog vikendice  Admin Prihvaćanje
router.put('/admin/prihvati/:id_prijedlog', function(req, res) {
    
     var query = "SELECT * FROM ?? WHERE ?? = ?";
   var table = ["prijedlog_vikendica", "id", req.params.id_prijedlog];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
             if (err) {
               res.json({
                 "Error": true,
                 "Status": err
               });
             }
        
     else {
      
       var rezultat = rows[0];
       
                var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
               var table = ["prijedlog_vikendica", "status",1, "id", req.params.id_prijedlog];
               query = mysql.format(query, table);
            
               connection.query(query, function(err, rows) {
            
                 if (err) {
                   res.json({
                     "Error": true,
                     "Status": 503
                   });
                 }
            
                 else {
                 
                   res.render("vikendice/registracija_prijedloga", {prijedlog : rezultat});
                 }
            
               });
       
      // res.redirect("/vikendice");
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });



// ----------------- prijedlog vikendice  Admin odbijanje
router.put('/admin/odbij/:id_prijedlog', function(req, res) {
    
   var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
   var table = ["prijedlog_vikendica", "status", 2, "id", req.params.id_prijedlog];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
             if (err) {
               res.json({
                 "Error": true,
                 "Status": err
               });
             }
        
             else {
            res.redirect('/vikendice/');
             }

     });
     
     if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
    
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