 var express                     = require("express"),
     app                         = express(),
     mysql                       = require('mysql'),
     methodOverride              = require("method-override"),
     passport                    = require("passport"),
     LocalStrategy               = require("passport-local").Strategy,
     bodyParser                  = require("body-parser"),
     flash                       = require("connect-flash"),
     mongoose                    = require("mongoose"),
     md5                         = require('MD5');

 app.use(bodyParser.urlencoded({
   extended: true
 }));
 app.set("view engine", "ejs");
 app.use(express.static(__dirname + "/public"));
 app.use(methodOverride("_method"));
 
 mongoose.connect("mongodb://localhost/rent-a-house");
 

 var connection = mysql.createConnection({
   host: '188.166.166.100',
   user: 'pios',
   password: '6le7Wijz4H',
   database: 'pios'
 });


//globalne varijable koje se koriste za prijavu, odjavu i "sesiju"
global.id = 0;
global.uloga = 0;
global.ime = "";
global.nadimak = "";
//----------------------------------------------------------------------ROUTES START

//POČETNA BEZ PRIJAVLJENOG KORISNIKA
  app.get("/", function(req, res) {
      //console.log("Početna:" +global.id);
   res.render("landing", {
       
       
   });
 });
 

//--------------------------------------------------------------------
//                      LOGIN
//
//--------------------------------------------------------------------

//FORMA ZA LOGIN
app.get("/login", function(req, res) {
    //console.log("Login:" +global.id);
     res.render("login");
 });

app.get("/odjava", function(req, res){
    global.id = 0;
    global.uloga = 0;
    global.ime = "";
    global.nadimak = "";
    res.redirect("/");
});

//LOGIN RUTA
app.post('/login', function (req, res) {
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
                res.redirect("/");
            }

      });
  
});


//LOGIN GOTOV

//--------------------------------------------------------------------
//                      REGISTER
//
//--------------------------------------------------------------------


//FORMA ZA REGISTRACIJU
 app.get("/register", function(req, res) {
     
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



 //---------------------REGISTRACIJA KORISNIKA
 app.post("/korisnici/registracija", function(req, res) {

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
 app.get("/korisnici", function(req, res) {

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

 });
 //--------------------------------------------PREGLED SVIH KORISNIKA ZAVRŠAVA



 //---------------------PREGLED ODREĐENOG KORISNIKA 
 app.get("/korisnici/:id", function(req, res) {

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

 });
 //--------------------------------------------PREGLED ODREĐENOG KORISNIKA ZAVRŠAVA


//=--------------------------------------------BRISANJE KORISNIKA POCETAK

app.delete('/korisnici/:id', function(req, res) {

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
});

//=--------------------------------------------BRISANJE KORISNIKA ZAVRSAVA

 // POST edit passenger profile
 app.put("/korisnici/:id", function(req, res) {

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

 });
 //END------------------edit passenger profile



//FORMA ZA BIRANJE NOVE LOZINKE
app.get("/korisnici/lozinka/edit/:id", function(req, res){
    res.render("korisnici/reset_lozinka", {id : req.params.id});
});

  

 //-------------------------------------------------OVJEŽIVANJE LOZINKE KORISNIKA
 app.put("/korisnici/lozinka/edit/:id", function(req, res) {
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

 });
 //-------------------------------------------------OVJEŽIVANJE LOZINKE KORISNIKA ZAVRŠAVA


//--------------------------------------------------------------------
//                      VIKENDICE
//
//--------------------------------------------------------------------


//---------------------------------------------Forma za unos vikendice

//FORMA ZA REGISTRACIJU NOVE VIKENDICE(admin)
app.get("/vikendice/registracija", function(req, res) {
    
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
  });


 //---------------------REGISTRACIJA VIKENDICE
 app.post("/vikendice/registracija", function(req, res) {


   var query = "INSERT INTO ?? (??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,NOW())";
   var table = ["vikendice", "ime", "opis", "slika", "adresa", "id_grad", "okupirana", "datum_dodavanja",
     req.body.ime, req.body.opis, req.body.slika, req.body.adresa, req.body.id_grad, 0
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

 });

 //--------------------------------------------REGISTRACIJA VIKENDICE ZAVRŠAVA



// --------------brisanje vikendice-----------------------(admin)

app.delete("/vikendice/:id", function(req, res){
 
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
});

// -----------------dohvacanje podataka za izmjenu i slanje na formu

app.get('/vikendice/:id/izmijeni', function(req, res) {
 
 var query = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ??=?? WHERE ?? = ?";
   var table = ["vikendice.id","vikendice.ime","vikendice.opis","vikendice.slika","vikendice.adresa","vikendice.okupirana","vikendice.datum_dodavanja","gradovi.id","gradovi.ime_grada", "vikendice.cijena",
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
       // console.log(vikendicaPodaci);
       res.render("vikendice/izmjena", {vikendica: vikendicaPodaci});
     }


   });
    
})

//--------------------spremanje novih podataka vikendice

app.put('/vikendice/:id', function(req, res){
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

});



 //--------------------------------------------PREGLED ODREĐENE VIKENDICE
 app.get("/vikendice/:id", function(req, res) {

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
       // console.log(vikendicaPodaci);
       res.render("vikendice/detalji", {
         vikendica: vikendicaPodaci
       });
     }


   });

 });
 //--------------------------------------------PREGLED ODREĐENE VIKENDICE ZAVRŠAVA




 //--------------------------------------------PREGLED SVIH VIKENDICA
 app.get("/vikendice", function(req, res) {

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
       res.render("vikendice/index", {
         vikendice: vikendiceSve
       });

     }


   });

 });
 //--------------------------------------------PREGLED SVIH VIKENDICA ZAVRŠAVA


