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



router.get("/:id_vikendica", function(req, res){
     var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table =["vikendice","id",req.params.id_vikendica];
    query = mysql.format(query, table);
    
    connection.query(query, function(err, rows) {

     if (err) {
       res.json({
         "Error": true,
         "Status": 503
       });
     }

     else {
         var vikendicaPodaci = rows[0];
        //  console.log(vikendicaPodaci);
       res.render("recenzije/nova", { vikendica : vikendicaPodaci });
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
});




 //---------------------OCJENJIVANJE VIKENDICE
 router.post("/:id_vikendica", function(req, res) {


   var query = "INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,NOW())";
   var table = ["ocjene", "id_vikendica", "id_korisnik", "ocjena", "komentar", "datum_ocjene",
     req.params.id_vikendica, global.id, req.body.ocjena, req.body.komentar
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





       var query = "UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?";
       var table = ["boravljenje", "is_rated", 1, "id_korisnik", global.id, "id_vikendica", req.params.id_vikendica];
       query = mysql.format(query, table);

       connection.query(query, function(err, rows) {

         if (err) {
           res.json({
             "Error": true,
             "Status": 503
           });
         }

         else {
/*
           res.json({
             "Error": false,
             "Status": 200,
             "Poruka": "Vikendica je uspješno ocijenjena!"
           });

*/
 var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
       var table = ["vikendice", "okupirana", 0, "id", req.params.id_vikendica];
       query = mysql.format(query, table);

       connection.query(query, function(err, rows) {

         if (err) {
           res.json({
             "Error": true,
             "Status": 503
           });
         }

         else {
/*
           res.json({
             "Error": false,
             "Status": 200,
             "Poruka": "Vikendica je uspješno ocijenjena!
           });
*/
            res.redirect("/vikendice/" + req.params.id_vikendica);

         }

       });



         }

       });



     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });

 //--------------------------------------------OCJENJIVANJE VIKENDICE ZAVRŠAVA





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