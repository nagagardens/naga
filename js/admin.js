
var date_options = { year: 'numeric', month: 'long', day: 'numeric' };

// MEMBER FUNCTIONS 

function get_naga_members(){


    members_table=document.getElementById('all_members').innerHTML;
    members_table=`<table class="list">`;
    row=0;
    members_email =[];

    const api_url = 'https://g1t81zygbh.execute-api.us-east-1.amazonaws.com/prod/get_naga_members';
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
            row++;
            
            email=JSON.stringify(element['email']['S']).replace(/["']/g, "");
            members_email.unshift(email);
            first_name=JSON.stringify(element['first_name']['S']).replace(/["']/g, "");
            last_name=JSON.stringify(element['last_name']['S']).replace(/["']/g, "");
            street_address=JSON.stringify(element['street_address']['S']).replace(/["']/g, "");
            city=JSON.stringify(element['city']['S']).replace(/["']/g, "");
            province=JSON.stringify(element['province']['S']).replace(/["']/g, "");
            postal_code=JSON.stringify(element['postal_code']['S']).replace(/["']/g, "");
            phone_number=JSON.stringify(element['phone_number']['S']).replace(/["']/g, "");
            last_logged_in="";
            if(element['admin']['BOOL']== true) {  admin_checkbox="checked"; admin_message="<img src=img/checkmark.png width=15> Admin"; } else { admin_checkbox=""; admin_message=""; } 
            full_name=first_name + " " + last_name;
            full_address=street_address + "<br>" + city + ", " + province + "<br>" + postal_code;
            
            members_table=members_table+ `
                <tr>
                <td valign=top>
                    <div id="display_member_info_${row}">
                        <div class="in_line">
                            <b>Email:</b><br><span>${email}</span>
                            <br><br>${admin_message}
                        </div>
                        <div class="in_line"><b>Name:</b><br>${full_name}</div>
                        <div class="in_line"><b>Address:</b><br>${full_address}</div>
                        <div class="in_line"><b>Phone number:</b><br>${phone_number}</div>
                        <div class="in_line"><b>Last logged in:</b><br>${last_logged_in}</div>
                        <br><div class="in_line">
                        <input type=button onclick='open_edit_member(${row})' value='Edit' >
                        <input type=button onclick='remove_member("${email}")' value='Delete' style="background-color:tomato">
                        </div>

                    </div>
                    <div id="edit_member_info_${row}" style="display:none">
                        <div class="in_line">
                            <b>Email:</b>
                            <br><span id="edit_member_email_${row}">${email}</span> 
                            <br><br><input type="checkbox" id="edit_member_admin_${row}" ${admin_checkbox}> Admin
                        </div>
                        <div class="in_line">
                            <b>Name:</b>
                            <br><input id="edit_member_first_name_${row}" type="text" Placeholder="First Name" value="${first_name}">
                            <br><input id="edit_member_last_name_${row}"  type="text"  Placeholder="Last Name" value="${last_name}" > 
                        </div>
                        <div class="in_line">
                            <b>Address:</b>
                            <br><input id="edit_member_street_address_${row}"  type="text" Placeholder="Street Address"  value="${street_address}">
                            <br><input id="edit_member_city_${row}"  type="text" style="width:85px" placeholder="City"  value="${city}">
                            <select id="edit_member_province_${row}"  style="width:70px"> <option>${province}</option><option value="AB">AB</option><option value="BC">BC</option><option value="MB">MB</option><option value="NB">NB</option><option value="NL">NL</option><option value="NS">NS</option><option value="ON" selected>ON</option><option value="PE">PE</option><option value="QC">QC</option><option value="SK">SK</option><option value="NT">NT</option><option value="NU">NU</option><option value="YT">YT</option></select>	
                            <br><input id="edit_member_postal_code_${row}"  type="text" Placeholder="Postal Code" value="${postal_code}">
                        </div>
                        <div class="in_line">
                            <b>Phone Number:</b>
                            <br><input id="edit_member_phone_number_${row}" type="text" Placeholder="000-000-0000" value="${phone_number}">
                        </div>
                        <div class="in_line">
                            <b>Last logged in:</b>
                            <br>${last_logged_in}
                        </div>
                        <br><br><input type="button" onclick="edit_member(${row})" value="Save"> 
                        <input type="button" onclick="close_edit_member(${row})" value="Cancel" style="background-color:tomato">
                        <br><br>
                    </div>
                </td>
            
            </tr>`; 

        });
        
        document.getElementById('all_members').innerHTML=members_table+"</table>";
        
    });


}

function edit_member (row){
    
    email = document.getElementById('edit_member_email_'+row).innerHTML;
    first_name = document.getElementById('edit_member_first_name_'+row).value;
    last_name = document.getElementById('edit_member_last_name_'+row).value;
    street_address = document.getElementById('edit_member_street_address_'+row).value;
    city = document.getElementById('edit_member_city_'+row).value;
    province = document.getElementById('edit_member_province_'+row).value;
    postal_code = document.getElementById('edit_member_postal_code_'+row).value;
    phone_number= document.getElementById('edit_member_phone_number_'+row).value;
    admin= document.getElementById('edit_member_admin_'+row).checked;
    
    
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
        "phone_number":phone_number,
        "admin":admin
    })
    })
    .then(response => response.json())
    .then(response => { console.log(response); get_naga_members();})
      
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
    .then(response => { console.log(response);close_add_member();get_naga_members();})
    
    
}

function open_add_member(){
    document.getElementById('add_member_form').style.display="block";
    document.getElementById('admin_controls_members').style.display="none";
}

function close_add_member(){
    document.getElementById('add_member_form').style.display="none";
    document.getElementById('admin_controls_members').style.display="block";
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


function open_edit_member (row) {
    document.getElementById('display_member_info_'+row).style.display='none';
    document.getElementById('edit_member_info_'+row).style.display='block';

}


function close_edit_member (row) {
    document.getElementById('display_member_info_'+row).style.display='block';
    document.getElementById('edit_member_info_'+row).style.display='none';

}









// PLOT FUNCTIONS

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
             <h3 style="padding-left:15px">${plot_type['Title']}</h3><br>

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
                if(plot['date_assigned']) {date_assigned=plot['date_assigned']['S'];} else {date_assigned=""};
                if(plot['payment']) {payment=plot['payment']['S'];} else {payment=""};
                if(payment=="Awaiting payment") { awaiting_selected="selected"; overdue_selected=""; paid_selected=""}
                else if(payment=="Payment overdue") { awaiting_selected=""; overdue_selected="selected";paid_selected="selected"}
                else if(payment=="Paid") { awaiting_selected=""; overdue_selected="";paid_selected="selected"}
                else { awaiting_selected=""; overdue_selected="";paid_selected="";}

                document.getElementById("plots_row_"+row).insertAdjacentHTML('afterend', `
                <tr>
                <td valign=top>
                    <div id="show_plot_info_${plot_id}">

                        <div class="in_line">
                            <b>Plot number:</b>
                            <br><h3><span>${plot_id}</span></h3>
                        </div>

                        <div class="in_line">
                            <b>Size:</b>
                            <br>${height} x ${width}
                        </div>

                        <div class="in_line">
                            <b>Rate:</b>
                            <br>$${rate}
                        </div>
                        
                        <div class="in_line">
                            <b>Occupant:</b>
                            <br>${occupant}
                        </div>

                        <div class="in_line">
                            <b>Date Assigned:</b>
                            <br> ${date_assigned}
                        </div>

                        <div class="in_line">
                            <b>Status:</b>
                            <br>${payment}
                        </div>

                        <br>
                        <input type='button' onclick='open_edit_plot("${plot['plotId']['S']}","${plot['plot_type']['S'] }")' value='Edit'>
                        <input type='button' onclick='remove_plot("${plot['plotId']['S']}")' value='Delete' style='background-color:tomato'>
                    
                    </div>

                    <div id="edit_plot_info_${plot_id}" style="display:none">

                        <div class="in_line">
                            <b>Plot number:</b>
                            <br><h3><span id="edit_plot_number_${plot_id}">${plot_id}</span></h3>
                        </div>

                        <div class="in_line">
                            <b>Size:</b>
                            <br><input  style="width:40px; text-align:center;" type="text" id="edit_plot_height_${plot_id}" value="${height}">
                            x <input style="width:40px; text-align:center;" type="text" id="edit_plot_width_${plot_id}" value="${width}">
                        </div>

                        <div class="in_line">
                            <b>Rate:</b>
                            <br> $<input style=" width:50px" type="text" id="edit_plot_rate_${plot_id}" value="${rate}">
                        </div>
                        
                        <div class="in_line">
                            <b>Occupant:</b>
                            <div class='autocomplete'><input id='occupant_${plot_id}' onchange='chage_assigned_date("${plot_id}")' type='text' placeholder="Email address" name='occupant_${plot_id}' value='${occupant}' style="width:200px"></div>
                            <br><br> or select from waiting list: 
                            <br> <select style="width:200px;" onchange='select_from_waiting_list("${plot_id}")' id='select_from_waiting_list_${plot_id}'><option></option></select>
                        </div>

                        <div class="in_line">
                            <b>Date Assigned:</b>
                            <br> <input type="text" id="edit_plot_date_assigned_${plot_id}" value="${date_assigned}">
                        </div>

                        <div class="in_line">
                            <b>Status:</b><br>
                            <select id="edit_plot_status_${plot_id}">
                                <option></option>
                                <option value="Awaiting payment" ${awaiting_selected}>Awaiting payment</option>
                                <option value="Payment overdue" ${overdue_selected}>Payment overdue</option>
                                <option value="Paid" ${paid_selected}>Paid</option>
                            </select>
                        </div>

                        <br>
                        <input type='button'  onclick='edit_plot("${plot_id}",document.getElementById("occupant_${plot_id}").value);' value='Submit'>  
                        <input type='button'  onclick='close_edit_plot("${plot_id}")' value='Cancel 'style='background-color:tomato'>

                    </div>


                        <div class="in_line" id="edit_plot_buttons1_${plot_id}">
                        </div>
                        <div class="in_line" id="edit_plot_buttons2_${plot_id}" style="display:none">
                           
                        </div>
                </td>
                </tr>`);

                
                

            });

        });

        console.log('All plots loaded')

        
    });

}

function edit_plot(plot_id, email){
    
    height=document.getElementById("edit_plot_height_"+plot_id).value;
    width=document.getElementById("edit_plot_width_"+plot_id).value;
    rate=document.getElementById("edit_plot_rate_"+plot_id).value;
    date_assigned=document.getElementById("edit_plot_date_assigned_"+plot_id).value;
    payment=document.getElementById("edit_plot_status_"+plot_id).value;
    
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
        "rate":rate,
        "payment":payment,
        "date_assigned":date_assigned

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
    .then(response => { console.log(response);  close_add_plot(); get_plots();})
    
    
  }


function open_add_plot(){
    document.getElementById('add_plot_form').style.display="block";
    document.getElementById('admin_controls_plots').style.display="none";
}

function close_add_plot(){
    document.getElementById('add_plot_form').style.display="none";
    document.getElementById('admin_controls_plots').style.display="block";
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
    autocomplete(document.getElementById("occupant_"+ plot_id), members_email);

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

    document.getElementById("show_plot_info_"+plot_id).style.display="none";
    document.getElementById("edit_plot_info_"+plot_id).style.display="block";

    
    })

    


    

  }


