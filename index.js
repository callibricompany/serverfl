var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var { admin , db } =require('./connectFirebase');
var newToken = require('./refreshToken');
var createContactZoho = require('./createUser.js');

var accessToken = { access_token: '', expiration_date: ''};

require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Refreshing Token
var UpdateAuthToken = function (req, res, next) {

  var dt = new Date();
  if (accessToken.access_token== '' || accessToken.expiration_date < dt.getTime()) {
    var promise = new Promise(function(resolve, reject) {
      resolve(newToken());
    });
    
    promise.then(function(newToken) {
      var dt = new Date();
      
      dt.setSeconds( dt.getSeconds() + newToken.expires_in_sec - 10 )
              
      accessToken = { access_token: newToken.access_token, expiration_date: dt.getTime() };
              
      next();
    }).catch(function(error) {
      console.log(error);
    });
  } else {next()};
}

// Initial Root
app.get('/', UpdateAuthToken, function(req, res) {
  
  console.log(accessToken);
  res.send('Working...');
  
});

// Create a new user
app.post('/createUser', UpdateAuthToken, function(req, res) {
  
  var idToken = req.body.idToken;
  var UserDetail = {
    email: req.body.email,
    lastName : req.body.name, 
    firstName : req.body.firstname,
    phone : req.body.phone,
    description : req.body.company,
    independant : req.body.independant,
    company : req.body.company,
    organization : req.body.organization,
    supervisor: false,
    validated: false
    };

  admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
    var uid = decodedToken.uid;
    
    // Create contact in Zoho
    var result_zoho = createContactZoho(UserDetail, accessToken.access_token, uid);
    
    }).catch(function(error) {
      // Handle error
      console.log(error);
    });

  res.end('doc inserted');
  
});

// Redirect URI
app.get('/oauth2callback', function(req, res) {
  
  console.log(req.query);
  
  res.send('OK bobby');
  
});

// manage connection 
app.post('/checkauth', function(req, res) {

  var idToken = req.body.idToken;

  console.log('Id Token envoyé :' + idToken);
  res.send('Id Token envoyé :' + idToken);

  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    
    console.log(uid);

  }).catch(function(error) {
    // Handle error
  });

});

// Run server
app.listen(process.env.PORT);
console.log(process.env.PORT + ' Running');