var express = require('express');
var app = express();
var cors = require('cors');


app.locals.pretty = false;
app.set('views', './views');
app.set('view engine', 'pug', );

app.use(express.static('views'));

const port = 80;

app.listen(port, () => {
	console.log("application server started");
});

app.get("/home", cors(), (req, res) => {
	res.render('home');
});

app.get("/admin", (req, res) => {
	res.render('admin');
});


