var members_email =[""];
var waiting_list_emails =[""];

function get_naga_members(){

    document.getElementById('admin_members_table').innerHTML="<tr><th>Email</th><th>Name</th><th>Address</th><th>Phone Number</th><th width=120>Actions</th></tr><tr id='member_list'></tr></table>";

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
            actions="<input type=button value='Remove'>";
            
            member_list.insertAdjacentHTML('beforebegin', `<tr>
                <td>${email}</td>
                <td>${full_name}</td>
                <td>${full_address}</td>
                <td>${phone_number}</td>
                <td>${actions}</td>
            </tr>`); 

        });
        //alert(members_email);
    })


}


function get_plots()
{
    const api_url = 'https://q1ycf9s40a.execute-api.us-east-1.amazonaws.com/prod';
    
    document.getElementById('admin_plots_table').innerHTML="<tr><th>Plot Id</th><th>Plot Type</th><th>Occupant</th><th width=120>Actions</th></tr><tr id='plot_list'></tr></table>";
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
        if(element['plot_type']) { plot_type=JSON.stringify(element['plot_type']['S']).replace(/["']/g, "") } else {plot_type="";}
        if(element['occupant']) { occupant=JSON.stringify(element['occupant']['S']).replace(/["']/g, "") } else {occupant="";}
        
        // Assign plot workflow
        occupant_form = (
            "<div  id='plot_assign_top_"
            + plotId + "'>"+occupant+ " </div><div id='plot_assign_bottom_"
        + plotId + "' style='display:none'><b>Assign plot</b><br><br>Enter email address:<div class='autocomplete'><input style='width:400px; display: inline-block;' id='occupant_"
        + plotId + "' type='text' name='occupant_" + plotId + "' value='"
        +occupant+ "'></div><br><br>Or select from waiting list:<br><select onchange='select_from_waiting_list(\""
        + plotId + "\")' id='select_from_waiting_list_"
        + plotId + "'><option></option></select><br><br> <input type='checkbox' id='checkbox_delete_from_waiting_list_"
        +occupant + "' checked> Remove member from waiting list <br><br><input type='button'  onclick='assign_plot(\""
        + plotId + "\",document.getElementById(\"occupant_"
        + plotId + "\").value);' value='Submit'>  <input type='button'  onclick='close_assign_window(\""
        + plotId + "\")' value='Cancel 'style='background-color:tomato'><br><br></div>")

        plot_list.insertAdjacentHTML('beforebegin', `<tr>
            <td>${plotId}</td>
            <td>${plot_type}</td>
            <td width=480>${occupant_form}</td>
            <td valign=top>
                <input type='button' onclick='open_assign_window("${plotId}")' value='Assign'>
                <input type='button' onclick='remove_plot("${plotId}")' value='Remove'>
            </td>

        </tr>`)

        autocomplete(document.getElementById("occupant_"+ plotId), members_email);
    });})

}

function assign_plot(plotId, email){
    
    
    fetch('https://q1hk67hzpe.execute-api.us-east-1.amazonaws.com/prod/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "plotId": plotId,
        "occupant":email
    })
    })
    .then(response => response.json())
    .then(response => { 
        console.log(JSON.stringify(response));
      
        get_plots();
        
        
    
    })
    

    
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

function remove_plot(plot_id){
    email = document.getElementById('member_email').innerHTML;
    const api_url = ' https://un7umkeqkc.execute-api.us-east-1.amazonaws.com/prod/remove_plot?plotId='+plot_id;
    
  
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {console.log(JSON.stringify(response)); get_plots();})
  
    
}


  function open_assign_window(plot_id){
    
    var select = document.getElementById("select_from_waiting_list_"+plot_id);
    for(var i = 0; i < waiting_list_emails.length; i++) {
        var opt = waiting_list_emails[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
    document.getElementById("plot_assign_top_" + plot_id).style.display="none";
    document.getElementById("plot_assign_bottom_" + plot_id).style.display="block";


  }


function close_assign_window(plot_id){
    document.getElementById("plot_assign_top_" + plot_id).style.display="block";
    document.getElementById("plot_assign_bottom_" + plot_id).style.display="none";
  }



function select_from_waiting_list(plot_id){
    
    document.getElementById("occupant_"+plot_id).value=document.getElementById("select_from_waiting_list_"+plot_id).value
}


function get_waiting_list()
{
    const api_url = 'https://omwtz3crjb.execute-api.us-east-1.amazonaws.com/prod';
    
    document.getElementById('admin_waiting_list_table').innerHTML="<tr><th>Email</th><th>Plot Type</th><th>Plot Number</th><th>Date joined</th><th width=120>Actions</th></tr><tr id='waiting_list'></tr></table>";
    var waiting_list = document.getElementById('waiting_list');
    
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => { response['body']['Items'].forEach(element => {
        
        
        if(element['email']) { email=JSON.stringify(element['email']['S']).replace(/["']/g, "") } else {email="";}
        waiting_list_emails.unshift(email);
        if(element['plot_type']) { plot_type=JSON.stringify(element['plot_type']['S']).replace(/["']/g, "") } else {plot_type="";}
        if(element['plot_number']) { plot_number=JSON.stringify(element['plot_number']['S']).replace(/["']/g, "") } else {plot_number="";}
        if(element['date_added']) { date_added=JSON.stringify(element['date_added']['S']).replace(/["']/g, "") } else {date_added="";}
        actions="<input type='button' onclick='delete_from_waiting_list(\""+JSON.stringify(element['email']['S']).replace(/["']/g, "")+"\")' value='Remove'>";

        waiting_list.insertAdjacentHTML('beforebegin', `<tr>
            <td>${email}</td>
            <td>${plot_type}</td>
            <td width=>${plot_number}</td>
            <td width=>${date_added}</td>
            <td width=>${actions}</td>
        </tr>`)

    });})

}