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

function get_my_plots(){
  const api_url = 'https://q1ycf9s40a.execute-api.us-east-1.amazonaws.com/prod';
    
  document.getElementById('admin_plots_table').innerHTML="<tr><td width=100><b>Plot Id</b></td><td width=200><b>Plot Type</b></td><td><b>Occupant</b><td><b>Actions</b></td></td></tr><tr id='plot_list'></tr></table>";
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
      if(occupant == "gofernando83@gmail.com"){

      my_plots_list.insertAdjacentHTML('beforebegin', `<tr>
      <td>${plotId}</td>
      <td>${plot_type}</td>
  </tr>`)

      }
      

  });})
}

function add_to_waiting_list(){
    alert(uuidv4());
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  
