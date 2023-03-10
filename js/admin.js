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
                <th>Plot Number</th>
                <th width=150>Size</th>
                <th>Rate</th>
                <th>Current occupant</th>
                <th>Actions</th>
                </tr>
            </table><br><br>
            `);
            
            plot_type['Body'].forEach(plot => {
                
                // Assign plot workflow
                plot_id=plot['plotId']['S'];
                
                if(plot['occupant']['S']) {occupant=plot['occupant']['S'];} else {occupant=""};
                if(plot['height']['S']) {height=plot['height']['S'];} else {height=""};
                if(plot['width']['S']) {width=plot['width']['S'];} else {width=""};
                if(plot['rate']['S']) {rate=plot['rate']['S'];} else {rate=""};
                occupant_form = (`
                <div  id='plot_assign_top_${plot_id}'>${occupant}</div>
                <div id='plot_assign_bottom_${plot_id}' style='display:none'>
                    Enter email address:
                    <br><div class='autocomplete'><input id='occupant_${plot_id}' type='text' name='occupant_${plot_id}' value='${occupant}' style=" width:100%;"></div>
                    <br><br> or select from waiting list:
                    <br><select onchange='select_from_waiting_list("${plot_id}")' id='select_from_waiting_list_${plot_id}'><option></option></select>
                </div>
                   
                `)

                document.getElementById("plots_row_"+row).insertAdjacentHTML('afterend', `<tr>
                <td valign=top><input class="edit_plot" disabled  type="text" id="edit_plot_number_${plot_id}" value="${plot_id}"></td>
                <td valign=top><input disabled  class="edit_plot" style="width:50px" type="text" id="edit_plot_height_${plot_id}" value="${height}">
                x<input disabled  class="edit_plot" style="width:50px" type="text" id="edit_plot_width_${plot_id}" value="${width}"></td>
                <td valign=top>$<input disabled  class="edit_plot"  style=" width:50px" type="text" id="edit_plot_rate_${plot_id}" value="${rate}"></td>
                <td valign=top>${occupant_form}</td>
                <td valign=top>
                <div id="edit_plot_top_${plot_id}">
                    <input type='button' onclick='open_assign_window("${plot['plotId']['S']}","${plot['plot_type']['S'] }")' value='Edit'>
                    <input type='button' onclick='remove_plot("${plot['plotId']['S']}")' value='Delete' style='background-color:tomato'>
                </div>
                <div id="edit_plot_bottom_${plot_id}" style="display:none">
                    <input type='button'  onclick='assign_plot("${plot_id}",document.getElementById("occupant_${plot_id}").value);' value='Submit'>  
                    <input type='button'  onclick='close_assign_window("${plot_id}")' value='Cancel 'style='background-color:tomato'><br><br>
                </div>
                </td>
                </tr>`);

                autocomplete(document.getElementById("occupant_"+ plot_id), members_email);
                

            });

        });

        console.log('All plots loaded')

        
    });

}

function assign_plot(plot_id, email){
    
    height=document.getElementById("edit_plot_width_"+plot_id).value;
    width=document.getElementById("edit_plot_height_"+plot_id).value;
    rate=document.getElementById("edit_plot_rate_"+plot_id).value;
    console.log(plot_id+email+height+width+rate)
    fetch('https://q1hk67hzpe.execute-api.us-east-1.amazonaws.com/prod/', {
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


  function open_assign_window(plot_id,plot_type){

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
    document.getElementById("plot_assign_top_" + plot_id).style.display="none";
    document.getElementById("plot_assign_bottom_" + plot_id).style.display="block";
    document.getElementById("edit_plot_top_" + plot_id).style.display="none";
    document.getElementById("edit_plot_bottom_" + plot_id).style.display="block";

    
    })

    


    

  }


function close_assign_window(plot_id){
    document.getElementById("edit_plot_width_"+plot_id).disabled=true;
    document.getElementById("edit_plot_height_"+plot_id).disabled=true;
    document.getElementById("edit_plot_rate_"+plot_id).disabled=true;
    document.getElementById("plot_assign_top_" + plot_id).style.display="block";
    document.getElementById("plot_assign_bottom_" + plot_id).style.display="none";
    document.getElementById("edit_plot_top_" + plot_id).style.display="block";
    document.getElementById("edit_plot_bottom_" + plot_id).style.display="none";
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
        
        plot_types=JSON.parse(response); row=0;
        plot_types.forEach(plot_type => {
            // console.log("Plot type received:" + plot_type['Title'])
            row++
            
            

            document.getElementById('waiting_list').insertAdjacentHTML('beforebegin', `
            <h3>${plot_type['Title']}</h3>

            <table class="list">
                <tr id="waiting_list_row_${row}">
                <th>Position</th>
                <th>Email</th>
                <th>Plot Number</th>
                <th>Current member</th>
                <th>Date joined</th>
                <th>Actions</th>
                </tr>
                <tr></tr>
                <tr id="no_plots_${row}">
                </tr>
            </table><br><br>
            `);
            
            plot_type['Body'].forEach(item => {

                
                
                if(item['has_plots']['BOOL']==true) { has_plots="<img src=img/checkmark.png width='20'>" } else { has_plots=""}
                document.getElementById("waiting_list_row_"+row).insertAdjacentHTML('afterend', `<tr>
                <td>${item['place']['N']}</td>
                <td>${item['email']['S']}</td>
                <td>${item['plot_number']['S']}</td>
                <td>${has_plots } </td>
                <td>${new Date(item['date_added']['S']).toLocaleDateString("en-US", date_options)}</td>
                <td><input type='button' onclick='delete_from_waiting_list(\"${item['email']['S']}\")' value='Remove'></td>
                </tr>`);
            });

        });

        console.log('All waiting lists loaded')
    
    });

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



function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /*prevent the magnifier glass from being positioned outside the image:*/
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
      if (x < w / zoom) {x = w / zoom;}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
      if (y < h / zoom) {y = h / zoom;}
      /*set the position of the magnifier glass:*/
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /*display what the magnifier glass "sees":*/
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  }