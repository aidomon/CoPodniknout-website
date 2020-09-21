//jshint esversion:6

const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const options = require("./options");

const app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// MongoDB *******
// trips collection
var mongoDB = options.mongo_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const tripSchema = new mongoose.Schema(
    {
        title: String,
        url: String,
        category: Array,
        category_str: String,
        images: Array,
        images_alt: Array,
        keywords: String,
        map: Array,
        description: String,
        duration: String,
        severity: String,
        dog: String,
        open: String,
        history: String,
        entry: Array,
        text1: Array,
        text2: Array,
        text3: Array,
    },
    { collection: options.collection[0] }
);
const Trip = mongoose.model(options.name[0], tripSchema);
// blog collection
const blogSchema = new mongoose.Schema(
    {
        title: String,
        title_description: String,
        url: String,
        keywords: String,
        content_introduction: Array,
        content_headers: Array,
        content_text: Array,
        images: Array,
    },
    { collection: options.collection[1] }
);
const Blog = mongoose.model(options.name[1], blogSchema);
// blog comments collection
const blog_commentSchema = new mongoose.Schema(
    {
        blog_name: String,
        name: String,
        comment: String,
        time: String,
    },
    { collection: options.collection[2] }
);
const Blog_comment = mongoose.model(options.name[2], blog_commentSchema);

// MongoDB *******

// requests
app.get("*", function (req, res, next) {
    if (req.headers.host == "blog.copodniknout.cz") {
        // console.log("subdomain detected");
        // console.log(req.url);
        req.url = "blog.copodniknout.cz" + req.url;
        // console.log(req.url);
    }
    next();
});

app.get("blog.copodniknout.cz/", function (req, res) {
    res.render("error_page", { error: "Právě pro Vás připravujeme zbrusu nový blog!<br>Těšte se ❤️" });
});
app.get("blog.copodniknout.cz/jedna", function (req, res) {
    res.render("error_page", { error: "JEDNA Právě pro Vás připravujeme zbrusu nový blog!<br>Těšte se ❤️" });
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//***************** SMAZAT A NAHRADIT ****************** */

app.get("/blog", function (req, res) {
    Blog.find({}, function (err, results) {
        if (results == null) {
            res.render("error_page", { error: "Nic nenalezeno :(" });
        } else {
            res.render("blog", { blogs: results.reverse() });
        }
    });
});

app.post("/blog/vyhledavani", function (req, res) {
    //console.log((req.body.vyhledavani).toUpperCase());
    const search = req.body.vyhledavani
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ - /g, " ")
        .replace(/ /g, ", ");
    Blog.find({ keywords: { $regex: ".*" + search + ".*" } }, function (err, results) {
        if (err) {
            //console.log(err);
            res.redirect("blog.copodniknout.cz/");
        } else {
            res.render("blog_vyhledavani", {
                blogs: results,
                searched_phrase: req.body.vyhledavani,
            });
        }
    });
});

app.get("/blog/vyhledavani/:dotaz", function (req, res) {
    const search = req.params.dotaz
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ - /g, " ")
        .replace(/-/g, " ")
        .replace(/ /g, ", ");
    Blog.find({ keywords: { $regex: ".*" + search + ".*" } }, function (err, results) {
        if (err) {
            //console.log(err);
            res.redirect("blog.copodniknout.cz/");
        } else {
            res.render("blog_vyhledavani", {
                blogs: results,
                searched_phrase: search,
            });
        }
    });
});

app.get("/blog/zkouska", function (req, res) {
    //res.send("<form action='/blog/zkouska' method='post'><input type='text' name='text' id=''><input type='submit' value='Submit'></form>");
    // Blog_commment.findOne({blog_name: "ahoj"}, function(err, result){
    //     console.log(result);
    //     res.send(result);
    // });
    // Blog_comment.updateOne({blog_name: "ahoj2"}, { $push: { comments: "hruza" }}, function(err, result){
    //     res.send(result);
    // });
    Blog_comment.create({ blog_name: "Třetí den", name: "Dalibor", comment: "ahoj", time: "1" }, function (err, small) {
        if (err) return handleError(err);
    });
    res.send("jo");
});

