
function register() {

  email = document.getElementById('member_email').innerHTML;
  password = document.getElementById('inputPassword').value;
  first_name = document.getElementById('first_name').value;
  last_name = document.getElementById('last_name').value;
  street_address = document.getElementById('street_address').value;
  city = document.getElementById('city').value;
  province = document.getElementById('province').value;
  phone_number= document.getElementById('phone_number').value
  
  var data = { 
    UserPoolId : _config.cognito.userPoolId,
    ClientId : _config.cognito.clientId
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  var authenticationData = {
    Username : email,
    Password : password,
  };

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  
  var userData = {
    Username : email,
    Pool : userPool,
  };
  
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
  cognitoUser.authenticateUser(authenticationDetails, {
    
    onSuccess: function (result) {

      var accessToken = result.getAccessToken().getJwtToken();
      console.log(result);	
      
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        
        add_to_dynamodb(email,first_name);
        
        window.location.href='./profile.html';
    
      });

    },
      onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
    },
  });
    
}

function add_to_dynamodb (email,first_name){
  fetch(' https://wqh6v44q2m.execute-api.us-east-1.amazonaws.com/prod', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "email": "gofernando83@gmail.com","first_name":"lfer7" })
})
.then(response => response.json())
.then(response => console.log(JSON.stringify(response)))
}




function signInButton() {
      
  var data = { 
    UserPoolId : _config.cognito.userPoolId,
    ClientId : _config.cognito.clientId
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  var authenticationData = {
    Username : document.getElementById("inputUsername").value,
    Password : document.getElementById("inputPassword").value,
  };

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  
  var userData = {
    Username : document.getElementById("inputUsername").value,
    Pool : userPool,
  };
  
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
  cognitoUser.authenticateUser(authenticationDetails, {
    
    onSuccess: function (result) {

      var accessToken = result.getAccessToken().getJwtToken();
      console.log(result);	
      
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        window.location.href='./profile.html';
    
      });

    },
      onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
    },
  });
      
}


async function showUserInfo(email_address) {
  
  // gets user from DynamoDB using email address  
  const api_url = 'https://thv3sn3j63.execute-api.us-east-1.amazonaws.com/prod/get_naga_user_by_email?user_email=' + encodeURIComponent(email_address);
  const api_response = await fetch(api_url);
  const api_data = await(api_response).json();
  console.log(api_data);

  document.getElementById('member_name').innerHTML =  JSON.parse(api_data['body'])['first_name'];
  document.getElementById('member_email').innerHTML =  JSON.parse(api_data['body'])['email'];
  document.getElementById('sign-out').style.display = "block";
  document.getElementById('loader').style.display = "none";

  }

function getUserAttributes() {
  
  var data = {
    UserPoolId : _config.cognito.userPoolId,
    ClientId : _config.cognito.clientId
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if (err) {
        alert(err);
        return;
      }
      //console.log('session validity: ' + session.isValid());
      
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        // user email address
        
        console.log(result[2].getValue());
        showUserInfo(result[2].getValue())
      });

    });
  } else {
    console.log("Already signed-out")
    document.getElementById('sign-out').style.display = "none";
    document.getElementById('loader').style.display = "none";
    document.getElementById('sign-in').style.display="block";
  }
}



function signOut() {

  document.getElementById('loader').style.display = "block";
  document.getElementById('sign-out').style.display = "none"
  
  const data = { 
      UserPoolId : _config.cognito.userPoolId,
    ClientId : _config.cognito.clientId
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  const cognitoUser = userPool.getCurrentUser();
  
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
      if (err) {
          alert(err);
        return;
      }
      console.log('session validity: ' + session.isValid());
      
            // sign out
            cognitoUser.signOut();
            console.log("Sign out successful");
            
      });
    } else {
        console.log("Already signed-out")
    }
    window.location.href='./index.html';
    
}

window.onload = function(){
  const temp_var = getUserAttributes();
}

