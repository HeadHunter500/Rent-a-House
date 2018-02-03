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



//--------------------------------------------------------------------
//                      VIKENDICE
//
//--------------------------------------------------------------------


//---------------------------------------------Forma za unos vikendice

//FORMA ZA REGISTRACIJU NOVE VIKENDICE(admin)
router.get("/registracija", function(req, res) {
    
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
                 //console.log("Vikendice:" +global.id);
            res.render('vikendice/registracija', { gradovi : rows});
             }

     });
     
     if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
     
  });


 //---------------------REGISTRACIJA VIKENDICE
 router.post("/registracija", function(req, res) {


   var query = "INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,NOW())";
   var table = ["vikendice", "ime", "opis", "slika", "adresa", "id_grad", "okupirana", "cijena" , "datum_dodavanja",
     req.body.ime, req.body.opis, req.body.slika, req.body.adresa, req.body.id_grad, 0, req.body.cijena
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
      console.log("Vikendica je uspješno registrirana!");
      res.redirect("/vikendice");
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });

 //--------------------------------------------REGISTRACIJA VIKENDICE ZAVRŠAVA



// --------------brisanje vikendice-----------------------(admin)

router.delete("/:id", function(req, res){
 
    var query = "DELETE FROM ?? WHERE ?? = ?";
   var table = ["vikendice", "id", req.params.id];
   query = mysql.format(query, table);

   connection.query(query, function(err, rows) {

     if (err) {
       res.json({
         "Error": true,
         "Status": 503
       });
     }else {
       res.redirect('/vikendice');
     }

   });
   
    if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
   
});

// -----------------dohvacanje podataka za izmjenu i slanje na formu

router.get('/:id/izmijeni', function(req, res) {
 
 var query = "SELECT ?? vikID, ??, ??, ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ??=?? WHERE ?? = ?";
   var table = ["vikendice.id","vikendice.ime","vikendice.opis","vikendice.slika","vikendice.adresa","vikendice.okupirana","vikendice.datum_dodavanja", "vikendice.cijena", "gradovi.id","gradovi.ime_grada",
   "vikendice", "gradovi", "vikendice.id_grad", "gradovi.id", "vikendice.id", req.params.id];
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
       var vikendicaPodaci = rows[0];
         console.log(vikendicaPodaci);
       res.render("vikendice/izmjena", {vikendica: vikendicaPodaci});
     }


   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }
    
});

//--------------------spremanje novih podataka vikendice

router.put('/:id', function(req, res){
  var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    var table = ["vikendice",
      "vikendice.ime", req.body.ime,
      "vikendice.opis", req.body.opis,
      "vikendice.adresa", req.body.adresa,
      "vikendice.slika", req.body.slika,
      "vikendice.okupirana", req.body.okupirana,
      "vikendice.cijena", req.body.cijena,
      "vikendice.id", req.params.id
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
      res.redirect('/vikendice/' + req.params.id);
     }

   });
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

});



 //--------------------------------------------PREGLED ODREĐENE VIKENDICE I DOHVAT OCJENA
 router.get("/:id", function(req, res) {

   var query = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ??=?? WHERE ?? = ?";
   var table = ["vikendice.id","vikendice.ime","vikendice.opis","vikendice.slika","vikendice.adresa","vikendice.okupirana","vikendice.datum_dodavanja","gradovi.ime_grada", "vikendice.cijena",
   "vikendice", "gradovi", "vikendice.id_grad", "gradovi.id", "vikendice.id", req.params.id];
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
    
       var vikendicaPodaci = rows[0];
       
     var query = "SELECT ??, ??, ??, DATE_FORMAT(??,'%d.%m.%Y. %H:%i:%S') AS datum, ?? FROM ?? INNER JOIN ?? ON ??=?? WHERE ?? = ? AND ?? = ??";
   var table = ["ocjene.id_korisnik","ocjene.ocjena","ocjene.komentar","ocjene.datum_ocjene","korisnici.nadimak",
   "ocjene", "korisnici", "ocjene.id_korisnik", "korisnici.id", "ocjene.id_vikendica", req.params.id, "korisnici.id","ocjene.id_korisnik"];
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
      /*
       res.json({
         "Error": false,
         "Empty": true,
         "Status": 404
       });
       */
       
        res.render("vikendice/detalji", {
         vikendica: vikendicaPodaci,
         ocjene : rows
       });
     }


     else {
                 //var ocjene = rows[0];
       // console.log(vikendicaPodaci);
       res.render("vikendice/detalji", {
         vikendica: vikendicaPodaci,
         ocjene : rows
       });
     }
   
    });

     }

   });
   
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //--------------------------------------------PREGLED ODREĐENE VIKENDICE ZAVRŠAVA




 //--------------------------------------------PREGLED SVIH VIKENDICA
 router.get("/", function(req, res) {

   var query = "SELECT * FROM ??";
   var table = ["vikendice"];
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
         
         var vikendiceSve = rows;
         
    var query = "SELECT COUNT(*) AS broj FROM ?? WHERE ?? = ? AND ?? = ?";
    var table = ["boravljenje", "is_rated", 0, "id_korisnik", global.id];
    query = mysql.format(query, table);

   connection.query(query, function(err, rows) {
     var numRows = rows.length;

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
     
      var rezultat = rows[0];
     
       res.render("vikendice/index", {
         vikendice: vikendiceSve,
         //broj : rezultat
       });

     }

   });
   
     }
     
   });
     
   
   if(global.email != ""){
       spremiLog(global.id, global.email, req.path, req.ip);
   }

 });
 //--------------------------------------------PREGLED SVIH VIKENDICA ZAVRŠAVA

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