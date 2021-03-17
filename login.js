var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : '13.233.183.250',
	port     :  '3306',
	user     : 'root',
	password : 'Dbpwd@123',
	database : 'nodelogin'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/signup', function (req, res,html) {
 res.sendFile(path.join(__dirname+'/sign-up.html'));
});

app.get('/styles', function (req, res,css) {
	res.sendFile(path.join(__dirname+'/login.css'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/addin', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var email = request.body.email;
	if (username && password && email) {
		connection.query("INSERT INTO accounts (`username`, `password`, `email`) VALUES (?, ?, ?)" , [username, password, email], function(error, results, fields) {
			if (error) {
				response.send(error);
			} else {
				request.session.newloggedin = true;
				request.session.username = username;
				response.redirect('/home');
			}
			response.end();
		});
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else if (request.session.newloggedin) {
		response.send('Welcome, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(3000);

