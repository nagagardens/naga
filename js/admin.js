

function get_naga_members()
  {
    
    const api_url = 'https://g1t81zygbh.execute-api.us-east-1.amazonaws.com/prod/get_naga_members';
    var root = document.getElementById('root');
      
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .then(response => {

          //alert(JSON.stringify(response['body']['Items']));

            response['body']['Items'].forEach(element => 
                {
                    email=JSON.stringify(element['email']['S']).replace(/["']/g, "");
                    first_name=JSON.stringify(element['first_name']['S']).replace(/["']/g, "");
                    last_name=JSON.stringify(element['last_name']['S']).replace(/["']/g, "");
                    street_address=JSON.stringify(element['street_address']['S']).replace(/["']/g, "");
                    city=JSON.stringify(element['city']['S']).replace(/["']/g, "");
                    province=JSON.stringify(element['province']['S']).replace(/["']/g, "");
                    postal_code=JSON.stringify(element['postal_code']['S']).replace(/["']/g, "");
                    phone_number=JSON.stringify(element['phone_number']['S']).replace(/["']/g, "");
                    
                    full_name=first_name + " " + last_name;
                    full_address=street_address + "<br>" + city + ", " + province + "<br>" + postal_code;
                    
                    
                    root.insertAdjacentHTML('beforebegin', `<tr>
                    <td>${email}</td>
                    <td>${full_name}</td>
                    <td>${full_address}</td>
                    <td>${phone_number}</td>
                    
                    </tr>`)
                }
            );
        })
     
  
  
    
  }