// ----------------- prijedlog vikendice forma
app.get('/prijedlog', function(req, res) {
    
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
    
})


 //---------------------PRIJEDLOG VIKENDICE
 app.post("/prijedlog", function(req, res) {

   var query = "INSERT INTO ?? (??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,NOW())";
   var table = ["prijedlog_vikendica", "id_korisnika", "ime_vikendice", "adresa", "id_grad", "slika", "opis", "datum_zahtijeva",
     req.body.id_korisnika, req.body.ime_vikendice, req.body.adresa, req.body.id_grad, req.body.slika, req.body.opis
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

 });

 //--------------------------------------------PRIJEDLOG VIKENDICE ZAVRŠAVA

app.get("/rezervacija/:id_vikendica",function(req, res){
    
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
       res.render("vikendice/rezervacija", { vikendica : vikendicaPodaci });
     }

   });
});


 //---------------------BORAVLJENJE 
 app.post("/rezervacija/:id_vikendica", function(req, res) {


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

 });

 //--------------------------------------------BORAVLJENJE ZAVRŠAVA


app.get("/ocjena/:id_vikendica", function(req, res){
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
});




 //---------------------OCJENJIVANJE VIKENDICE
 app.post("/ocjena/:id_vikendica", function(req, res) {


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

 });

 //--------------------------------------------OCJENJIVANJE VIKENDICE ZAVRŠAVA







 //--------------------------------------------PREGLED VIKENDICA KOJE KORISNIK NIJE OCJENIO
 app.get("/pending_ocjene/:id_korisnik", function(req, res) {

   var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
   var table = ["boravljenje", "is_rated", 0, "id_korisnik", req.params.id_korisnik];
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
       res.json({
         "Error": false,
         "Empty": false,
         "Status": 200,
         "Vikendice": rows
       });
     }


   });

 });
 //--------------------------------------------PREGLED VIKENDICA KOJE KORISNIK NIJE OCJENIO ZAVRŠAVA




 //-------------------------------------------------------------------------------------------------ROUTES END

 app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up...");
 });
 