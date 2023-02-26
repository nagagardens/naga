

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
        get_my_waiting_list(email);

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
  
  
  fetch('https://ixih1qmuzb.execute-api.us-east-1.amazonaws.com/prod', {
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
  .then(response => { console.log(JSON.stringify(response)); getUserAttributes();})
    
}


function get_my_plots(email){
  
  const api_url = 'https://90oukjmsob.execute-api.us-east-1.amazonaws.com/prod/get_my_plots?email=' + encodeURIComponent(email);;
  
  document.getElementById('my_plots_table').innerHTML="<tr><th>Plot Id</th><th>Plot Type</th><th>Status</th><th >Renewal date</th><th width=120>Actions</th></tr><tr id='my_plots_list'></tr></table>";
  
  var my_plots_list = document.getElementById('my_plots_list');
  var no_plots=true;

  fetch(api_url, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(response => { 
    
    response.forEach(element => {
     // alert(JSON.stringify(element));
      plotId=JSON.stringify(element['plotId']['S']).replace(/["']/g, "");
      if(element['plot_type']) { plot_type=JSON.stringify(element['plot_type']['S']).replace(/["']/g, "") } else {plot_type="";}
      if(element['occupant']) { occupant=JSON.stringify(element['occupant']['S']).replace(/["']/g, "") } else {occupant="";}
      actions="<input type=button value='Release' onclick='release_plot(\""+ plotId +"\")'>";

      if(occupant == email){

        no_plots=false; 
        my_plots_list.insertAdjacentHTML('beforebegin', `<tr>
          <td>${plotId}</td>
          <td>${plot_type}</td>
          <td>Paid</td>
          <td>Feb 28, 2024</td>
          <td>${actions}</td>
        </tr>`)

      };
    });
    if(no_plots) { document.getElementById("my_plots_table").innerHTML="You have no plots assigned to you at the moment."}
  })

}


function get_my_waiting_list(email){
  
  var no_waiting_list = true;
  
  const api_url = 'https://70tip4ggnj.execute-api.us-east-1.amazonaws.com/prod/get_my_waiting_list?email=' + encodeURIComponent(email);
  fetch(api_url, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(response => { 
      
      if(response['Item']){
        if(response['Item']['plot_type']) { plot_type=JSON.stringify(response['Item']['plot_type']).replace(/["']/g, "") } else {plot_type="";}
        if(response['Item']['plot_number']) { plot_number=JSON.stringify(response['Item']['plot_number']).replace(/["']/g, "") } else {plot_number="";}
        if(response['Item']['date_added']) { date_added=JSON.stringify(response['Item']['date_added']).replace(/["']/g, "") } else {date_added="";}
        actions="<input type=button value='Remove' onclick='delete_from_waiting_list(\""+response['Item']['email']+"\")'>";
        no_waiting_list=false; 

        document.getElementById('my_waiting_list_table').innerHTML=`
          <tr>
            <th>Plot type</th>
            <th>Plot number</th>
            <th>Date joined</th>
            <th>Status</th>
            <th width=120>Actions</th>
          </tr>
          <tr>
            <td>`+plot_type+`</td>
            <td>`+plot_number+`</td>
            <td>`+date_added+`</td>
            <td>You are #34 in line</td>
            <td>`+actions+`</td>
          <tr>
        </table>`;

      }
      
      
    if (no_waiting_list) {document.getElementById("request_plot_container").style.display="block";
    document.getElementById("my_waiting_list_container").style.display="none";}else {document.getElementById("request_plot_container").style.display="none";
    document.getElementById("my_waiting_list_container").style.display="block";}
    })
}

function add_to_waiting_list(){
    
  email = document.getElementById('member_email').innerHTML;
  plot_type = document.getElementById('request_plot_type').value;
  plot_number = document.getElementById('request_plot_number').value;
  has_plots=false;


  
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
  .then(response => { console.log(JSON.stringify(response));get_my_waiting_list(email);get_waiting_list();})
    
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


function release_plot(plotId){if(confirm("Are you sure you want to give up this plot? You will have to join the waiting list to get it back!")==true){
  email = document.getElementById('member_email').innerHTML;
    fetch('https://q1hk67hzpe.execute-api.us-east-1.amazonaws.com/prod/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "plotId": plotId,
        "occupant":""
    })
    })
    .then(response => response.json())
    .then(response => { console.log(JSON.stringify(response));get_my_plots(email); get_plots();})
    
  }
    

}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function delete_from_waiting_list(email){if(confirm("Do you want to  remove "+email+" from the waiting list?")==true){
  
  const api_url = 'https://naqr1xdbd7.execute-api.us-east-1.amazonaws.com/prod/delete_from_waiting_list?email='+encodeURIComponent(email);
  
  fetch(api_url, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(response => {console.log(JSON.stringify(response)); get_my_waiting_list(email);get_waiting_list();})
}
  
}

function enable_perennial(value){
  if(value==1)
  {
    document.getElementById('request_plot_number').style.display="inline-block";
  } else { 
    document.getElementById('request_plot_number').style.display="none";
  }
}