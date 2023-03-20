var members_email =[];
var date_options = { year: 'numeric', month: 'long', day: 'numeric' };



function get_naga_members(){

    document.getElementById('admin_members_table').innerHTML=`
    <tr><th>Email</th>
    <th>Name</th>
    <th>Address</th>
    <th>Phone Number</th>
    <th>Admin</th>
    <th width=120>Actions</th>
    </tr><tr id='member_list'></tr></table>`;

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
            if(JSON.stringify(element['admin'])) { admin=JSON.stringify(element['admin']['BOOL']); } else {admin="";} 
            full_name=first_name + " " + last_name;
            full_address=street_address + "<br>" + city + ", " + province + "<br>" + postal_code;
            actions="<input type=button onclick='remove_member(\""+email+"\")' value='Remove'>";
            
            member_list.insertAdjacentHTML('beforebegin', `<tr>
                <td>${email}</td>
                <td>${full_name}</td>
                <td>${full_address}</td>
                <td>${phone_number}</td>
                <td>${admin} </td>
                <td>${actions}</td>
            </tr>`); 

        });
      
    })


}


function get_plots()
{
    document.getElementById('all_plots').innerHTML='<div id="all_plots_start"></div>';
    const api_url = 'https://q1ycf9s40a.execute-api.us-east-1.amazonaws.com/prod';
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => { 

        plot_types=JSON.parse(response); row=0;
        plot_types.forEach(plot_type => {
            row++
            document.getElementById('all_plots_start').insertAdjacentHTML('beforebegin', `
            <h3>${plot_type['Title']}</h3>

            <table class="list">
                <tr id="plots_row_${row}">
                </tr>
            </table><br><br>
            `);
            
            plot_type['Body'].forEach(plot => {
                
                plot_id=plot['plotId']['S'];
                
                if(plot['occupant']['S']) {occupant=plot['occupant']['S'];} else {occupant=""; };
                if(plot['height']['S']) {height=plot['height']['S'];} else {height=""};
                if(plot['width']['S']) {width=plot['width']['S'];} else {width=""};
                if(plot['rate']['S']) {rate=plot['rate']['S'];} else {rate=""};
                occupant_form = (`
                <div id='edit_plot_top_${plot_id}'>${occupant}</div>
                <div id='edit_plot_bottom_${plot_id}' style='display:none'>
                    <div class='autocomplete'><input id='occupant_${plot_id}' type='text' placeholder="Email address" name='occupant_${plot_id}' value='${occupant}' style="width:200px"></div>
                    <br><br> or select from waiting list: 
                    <br> <select style="width:200px;" onchange='select_from_waiting_list("${plot_id}")' id='select_from_waiting_list_${plot_id}'><option></option></select>
                </div>
                   
                `)

                document.getElementById("plots_row_"+row).insertAdjacentHTML('afterend', `
                <tr>
                <td valign=top>
                    <div class="in_line"><b>Plot number:</b><br><h3><span id="edit_plot_number_${plot_id}">${plot_id}</span></h3></div>
                    <div class="in_line"><b>Size:</b><br><input disabled  class="edit_plot" style="width:40px; text-align:center;" type="text" id="edit_plot_height_${plot_id}" value="${height}">
                        x<input disabled  class="edit_plot" style="width:40px; text-align:center;" type="text" id="edit_plot_width_${plot_id}" value="${width}"></div>
                    <div class="in_line"><b>Rate:</b><br> $<input disabled  class="edit_plot"  style=" width:50px" type="text" id="edit_plot_rate_${plot_id}" value="${rate}"></div>
                    <div class="in_line"><b>Occupant:</b>${occupant_form}</div><br>
                
                    <div class="in_line" id="edit_plot_buttons1_${plot_id}">
                        <input type='button' onclick='open_edit_plot("${plot['plotId']['S']}","${plot['plot_type']['S'] }")' value='Edit'>
                        <input type='button' onclick='remove_plot("${plot['plotId']['S']}")' value='Delete' style='background-color:tomato'>
                    </div>
                    <div class="in_line" id="edit_plot_buttons2_${plot_id}" style="display:none">
                        <input type='button'  onclick='edit_plot("${plot_id}",document.getElementById("occupant_${plot_id}").value);' value='Submit'>  
                        <input type='button'  onclick='close_edit_plot("${plot_id}")' value='Cancel 'style='background-color:tomato'><br><br>
                    </div>
                </td>
                </tr>`);

                autocomplete(document.getElementById("occupant_"+ plot_id), members_email);
                

            });

        });

        console.log('All plots loaded')

        
    });

}