app.post("/blog/komentar", function (req, res) {
    //console.log(req.body.komentar + "<br>" + req.body.jmeno + "<br>" + req.body.blog);
    var date = new Date();
    var current_date = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

    //Blog_comment.updateOne({ blog_name: req.body.blog }, { $push: { name: req.body.jmeno, comment: req.body.komentar, time: current_date } }, function (err, result) {});

    Blog_comment.create({ blog_name: req.body.blog, name: req.body.jmeno, comment: req.body.komentar, time: current_date }, function (err, small) {
        if (err) return handleError(err);
    });

    //res.render("blog_konkretni", { blog: result, time: current_date });
    //res.status(204).send();
    res.redirect("/blog/" + req.body.blogURL + "/#komentare");
});

app.get("/blog/prispevky", function (req, res) {
    Blog.find({}, function (err, result) {
        if (result == null) {
            res.sendFile(__dirname + "/views/blog_error.html");
        } else {
            res.render("blog_prispevky", { blogs: result.reverse() });
        }
    });
});

app.get("/blog/:prispevek", function (req, res) {
    Blog.findOne({ url: req.params.prispevek }, function (err, result) {
        if (result == null) {
            res.sendFile(__dirname + "/views/blog_error.html");
        } else {
            Blog_comment.find({ blog_name: result.title }, function (err, comments) {
                res.render("blog_konkretni", { blog: result, blog_comments: comments });
            });
            //console.log(result.category);
        }
    });
});

// app.get("/blog/*", function (req, res) {
//     res.sendFile(__dirname + "/views/blog_error.html");
// });

//*********************************** */

app.get("/:category", function (req, res) {
    const page_url = req.params.category;
    var title = "";
    switch (req.params.category) {
        case "na-kole":
            title = "Výlet na kole";
            title_url = "na-kole";
            description = "Nevíte, kam na výlet nebo co podniknout z Brna na kole? Vyzkoušejte tipy na CoPodniknout.";
            keywords = "na kole, cyklotrasy, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_nakole";
            break;
        case "hrady-a-zamky":
            title = "Hrady & zámky";
            title_url = "hrady-a-zamky";
            description = "Nevíte, kam z Brna vyrazit na hrad či zámek? Vyzkoušejte naše tipy na výlet na CoPodniknout.";
            keywords = "hrady, zámky, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_hradyazamky";
            break;
        case "rozhledny-a-zriceniny":
            title = "Rozhledny & zříceniny";
            title_url = "rozhledny-a-zriceniny";
            description = "Nevíte, kam z Brna vyrazit na výlet na rozhledny či zříceniny? Vyzkoušejte naše tipy na výlet na CoPodniknout.";
            keywords = "rozhladna, zřícenina, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_rozhlednyazriceniny";
            break;
        case "prochazky-prirodou":
            title = "Procházky přírodou";
            title_url = "prochazky-prirodou";
            description = "Nevíte, kam v okolí Brna vyrazit na výlet do přírody? Vyzkoušejte tipy na procházku přírodou na CoPodniknout.";
            keywords = "procházka, příroda, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_prochazkyprirodou";
            break;
        case "pro-pary-a-kamarady":
            title = "Pro páry & kamarády";
            title_url = "pro-pary-a-kamarady";
            description = "Nevíte, kam v okolí Brna tipy na výlet vhodný pro páry nebo tipy, co podniknout s kamarády? Vyzkoušejte CoPodniknout.";
            keywords = "pro dva, pro páry, kamarád, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_prodva";
            break;
        case "s-rodinou":
            title = "Výlety s rodinou";
            title_url = "s-rodinou";
            description = "Nevíte, kam v okolí Brna vyrazit s rodinou? Vyzkoušejte naše tipy na výlet na CoPodniknout.";
            keywords = "s rodinou, copodniknout, co podniknout, výlet, brno, z Brna";
            background = "title_srodinou";
            break;
        default:
            throw new Error("Bad request");
    }
    Trip.find({ category: req.params.category }, function (err, results) {
        if (results == null) {
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            res.render("udalosti_seznam", {
                category_title: title,
                category_title_url: title_url,
                category_description: description,
                category_background: background,
                category_keywords: keywords,
                url: page_url,
                trips: results.reverse(),
            });
        }
    });
});