function close_edit_plot(plot_id){
    
    document.getElementById("show_plot_info_"+plot_id).style.display="block";
    document.getElementById("edit_plot_info_"+plot_id).style.display="none";
    
  }


function select_from_waiting_list(plot_id){
    value=document.getElementById("select_from_waiting_list_"+plot_id).value;
    document.getElementById("occupant_"+plot_id).value=value;
    chage_assigned_date(plot_id);
  
}


function chage_assigned_date(plot_id){
    
    document.getElementById("edit_plot_date_assigned_"+plot_id).value= new Date().toLocaleDateString("en-US", date_options);
}




/// WAITING LIST FUNCTIONS
  
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
            <h3 style="padding-left:15px">${plot_type['Title']}</h3><br>

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
                    <div style="min-width:50px" class="in_line"><b>Position:</b><h3># ${item['place']['N']}</h3></div>
                    <div class="in_line"><b>Email:</b><br><span id="assign_plot_email_${waiting_list_id}">${item['email']['S']}</span> ${has_plots }</div>
                    <div class="in_line"><b>Desired plot:</b><br> ${item['plot_number']['S']}</div>
                    <div class="in_line"><b>Trade:</b><br> ${item['trade_option']['S']}</div>
                    <div class="in_line"><b>Date joined:</b><br> ${new Date(item['date_added']['S']).toLocaleDateString("en-US", date_options)} </div>
                    
                    <br>
                    <div class="in_line">
                        <div id="assign_plots_top_${waiting_list_id}">
                            <input type='button' onclick='open_assign_plot(\"${waiting_list_id}\",\"${plot_type['Title']}\")' value='Assign'>
                            <input type='button' onclick='delete_from_waiting_list(\"${item['email']['S']}\")' style="background-color:tomato" value='Delete'>
                        </div>
                        <div id="assign_plots_bottom_${waiting_list_id}" style="display:none">
                        <b> Select plot:</b>
                        <br> <select style="width:200px;" id='assign_plot_list_${waiting_list_id}'></select>
                        <br><br> <input type='button' onclick='assign_plot(\"${waiting_list_id}\")' value='Submit'>
                            <input type='button' onclick='close_assign_plot(\"${waiting_list_id}\")' style="background-color:tomato" value='Cancel'>
                        </div>
                    </div>
                </td>
                </tr>`);
            });

        });
        autocomplete(document.getElementById("add_waiting_list_email"), members_email);
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
    plot_number=document.getElementById('assign_plot_list_'+waiting_list_id).value;
    
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
        console.log(response);
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
        var el = document.createElement("option");
        el.textContent = element['plotId']['S'];
        el.value = element['plotId']['S'];
        select.appendChild(el);
      });
  
      
    })
  
  }


function open_add_waiting_list(){
    document.getElementById('add_waiting_list_form').style.display="block";
    document.getElementById('admin_controls_waiting_list').style.display="none";
}

function close_add_waiting_list(){
    document.getElementById('add_waiting_list_form').style.display="none";
    document.getElementById('admin_controls_waiting_list').style.display="block";
}


function search(tab) {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search_"+tab);
    filter = input.value.toUpperCase();
    ul = document.getElementById("all_"+tab);
    li = ul.getElementsByTagName("td");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function add_many_members()
{
    
    
    members=[];
    members.push({"email": "Hazelgabe@protonmail.com","first_name":"Hazel","last_name":"Gabe","street_address":"8-600 Laurier Ave W", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6133234908", "date_added":"6/13/2022","admin":false, "verified": false });
members.push({"email": "virginiamfresende@gmail.com","first_name":"Virginia","last_name":"Resende","street_address":"119 Central Park r.", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6136187334", "date_added":"6/17/2022","admin":false, "verified": false });
members.push({"email": "lailawertwyn@hotmail.com","first_name":"Fatima","last_name":"Badi","street_address":"216-111 Viewmount Dr.", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613 526-9526", "date_added":"6/25/2022","admin":false, "verified": false });
members.push({"email": "tyerswilson@rogers.com","first_name":"Betty","last_name":"Wilson","street_address":"7 Northview Road", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-228-0526", "date_added":"7/1/2022","admin":false, "verified": false });
members.push({"email": "gillmanlynn@gmail.com","first_name":"Lynn","last_name":"Gillman","street_address":"8 Queensline Drive", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-820-8343", "date_added":"7/10/2022","admin":false, "verified": false });
members.push({"email": "ca.gallant@outlook.com","first_name":"Christopher","last_name":"Gallant","street_address":"12 Singer Place", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6138678086", "date_added":"7/12/2022","admin":false, "verified": false });
members.push({"email": "myzkate@yahoo.ca","first_name":"Katie","last_name":"Cadieux","street_address":"20 Amherst Crescent", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6138842340", "date_added":"7/16/2022","admin":false, "verified": false });
members.push({"email": "cecillegagne27@gmail.com","first_name":"Cecille","last_name":"Gagne","street_address":"118 woodridge crescent unit 11", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6136019647", "date_added":"7/22/2022","admin":false, "verified": false });
members.push({"email": "shoreysong@gmail.com","first_name":"Xiaoyu","last_name":"Song","street_address":"1206-1801 Frobisher Ln", "city":"Ottawa","province":"ON","postal_code":"K1G0E7", "phone_number":"3434633965", "date_added":"8/1/2022","admin":false, "verified": false });
members.push({"email": "slwmartin@gmail.com","first_name":"Sara","last_name":"Martin","street_address":"111 Covington Place", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6137981994", "date_added":"8/10/2022","admin":false, "verified": false });
members.push({"email": "jess_oey20@hotmail.com","first_name":"Francesco","last_name":"Petrocco","street_address":"", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6134072375", "date_added":"8/15/2022","admin":false, "verified": false });
members.push({"email": "lisaandkevin@yahoo.ca","first_name":"Lisa","last_name":"Bolduc","street_address":"31 georgian pvt", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6137979234", "date_added":"8/18/2022","admin":false, "verified": false });
members.push({"email": "liu.viktor@gmail.com","first_name":"liu","last_name":"Nanhui","street_address":"191 Calaveras Ave.", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6134400566", "date_added":"8/26/2022","admin":false, "verified": false });
members.push({"email": "yiang.wang2010@gmail.com","first_name":"Yifang","last_name":"Wang","street_address":"31 Crystal Park Cres", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6136007752", "date_added":"9/5/2022","admin":false, "verified": false });
members.push({"email": "Njihiajane@gmail.com","first_name":"Jane","last_name":"Njihia","street_address":"72 Dragon Park Drive", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613 8847412", "date_added":"9/7/2022","admin":false, "verified": false });
members.push({"email": "michael.coulter@sympatico.ca","first_name":" Michael","last_name":"Coulter","street_address":"26 Kerry Crescent", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-274-0536", "date_added":"9/13/2022","admin":false, "verified": false });
members.push({"email": "blask.chaud@rogers.com","first_name":"ema","last_name":"chaudhuri","street_address":"17 Northgate st", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-226-1064", "date_added":"9/18/2022","admin":false, "verified": false });
members.push({"email": "613mah@gmail.com","first_name":"Mohmoud","last_name":"Dawod Alsaghir","street_address":"19 hogan st.", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6137002381", "date_added":"9/21/2022","admin":false, "verified": false });
members.push({"email": "jianzhn@gmail.com","first_name":"Jian","last_name":"zhen","street_address":"1262 heron road", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6137905885", "date_added":"9/22/2022","admin":false, "verified": false });
members.push({"email": "Stephen.Young@MyCambrian.Ca","first_name":"Stephen","last_name":"young","street_address":"2147 Prince of Whales Drive", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"7808381533", "date_added":"10/11/2022","admin":false, "verified": false });
members.push({"email": "karentrines@gmail.com","first_name":"Karen","last_name":"Trines","street_address":"4 Willwood Cr", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-899-3789", "date_added":"10/17/2022","admin":false, "verified": false });
members.push({"email": "jenniferdeng73@gmail.com","first_name":"li","last_name":"deng","street_address":"25 Clonfadda Terr", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6132767166", "date_added":"10/29/2022","admin":false, "verified": false });
members.push({"email": "lyewchuk57@gmail.com","first_name":"Laura","last_name":"Yewchuk","street_address":"200 Tivoli Private", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"3432044972", "date_added":"11/2/2022","admin":false, "verified": false });
members.push({"email": "juanyuan26@gmail.com","first_name":"Zhujing","last_name":"Yuan","street_address":"619 New Liskeard Cres", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6138405819", "date_added":"11/8/2022","admin":false, "verified": false });
members.push({"email": "mhaiqian@gmail.com","first_name":"Haiqian","last_name":"Ma","street_address":"933 Atrium Ridge", "city":"Ottawa","province":"ON","postal_code":"K4M 0N9", "phone_number":"6137969795", "date_added":"11/10/2022","admin":false, "verified": false });
members.push({"email": "cybulski.mary@gmail.com","first_name":"Mary","last_name":"Cybulski","street_address":"2692 Don St", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6134024720", "date_added":"12/17/2022","admin":false, "verified": false });
members.push({"email": "s.skyeoldham@gmail.com","first_name":"Skye","last_name":"Marshall","street_address":"191 Claridge drive", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6138787593", "date_added":"1/4/2023","admin":false, "verified": false });
members.push({"email": "taylor.c.davidson@gmail.com","first_name":"Taylor","last_name":"Davidson","street_address":"44 Jenscott Private", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6132195499", "date_added":"1/6/2023","admin":false, "verified": false });
members.push({"email": "sharonchapman24@icloud.com","first_name":"Sharon","last_name":"Chapman","street_address":"72 Shadetree Crescent", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-229-9385", "date_added":"1/6/2023","admin":false, "verified": false });
members.push({"email": "TerryLacroix22@gmail.com","first_name":"Terry","last_name":"Lacroix","street_address":"320 Croydon Avenue Apr. 610", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6136203134", "date_added":"1/6/2023","admin":false, "verified": false });
members.push({"email": "ronagunther2@hotmail.com","first_name":"Rona","last_name":"Gunther","street_address":"", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"5798809494", "date_added":"1/10/2023","admin":false, "verified": false });
members.push({"email": "cbryce5721@gmail.com","first_name":"Ceres","last_name":"Bryce","street_address":"10 Charkay St", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"9055197935", "date_added":"1/19/2023","admin":false, "verified": false });
members.push({"email": "razz.routly@gmail.com","first_name":"Routly","last_name":"Razz","street_address":"10 Charkay St", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"5195461125", "date_added":"1/23/2023","admin":false, "verified": false });
members.push({"email": "tomblack04@hotmail.com","first_name":"Sandra","last_name":"Black","street_address":"130 Queen Elizabeth Drive.", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"3435731306", "date_added":"1/24/2023","admin":false, "verified": false });
members.push({"email": "dimo.k.dimitrov@gmail.com","first_name":"Dimo","last_name":"Dimitrov","street_address":"190 Clearview Avenue", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613 2906181", "date_added":"2/5/2023","admin":false, "verified": false });
members.push({"email": "cosaaor@gmail.com","first_name":"Savka","last_name":"Orozovic","street_address":"3804 Crowsnest Ave", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"613-292-7064", "date_added":"2/7/2023","admin":false, "verified": false });
members.push({"email": "janezhang26@gmail.com","first_name":"Jane","last_name":"Zhang","street_address":"917 Guinness crescent", "city":"Ottawa","province":"ON","postal_code":"K2C 3H2", "phone_number":"6134402899", "date_added":"2/25/2023","admin":false, "verified": false });
members.push({"email": "a.elbakaw@gmail.com","first_name":"Abdel","last_name":"El Bakaw","street_address":"469 viewmount drive", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6137100108", "date_added":"2/27/2023","admin":false, "verified": false });
members.push({"email": "anoopkapoor.canada@gmail.com","first_name":"Anoop","last_name":"Kapoor","street_address":"55 Fairlop Way", "city":"Ottawa","province":"ON","postal_code":"K2Jb8", "phone_number":"8197757725", "date_added":"3/4/2023","admin":false, "verified": false });
members.push({"email": "no email - Cornwell","first_name":"Don","last_name":"Cornwell","street_address":"39 F Woodfield Dr", "city":"Ottawa","province":"ON","postal_code":"", "phone_number":"6132406322", "date_added":"3/7/2023","admin":false, "verified": false });


    for (var i = 0; i < members.length; i++) {
        
        fetch('https://baf4kiept7.execute-api.us-east-1.amazonaws.com/prod', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "email": members[i]['email'],
            "first_name":members[i]['first_name'],
            "last_name":members[i]['last_name'],
            "street_address":members[i]['street_address'],
            "city":members[i]['city'],
            "province":members[i]['province'],
            "postal_code":members[i]['postal_code'],
            "phone_number":members[i]['phone_number'],
            "admin":members[i]['admin'],
            "verified":members[i]['verified']
        })
        })
        .then(response => response.json())
        .then(response => {  console.log(response);})
        
    }



    
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
