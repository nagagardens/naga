var members_email =[""];

function get_naga_members(){
    const api_url = 'https://g1t81zygbh.execute-api.us-east-1.amazonaws.com/prod/get_naga_members';
    var member_list = document.getElementById('member_list');
    
      
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        
        response['body']['Items'].forEach(element => {
            email=JSON.stringify(element['email']['S']).replace(/["']/g, "");
            members_email.unshift(email);
            first_name=JSON.stringify(element['first_name']['S']).replace(/["']/g, "");
            last_name=JSON.stringify(element['last_name']['S']).replace(/["']/g, "");
            street_address=JSON.stringify(element['street_address']['S']).replace(/["']/g, "");
            city=JSON.stringify(element['city']['S']).replace(/["']/g, "");
            province=JSON.stringify(element['province']['S']).replace(/["']/g, "");
            postal_code=JSON.stringify(element['postal_code']['S']).replace(/["']/g, "");
            phone_number=JSON.stringify(element['phone_number']['S']).replace(/["']/g, "");
            full_name=first_name + " " + last_name;
            full_address=street_address + "<br>" + city + ", " + province + "<br>" + postal_code;
            
            member_list.insertAdjacentHTML('beforebegin', `<tr>
                <td>${email}</td>
                <td>${full_name}</td>
                <td>${full_address}</td>
                <td>${phone_number}</td>
            </tr>`); 

        });
        //alert(members_email);
    })


}


function get_plots()
{
    const api_url = 'https://q1ycf9s40a.execute-api.us-east-1.amazonaws.com/prod';
    
    document.getElementById('admin_plots_table').innerHTML="<tr><td><b>Plot Id</b></td><td><b>Plot Type</b></td><td><b>Occupant</b><td><b>Actions</b></td></td></tr><tr id='plot_list'></tr></table>";
    var plot_list = document.getElementById('plot_list');
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => { response['body']['Items'].forEach(element => {
        
        plotId=JSON.stringify(element['plotId']['S']).replace(/["']/g, "");
        plot_type=JSON.stringify(element['plot_type']['S']).replace(/["']/g, "");
        occupant_form = "<div class='autocomplete'><input id='occupant_" + plotId + "' type='text' name='occupant_" + plotId + "' placeholder='Email address'></div> <Button>Assign</button>";
        
        plot_list.insertAdjacentHTML('beforebegin', `<tr>
            <td>${plotId}</td>
            <td>${plot_type}</td>
            <td width=300>${occupant_form}</td>
        </tr>`)

        autocomplete(document.getElementById("occupant_"+ plotId), members_email);
    });})

}



function add_plot()
  {
    
    plotId = document.getElementById('input_plotId').value;
    plot_type = document.getElementById('input_plot_type').value;
    
    fetch('https://phpiuxuth7.execute-api.us-east-1.amazonaws.com/prod', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "plotId": plotId,
        "plot_type":plot_type
    })
    })
    .then(response => response.json())
    .then(response => { console.log(JSON.stringify(response));get_plots();})
    
    
  }