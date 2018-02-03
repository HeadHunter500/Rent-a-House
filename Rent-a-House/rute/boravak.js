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


 //--------------------------------------------PREGLED VIKENDICA KOJE KORISNIK NIJE OCJENIO
 router.get("/:id_korisnik", function(req, res) {

   var query = "SELECT ??, DATE_FORMAT(??,'%d.%m.%Y.') AS od, DATE_FORMAT(??,'%d.%m.%Y.') AS do, ??, DATE_FORMAT(??,'%d.%m.%Y. %H:%i:%S') AS rezervacija, ?? AS vikendica FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
   var table = ["boravljenje.id_vikendica", "boravljenje.datum_od", "boravljenje.datum_do", "boravljenje.is_rated", "boravljenje.datum_rezervacije", "vikendice.ime",
   "boravljenje", "vikendice", "boravljenje.id_vikendica", "vikendice.id","boravljenje.id_korisnik", req.params.id_korisnik];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
     //var numRows = rows.length;

     if (err) {
       res.json({
         "Error": true,
         "Status": err
       });
     }
/*
     else if (numRows == 0) {
       res.json({
         "Error": false,
         "Empty": true,
         "Status": 404
       });
     }
*/

     else {
       /*
       res.json({
         "Error": false,
         "Empty": false,
         "Status": 200,
         "Vikendice": rows
       });
       */
       
       res.render("boravljenje/index", {
           boravci : rows
       });
       
     }


   });

 });
 //--------------------------------------------PREGLED VIKENDICA KOJE KORISNIK NIJE OCJENIO ZAVRŠAVA




 //-------------------------------------------------------------------------------------------------ROUTES END


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