function edit_plot(plot_id, email){
    
    height=document.getElementById("edit_plot_width_"+plot_id).value;
    width=document.getElementById("edit_plot_height_"+plot_id).value;
    rate=document.getElementById("edit_plot_rate_"+plot_id).value;
    console.log(plot_id+email+height+width+rate)
    fetch('https://cwjjxnn2dd.execute-api.us-east-1.amazonaws.com/prod/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "plotId": plot_id,
        "occupant":email,
        "height":height,
        "width":width,
        "rate":rate

    })
    })
    .then(response => response.json())
    .then(response => { 
        
        console.log(JSON.stringify(response));
        delete_from_waiting_list(email);
        get_plots();
        
        
    
    })
    

    
}

function add_plot()
  {
    
    fetch('https://phpiuxuth7.execute-api.us-east-1.amazonaws.com/prod', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "plotId": document.getElementById('input_plotId').value,
        "plot_type":document.getElementById('input_plot_type').value,
        "height":document.getElementById('input_plot_height').value,
        "width":document.getElementById('input_plot_width').value,
        "rate":document.getElementById('input_plot_rate').value
    })
    })
    .then(response => response.json())
    .then(response => { console.log(JSON.stringify(response));get_plots();})
    
    
  }

function remove_plot(plot_id){if(confirm("Are you sure you want to remove this plot? This cannot be undone.")==true){
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
}


  function open_edit_plot(plot_id,plot_type){

    const api_url = 'https://omwtz3crjb.execute-api.us-east-1.amazonaws.com/prod';
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => { 
        response=JSON.parse(response);
        response.forEach(element => {
        
        if(element['Title']==plot_type){
            element['Body'].reverse();
            element['Body'].forEach(item => {
                var select = document.getElementById("select_from_waiting_list_"+plot_id);
                var el = document.createElement("option");
                el.textContent = item['place']['N'] + " " + JSON.stringify(item['email']['S']).replace(/["']/g, "");
                el.value = JSON.stringify(item['email']['S']).replace(/["']/g, "");
                select.appendChild(el);
                
            });
        }
        

    });

    document.getElementById("edit_plot_width_"+plot_id).disabled=false;
    document.getElementById("edit_plot_height_"+plot_id).disabled=false;
    document.getElementById("edit_plot_rate_"+plot_id).disabled=false;
    document.getElementById("edit_plot_top_" + plot_id).style.display="none";
    document.getElementById("edit_plot_bottom_" + plot_id).style.display="block";
    document.getElementById("edit_plot_buttons1_" + plot_id).style.display="none";
    document.getElementById("edit_plot_buttons2_" + plot_id).style.display="block";

    
    })

    


    

  }


function close_edit_plot(plot_id){
    document.getElementById("edit_plot_width_"+plot_id).disabled=true;
    document.getElementById("edit_plot_height_"+plot_id).disabled=true;
    document.getElementById("edit_plot_rate_"+plot_id).disabled=true;
    document.getElementById("edit_plot_top_" + plot_id).style.display="block";
    document.getElementById("edit_plot_bottom_" + plot_id).style.display="none";
    document.getElementById("edit_plot_buttons1_" + plot_id).style.display="block";
    document.getElementById("edit_plot_buttons2_" + plot_id).style.display="none";
    
  }



function select_from_waiting_list(plot_id){
    value=document.getElementById("select_from_waiting_list_"+plot_id).value;
    document.getElementById("occupant_"+plot_id).value=value;
  
}

  
function get_waiting_list()
{
    
    document.getElementById('all_waiting_lists').innerHTML='<div id="waiting_list"></div>';
    const api_url = 'https://omwtz3crjb.execute-api.us-east-1.amazonaws.com/prod';
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {  
        
        plot_types=JSON.parse(response); row=0; waiting_list_id=0;
        plot_types.forEach(plot_type => {
            row++
            
            document.getElementById('waiting_list').insertAdjacentHTML('beforebegin', `
            <h3>${plot_type['Title']}</h3>

            <table class="list">
                <tr id="waiting_list_row_${row}">
                </tr>
            </table><br><br>
            `);
            
            
            plot_type['Body'].forEach(item => {

                waiting_list_id++

                if(item['has_plots']['BOOL']==true) { has_plots="<img src='img/checkmark.png' alt='Active NAGA member' width='15'>" } else { has_plots=""}
                document.getElementById("waiting_list_row_"+row).insertAdjacentHTML('afterend', `<tr>
                
                <td valign=top>
                    <div class="in_line"><b>Position:</b><h3># ${item['place']['N']}</h3></div>
                    <div class="in_line"><b>Member email:</b><br><span id="assign_plot_email_${waiting_list_id}">${item['email']['S']}</span> ${has_plots }</div>
                    <div class="in_line"><b>Desired plot:</b><br> ${item['plot_number']['S']}</div>
                    <div class="in_line"><b>Date joined:</b><br> ${new Date(item['date_added']['S']).toLocaleDateString("en-US", date_options)} </div>
                    
                    <br>
                    <div class="in_line">
                        <div id="assign_plots_top_${waiting_list_id}">
                            <input type='button' onclick='open_assign_plot(\"${waiting_list_id}\",\"${plot_type['Title']}\")' value='Assign'>
                            <input type='button' onclick='delete_from_waiting_list(\"${item['email']['S']}\")' style="background-color:tomato" value='Delete'>
                        </div>
                        <div id="assign_plots_bottom_${waiting_list_id}" style="display:none">
                        <b> Select from available plots:</b>
                        <br> <select style="width:200px;" id='assign_plot_list_${waiting_list_id}'></select>
                        <br><br> <input type='button' onclick='assign_plot(\"${waiting_list_id}\")' value='Submit'>
                            <input type='button' onclick='close_assign_plot(\"${waiting_list_id}\")' style="background-color:tomato" value='Cancel'>
                        </div>
                    </div>
                </td>
                </tr>`);
            });

        });

        console.log('All waiting lists loaded')
    
    });

}


function open_assign_plot(waiting_list_id,plot_type){
    get_empty_plots(plot_type,waiting_list_id);
    document.getElementById('assign_plots_top_'+waiting_list_id).style.display="none";
    document.getElementById('assign_plots_bottom_'+waiting_list_id).style.display="inline-block";
    
}

function close_assign_plot(waiting_list_id){
    document.getElementById('assign_plots_top_'+waiting_list_id).style.display="inline-block";
    document.getElementById('assign_plots_bottom_'+waiting_list_id).style.display="none";
}

function assign_plot(waiting_list_id){
    email=document.getElementById('assign_plot_email_'+waiting_list_id).innerHTML;
    console.log("email: " + email)
    plot_number=document.getElementById('assign_plot_list_'+waiting_list_id).value;
    console.log( JSON.stringify({ 
        "email": email,
        "plot_number":plot_number
    }))
    fetch('https://q1hk67hzpe.execute-api.us-east-1.amazonaws.com/prod/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "email": email,
        "plot_number":plot_number
    })
    })
    .then(response => response.json())
    .then(response => { 
        console.log(JSON.stringify(response));
        delete_from_waiting_list(email);
        close_assign_plot(waiting_list_id)});
               
}

