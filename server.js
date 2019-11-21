var express = require("express");
var expressHB = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
//our scraping tools.  
var axios = require("axios");
var cheerio = require("cheerio");
//require all models
var db = require("./models");
var app = express();

var PORT = process.env.PORT || 4000;

app.set("views", "./views");
app.engine("handlebars", expressHB({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/unit18Populater",{useNewUrlParser: true});

app.get("/", function (req, res) {
    db.Article.find({})
        .then(dbUser => {
            return res.render("index");
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});



app.get("/scrape", function(req,res){
    axios.get("http://www.echojs.com/").then(function(response){
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element){
            var result = {};

            result.title = $(this)
            .children("a")
            .text();

            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });
        res.redirect("/");
    });
});

app.get("/api/all/articles", function(req,res){
    db.Article.find({}).sort({"_id": -1})
        .then(function(data){
        return res.json(data);
        }).catch(function(err){
        return res.status(500).json(err);
        });
});

app.get("/api/articles/:id", function(req,res){
    db.Article.findone({ _id: req.params.id})
        .then(function(data){
        return res.json(data);
        }).catch(function(err){
        return res.status(500).json(err);
        });
});

app.get("/api/articleNote/:id", function(req,res){
    var id = req.params.id;
    db.Article.findOne({"_id": id})
    .populate("note")
    .then(function(data){
        return res.json(data);
    })
    .catch(function(err){
        return res.status(500).json(err);
    });
});

 app.delete("/api/all/articles", (req,res) =>{
     db.Article.deleteMany({}).then(data =>{
         return db.Note.deleteMany({})
         .then(data =>{
             console.log("deleted all notes");
             return data;
         });
     }).then(function(data){
         console.log(data);
         return res.json(data);
     }).catch(err =>{
         return res.status(500).json(err);
     });
 });

 app.delete("/api/article/:id", (req, res) => {
    var id = req.params.id;
    console.log(id);
    db.Article.deleteOne({
        "_id": id
    }).then(data => {
        return res.json(data)
    }).catch(err => {
        return res.status(500).json(err);
    });
});

app.delete("/api/note/:id", (req, res) => {
    var id = req.params.id;
    console.log(id);
    db.Article.findOne({
        "_id": id
    }).then(data => {
        console.log(data)
        return data;
    }).then(data => {
        db.Note.deleteOne({
            "_id": data.note
        }).then(data => {
            return res.json(data)
        });
    }).catch(err => {
        return res.status(500).json(err);
    });

});

app.listen(PORT, function(){
    console.log("app running on port " + PORT + "!");
});