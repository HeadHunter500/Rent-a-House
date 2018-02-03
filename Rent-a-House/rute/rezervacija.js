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


 //--------------------------------------------PRIJEDLOG VIKENDICE ZAVRŠAVA

router.get("/:id_vikendica",function(req, res){
    
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
       //console.log(rows);
       res.render("vikendice/rezervacija", { 
           vikendica : vikendicaPodaci 
           
       });
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
   
});


 //---------------------BORAVLJENJE 
 router.post("/:id_vikendica", function(req, res) {


   var query = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,NOW())";
   var table = ["boravljenje", "id_korisnik", "id_vikendica", "datum_od", "datum_do", "is_rated", "datum_rezervacije",
     global.id, req.params.id_vikendica, req.body.datum_od, req.body.datum_do, 0
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
       /*
       res.json({
         "Error": false,
         "Status": 200,
         "Poruka": "Boravljenje je uspješno zabilježeno! Ugodan provod."
       });
       */
       
    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
   var table = ["vikendice", "okupirana",1, "id", req.params.id_vikendica];
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
         "Poruka": "Boravljenje je uspješno zabilježeno! Ugodan provod."
       });
       */
       res.redirect("/vikendice");
     }

   });
       
       
       
      // res.redirect("/vikendice");
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