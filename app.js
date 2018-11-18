var express = require('express'),
	config = require('./config'),
    db = require('./db'),
	bodyParser = require('body-parser'),
	app = express(),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	swig = require('swig');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(session({secret: 'anything', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view cache', false);
swig.setDefaults({cache: false});

app.locals = {

};

app.get('*', function(req, res, next) {
    if (req.session.auth === true) {  
        res.locals.auth = true;
    }
    next();
});

app.get("/", function(req, res) {
    res.render("index", { title: "The Future is Now" });
});

app.get("/products/", function(req, res) {
    db.get("products.json").then(function(products) {
        res.render("products", { title: "The Future is Now", products: products });
    });
});

app.get("/product/:ean/", function(req, res) {
    db.find("products.json", req.params.ean).then(function(product) {
        res.render("product", { title: "The Future is Now", product: product });
    });
});

app.get("/search/", function(req, res) {
    var query = req.session.query;
    delete req.session.query;
    db.search("products.json", query).then(function(products) {
        if (products[0]) {
            res.render("products", { title: "The Future is Now", products: products });
        }
        else {
            res.render("error", { title: "The Future is Not Here", code: 400, message: "There were no results." });
        } 
    });
});

app.get("/admin/", function(req, res) {
    if (req.session.auth === true) {
        db.get("products.json").then(function(products) {
            res.render("admin", { title: "Admin Panel", products: products, adminbtn: "logout" });
        });
    }
    else {
        res.render("login", { title: "Login", adminbtn: "none" })
    }
});

app.post("/auth/", function(req, res) {
    if (req.body.username == config.auth.username && req.body.password === config.auth.password) {
        req.session.auth = true;
        res.send({ auth: true });
    }
    else {
        res.send({ auth: false });
    }
});

app.post("/product/add/", function(req, res) {
    if (req.session.auth === true) {
        req.body.ean = parseInt(req.body.ean);
        req.body.price = parseFloat(req.body.price);
        req.body.status = "Live";
        db.add("products.json", req.body);
        res.render("./partials/entry", { product:  req.body });
    }
    else {
        res.sendStatus(401);
    }
});

app.post("/product/get/", function(req, res) {
    if (req.session.auth === true) {
        db.find("products.json", req.body.ean).then(function(resp) {
            res.send(resp);
        });
    }
    else {
        res.sendStatus(401);
    }
});

app.post("/product/edit/", function(req, res) {
    if (req.session.auth === true) {
        db.find("products.json", req.body.ean).then(function(product) {
            product.name = req.body.name;
            product.description = req.body.description;
            product.price = req.body.price;
            db.edit("products.json", req.body.ean, product);
            res.render("./partials/entry", { product: product });
        });
    }
    else {
        res.sendStatus(401);
    }
});

app.post("/product/status/", function(req, res) {
    if (req.session.auth === true) {
        db.find("products.json", req.body.ean).then(function(product) {
            if (product.status == "Live") {
                product.status = "Discontinued";
            }
            else {
                product.status = "Live";
            }
            db.edit("products.json", req.body.ean, product);
            res.render("./partials/entry", { product: product });
        });
    }
    else {
        res.sendStatus(401);
    }
});

app.post("/product/delete/", function(req, res) {
    if (req.session.auth === true) {
        db.remove("products.json", req.body.ean);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(401);
    }
});

app.post("/product/search/", function(req, res) {
    req.session.query = req.body.query;
    res.sendStatus(200);
});

app.get('/logout/', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

app.get('*', function(req, res, next) {
	res.render("error", { title: "The Future is Elsewhere", code: 404, message: "The resource you requested was not found." });
});

var server = app.listen(config.app.port, function() {
	console.log("Running on port " + 8559 + ".");
});