var express = require('express');
var admin = require('firebase-admin');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();

var serviceAccount = require('./serviceAccountKey.json');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL
});

app.get('/', function(req, res) {
  res.send('Cerveau Névralgique Opérationnel !');
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.firestore();

  /* var citiesRef = db.collection('users');
  var allCities = citiesRef.get()
  .then(snapshot => {
  snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
  });
  })
  .catch(err => {
  console.log('Error getting documents', err);
  }); */

app.post("/", function(req,res) {
  
  var idToken = req.body.idToken;
  
  console.log(idToken);
  res.send('Résultat:' + idToken);
  
})


  // manage connection 
app.post('/checkauth', function(req, res) {

  var idToken = req.body.idToken;

  console.log('Id Token envoyé :' + idToken)
  res.send('Id Token envoyé :' + idToken);

  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    
    console.log(uid);

  }).catch(function(error) {
    // Handle error
  });

});

app.listen(process.env.PORT, '172.31.23.116');
console.log(process.env.PORT + ' Running');