var express = require('express');
var app = express();
var cors = require('cors');


app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('views'));


app.listen(80, () => {
	console.log("application server started");
});

app.get("/", (req, res) => {
	res.render('login');
});

app.get("/home", cors(), (req, res) => {
	res.render('home');
});

app.get("/admin", (req, res) => {
	res.render('admin');
});

