 var express                     = require("express"),
     app                         = express(),
     mysql                       = require('mysql'),
     methodOverride              = require("method-override"),
     passport                    = require("passport"),
     LocalStrategy               = require("passport-local").Strategy,
     bodyParser                  = require("body-parser"),
     flash                       = require("connect-flash"),
     mongoose                    = require("mongoose"),
     userLog                     = require("./models/userLog.js");
     md5                         = require('MD5');


var korisnici    = require("./rute/korisnici"),
    vikendice    = require("./rute/vikendice"),
    prijedlog    = require("./rute/prijedlog"),
    rezervacija  = require("./rute/rezervacija"),
    ocjena       = require("./rute/ocjena"),
    auth         = require("./rute/auth"),
    boravak      = require("./rute/boravak");


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
global.email = "";
//global.pending = 0;

/*
if(global.id){
            connection.connect();
            
            var query = "SELECT COUNT(*) AS broj FROM ?? WHERE ?? = ? AND ?? = ?";
                var table = ["boravljenje", "is_rated", 0, "id_korisnik", global.id];
                query = mysql.format(query, table);
            
            connection.query(query, function(err, rows, fields) {
              if (!err){
                global.pending = rows[0];
              }
              else
                console.log('Error while performing Query.');
            });
            
            connection.end();
   }
   */
   
//----------------------------------------------------------------------ROUTES START

//POČETNA BEZ PRIJAVLJENOG KORISNIKA
  app.get("/", function(req, res) {
      //console.log("Početna:" +global.id);
   res.render("landing", {
       
       
   });
 });
 

app.use(auth);

app.use("/korisnici", korisnici);

app.use("/vikendice", vikendice);

app.use("/prijedlog", prijedlog);

app.use("/rezervacija", rezervacija);

app.use("/ocjena", ocjena);

app.use("/boravak", boravak);


 app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is up...");
 });
 