app.get("/na-kole/:trip", function (req, res) {
    //console.log(req.params.trip);
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            //console.log(result.category);
            res.render("udalost", { trip: result });
        }
    });
});

app.get("/hrady-a-zamky/:trip", function (req, res) {
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            res.render("udalost", { trip: result });
        }
    });
});

app.get("/rozhledny-a-zriceniny/:trip", function (req, res) {
    //console.log(req.params.trip);
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            //console.log(trip);
            res.render("udalost", { trip: result });
        }
    });
});

app.get("/prochazky-prirodou/:trip", function (req, res) {
    //console.log(req.params.trip);
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            //console.log(trip);
            res.render("udalost", { trip: result });
        }
    });
});

app.get("/pro-pary-a-kamarady/:trip", function (req, res) {
    //console.log(req.params.trip);
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            //console.log(trip);
            res.render("udalost", { trip: result });
        }
    });
});

app.get("/s-rodinou/:trip", function (req, res) {
    //console.log(req.params.trip);
    Trip.findOne({ url: req.params.trip }, function (err, result) {
        if (result == null) {
            //console.log(err);
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        } else {
            //console.log(trip);
            res.render("udalost", { trip: result });
        }
    });
});

app.post("/vyhledavani", function (req, res) {
    const search = req.body.vyhledavani
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ - /g, " ")
        .replace(/ /g, "-");
    console.log(search);
    Trip.find({ url: { $regex: ".*" + search + ".*" } }, function (err, results) {
        if (err) {
            //console.log(err);
            res.redirect("/");
        } else {
            console.log(results);
            res.render("udalosti_seznam", {
                category_description: "Zkuste vyhledávání na webu CoPodniknout a najděte si výlet.",
                category_background: "title_vyhledavani",
                category_keywords: "vyhledávání, co podniknout",
                category_title: "Vyhledávání",
                category_title_url: "vyhledavani",
                url: "vyhledavani",
                trips: results,
            });
        }
    });
});

app.get("/vyhledavani/:dotaz", function (req, res) {
    const search = req.params.dotaz
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ - /g, " ")
        .replace(/ /g, "-");
    Trip.find({ url: { $regex: ".*" + search + ".*" } }, function (err, results) {
        if (err) {
            //console.log(err);
            res.redirect("/");
        } else {
            res.render("udalosti_seznam", {
                category_description: "Zkuste vyhledávání na webu CoPodniknout a najděte si výlet.",
                category_background: "title_vyhledavani",
                category_keywords: "vyhledávání, co podniknout",
                category_title: "Vyhledávání",
                url: "vyhledavani",
                trips: results,
            });
        }
    });
});

app.get("/sitemap.xml", function (req, res) {
    res.sendFile("sitemap.xml");
});

app.get("/robots.txt", function (req, res) {
    res.sendFile("robots.txt");
});

//error handler
app.all("/*", function (res, req) {
    throw new Error("Bad request");
});

app.use(function (e, req, res, next) {
    // respond with html page
    if (req.accepts("html") || e.message == "Bad request") {
        if (req.headers.host == "blog.copodniknout.cz") {
            res.sendFile(__dirname + "/views/blog_error.html");
        } else {
            res.render("error_page", { error: "Požadovaná stránka nebyla nalezena :(" });
        }
        return;
    }
});

// listen
app.listen(5000);
