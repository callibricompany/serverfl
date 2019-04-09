require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');
var { admin , db } =require('./connectFirebase');

async function createContactZoho( userDetail, token, uid) {
    
    var userDetailZoho = {
      email: userDetail.email,
      lastName : userDetail.lastName, 
      firstName : userDetail.firstName,
      phone : userDetail.phone,
      description : userDetail.company
      };
    
    let axiosConfig = {
      headers: {
          'orgId': process.env.ORGANISATION,
          'Authorization': 'Zoho-oauthtoken ' + token
      }
    };

    axios.post('https://desk.zoho.com/api/v1/contacts', userDetailZoho, axiosConfig)
    .then((res) => {
      console.log("RESPONSE RECEIVED: ", res.data.id);
      
      var userDetailFirebase = {
        email: userDetail.email,
        lastName : userDetail.lastName, 
        firstName : userDetail.firstName,
        phone : userDetail.phone,
        independant : userDetail.independant,
        company : userDetail.company,
        organization : userDetail.organization,
        supervisor: userDetail.supervisor,
        validated: userDetail.validated,
        zohocode: res.data.id
      };
      
      // Add a new document in collection "users"
      db.collection("users").doc(uid).set(userDetailFirebase)
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
      
      return 'contact inserted';
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    });

}

module.exports = createContactZoho;
