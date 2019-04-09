var { admin , db } =require('./connectFirebase');

module.exports.CheckToken = function(idToken) {

  admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      
      return uid;
    
  }).catch(function(error) {
    // Handle error
    console.log(error);
  });
  
}