function get_empty_plots(plot_type,waiting_list_id){
    var select = document.getElementById("assign_plot_list_"+waiting_list_id);
    select.innerHTML="";
    const api_url = 'https://jawb81aeuf.execute-api.us-east-1.amazonaws.com/prod/get_empty_plots?plot_type=' + encodeURIComponent(plot_type);
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
        console.log(element)
        
        var el = document.createElement("option");
        el.textContent = element['plotId']['S'];
        el.value = element['plotId']['S'];
        select.appendChild(el);
      });
  
      
    })
  
  }
  

function add_member(){
    
    email=document.getElementById('admin_input_email').value;
    first_name=document.getElementById('admin_input_first_name').value;
    last_name=document.getElementById('admin_input_last_name').value;
    street_address=document.getElementById('admin_input_street_address').value;
    city=document.getElementById('admin_input_city').value;
    province=document.getElementById('admin_input_province').value;
    postal_code=document.getElementById('admin_input_postal_code').value;
    phone_number=document.getElementById('admin_input_phone_number').value;
    admin=document.getElementById('admin_input_admin_checkbox').checked;
    
    fetch('https://baf4kiept7.execute-api.us-east-1.amazonaws.com/prod', {
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
        "phone_number":phone_number,
        "admin":admin
    })
    })
    .then(response => response.json())
    .then(response => { console.log(JSON.stringify(response));get_naga_members();})
    
    
}


function remove_member(email){if(confirm("Are you sure you want to remove this user? This cannot be undone.")==true){
    const api_url = 'https://ddgo7c2d6l.execute-api.us-east-1.amazonaws.com/prod/remove_member?email='+ encodeURIComponent(email);
    
  
    fetch(api_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(JSON.stringify(response)); 
        delete_from_waiting_list(email);
        get_naga_members();
    })
  
    
}}
