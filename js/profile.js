

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
        
        email=result[2].getValue();
        console.log(email);
        showUserInfo(email);
        get_my_plots(email);

      });

    });
  } else {
    console.log("User is signed-out");
    window.location.href='./index.html';
  }
}



async function showUserInfo(email) {
  
  // gets user from DynamoDB using email address  
  const api_url = 'https://thv3sn3j63.execute-api.us-east-1.amazonaws.com/prod/get_naga_user_by_email?user_email=' + encodeURIComponent(email);
  const api_response = await fetch(api_url);
  const api_data = await(api_response).json();
  console.log(api_data);
  document.getElementById('member_email').innerHTML =  JSON.parse(api_data['body'])['email'];

  if(JSON.parse(api_data['body'])['first_name'] != null) { document.getElementById('member_name').innerHTML =  JSON.parse(api_data['body'])['first_name']; }
  
  
  document.getElementById('sign-out').style.display = "block";
  document.getElementById('loader').style.display = "none";
  
  if(JSON.parse(api_data['body'])['first_name'] != null) { document.getElementById('input_first_name').value  =  JSON.parse(api_data['body'])['first_name'];}
  if(JSON.parse(api_data['body'])['last_name'] != null) { document.getElementById('input_last_name').value =  JSON.parse(api_data['body'])['last_name'];}
  if(JSON.parse(api_data['body'])['street_address'] != null) { document.getElementById('input_street_address').value =  JSON.parse(api_data['body'])['street_address'];}
  if(JSON.parse(api_data['body'])['city'] != null) { document.getElementById('input_city').value =  JSON.parse(api_data['body'])['city'];}
  if(JSON.parse(api_data['body'])['province'] != null) { document.getElementById('input_province').value =  JSON.parse(api_data['body'])['province'];}
  if(JSON.parse(api_data['body'])['postal_code'] != null) { document.getElementById('input_postal_code').value =  JSON.parse(api_data['body'])['postal_code'];}
  if(JSON.parse(api_data['body'])['phone_number'] != null) { document.getElementById('input_phone_number').value =  JSON.parse(api_data['body'])['phone_number']; }
    

  }


function update_profile(){
    
  email = document.getElementById('member_email').innerHTML;
  first_name = document.getElementById('input_first_name').value;
  last_name = document.getElementById('input_last_name').value;
  street_address = document.getElementById('input_street_address').value;
  city = document.getElementById('input_city').value;
  province = document.getElementById('input_province').value;
  postal_code = document.getElementById('input_postal_code').value;
  phone_number= document.getElementById('input_phone_number').value;
  
  
  fetch('https://wqh6v44q2m.execute-api.us-east-1.amazonaws.com/prod', {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
      "email": email,
      "first_name":first_name,
      "last_name":last_name,
      "street_address":street_address,
      "city":city,
      "province":province,
      "postal_code":postal_code,
      "phone_number":phone_number
  })
  })
  .then(response => response.json())
  .then(response => { console.log(JSON.stringify(response));getUserAttributes();})
    
}


function get_my_plots(email){
  
  const api_url = 'https://q1ycf9s40a.execute-api.us-east-1.amazonaws.com/prod';
  
  document.getElementById('my_plots_table').innerHTML="<tr><th width=100>Plot Id</th><th width=200>Plot Type</th><th>Status</th><th>Renewal date</th></tr><tr id='my_plots_list'></tr></table>";
  
  var my_plots_list = document.getElementById('my_plots_list');

  fetch(api_url, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(response => { response['body']['Items'].forEach(element => {
     // alert(JSON.stringify(element));
      plotId=JSON.stringify(element['plotId']['S']).replace(/["']/g, "");
      if(element['plot_type']) { plot_type=JSON.stringify(element['plot_type']['S']).replace(/["']/g, "") } else {plot_type="";}
      if(element['occupant']) { occupant=JSON.stringify(element['occupant']['S']).replace(/["']/g, "") } else {occupant="";}
      if(occupant == email){

      my_plots_list.insertAdjacentHTML('beforebegin', `<tr>
      <td>${plotId}</td>
      <td>${plot_type}</td>
      <td>Paid</td>
      <td>Feb 28, 2024</td>
  </tr>`)

      }
      

  });})
}

function add_to_waiting_list(){
    
  email = document.getElementById('member_email').innerHTML;
  plot_type = document.getElementById('input_plot_type').value;
  plot_number = document.getElementById('input_plot_number').value;
  
  fetch('https://ln7qb82w92.execute-api.us-east-1.amazonaws.com/prod', {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
      "email": email,
      "plot_type":plot_type,
      "plot_number":plot_number
  })
  })
  .then(response => response.json())
  .then(response => { console.log(JSON.stringify(response));get_my_plots(email);})
    
}