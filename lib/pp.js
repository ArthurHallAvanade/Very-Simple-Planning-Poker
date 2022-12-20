

$(document).ready(function(){
    $( "#date" ).datepicker();
    console.log("document ready");
    var clientid = uuidv4();
    var currentstatus = [];
    //push current client status into array
    currentstatus.push({clientid: clientid});
    var Uname = "";
    var Lastestimate = "";



    var client = new Faye.Client('http://localhost:8000/faye');
    var subscription = client.subscribe('/pp', function(message) {       
        //check to see if client id is in currentstatus
        var matchfound = 0
        currentstatus.forEach(element => {
            if (message.clientid == element.clientid){
                matchfound = 1;
            }                                
        });
        //If no match is found, create the object in the array
        if (matchfound == 0){
            currentstatus.push({clientid: message.clientid, name:message.name, estimate:message.estimate, lastAlive:Date.now()});
        }
        //if a match is found, update it. 
        else{
            objIndex = currentstatus.findIndex((obj => obj.clientid == message.clientid))
            currentstatus[objIndex].name = message.name;
            currentstatus[objIndex].estimate = message.estimate;
            currentstatus[objIndex].lastAlive = Date.now();
        }
/*         //let everyone in the channel know you exsist
        if (message.message == "enter"){
            client.publish('/pp', {message: "respond", clientid: clientid, name: Uname, estimate: Lastestimate});

        }
        if (message.message == "NameChange"){
            objIndex = currentstatus.findIndex((obj => obj.clientid == message.clientid))
            currentstatus[objIndex].name = message.name;

        }
        if (message.message == "EstimateChange"){
            objIndex = currentstatus.findIndex((obj => obj.clientid == message.clientid))
            currentstatus[objIndex].estimate = message.estimate;
        } */
        //if we get a ping, we should pong 
        if (message.message == "Ping"){
            client.publish('/pp', {estimate: Lastestimate, clientid: clientid, message: "Pong", name: Uname});
            objIndex = currentstatus.findIndex((obj => obj.clientid == message.clientid))
            currentstatus[objIndex].lastAlive = Date.now();
        }
        //Update status table
        var resultTable = createResults(currentstatus);
        $("#SelectionTable").html(resultTable);

        
        var statustable = createTable(currentstatus);
        $("#CurrentTable").html(statustable);
        $('#ResultTable').DataTable({
            paging: false,

        });
      })




    client.publish('/pp', {message: "enter", clientid: clientid, lastAlive:Date.now()});  

    $(usersName).change(function(){
        var currentname = document.getElementById("usersName").value;
        client.publish('/pp', {name: currentname, clientid: clientid, message: "NameChange", estimate: estimate});
        Uname = currentname;
    })

    $(estimate).change(function(){
        var estimate = document.getElementById("estimate").value;
        client.publish('/pp', {estimate: estimate, clientid: clientid, message: "EstimateChange", name: Uname});
        Lastestimate = estimate;
    })

    //Occasionally check who is still online by pinging
    var pingInterval = setInterval(function() {
        client.publish('/pp', {name: Uname, estimate: Lastestimate, clientid: clientid, message: "Ping"});
        console.log(currentstatus);

        var i;
        for (i = currentstatus.length - 1; i >= 0; i -= 1) {

            if ((Date.now() - currentstatus[i].lastAlive) > 10000){
                console.log("removing " + currentstatus[i].clientid);
                //objIndex = currentstatus.findIndex((obj => obj.clientid == currentstatus[i].clientid))
                //currentstatus.splice(objIndex, 1)
                //_.reject(users, ['active', false]);
                currentstatus = _.reject(currentstatus, ['clientid', currentstatus[i].clientid]);
            }
        }


        var statustable = createTable(currentstatus);
        $("#CurrentTable").html(statustable);

    }, 10000);
});

//Creates table from key/value pair. Mostly for troubleshooting, can be replaced later. 
function createTable(array) {
    if( array.length <= 0 ) 
        return null;
        
    var table = document.createElement('table');

    var keys = Object.keys(array[0]);
    
    var thead = document.createElement("thead");
    var header_row = document.createElement('tr');
    for(var i = 0;i < keys.length;i ++)
    {
        var header_cell = document.createElement('th');
        header_cell.textContent = keys[i];
        header_row.appendChild(header_cell);
    }
    thead.appendChild(header_row);
    table.appendChild(thead); // append thead to table
    
    var tbody = document.createElement("tbody");
    for (var i = 0; i < array.length; i++) {
        var row = document.createElement('tr');
        for (const [key, value] of Object.entries(array[i])) {
            var cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody); // append tbody to table
    
    return table;
}

//Creates unique client ID
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function createResults(array){
    var table = document.createElement('table');
    table.setAttribute("id", "ResultTable");
    var keys = Object.keys(array[0]);
    var thead = document.createElement("thead");
    var header_row = document.createElement('tr');
    var header_cell = document.createElement('th');
    header_cell.textContent = "Name";
    header_row.appendChild(header_cell);
    var header_cell = document.createElement('th');
    header_cell.textContent = "Estimate";
    header_row.appendChild(header_cell);
    thead.appendChild(header_row);
    table.appendChild(thead); // append thead to table

    var tbody = document.createElement("tbody");
    for (var i = 0; i < array.length; i++) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.textContent = array[i].name;
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.textContent = array[i].estimate;
        row.appendChild(cell);
        tbody.appendChild(row);
    }
    table.appendChild(tbody); // append tbody to table
    
    return table;





}
  
  console.log(uuidv4());
