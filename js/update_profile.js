function update_profile()
  {
    
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
    .then(response => console.log(JSON.stringify(response)))
    
    getUserAttributes();
  }