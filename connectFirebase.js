var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

// Initialise Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL
});

// Firestore Connection
var db = admin.firestore();

module.exports = { admin: admin, db: db };