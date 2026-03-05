let map = L.map('map').setView([20.5937,78.9629],5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

function getLocation(){

document.getElementById("loading").innerText="Detecting location...";

if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(showPosition);
}

}

function showPosition(position){

let lat = position.coords.latitude;
let lon = position.coords.longitude;

map.setView([lat,lon],13);

L.marker([lat,lon]).addTo(map).bindPopup("You are here").openPopup();

findFuelStations(lat,lon);

}

function findFuelStations(lat,lon){

let query = `
[out:json];
node["amenity"="fuel"](around:3000,${lat},${lon});
out;
`;

let url = "https://overpass-api.de/api/interpreter?data="+encodeURIComponent(query);

fetch(url)
.then(res=>res.json())
.then(data=>{

data.elements.forEach(station=>{

L.marker([station.lat,station.lon])
.addTo(map)
.bindPopup("Fuel Station ⛽");

});

});

}


document.getElementById("fuelForm").addEventListener("submit",function(e){

e.preventDefault();

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let fuelType=document.getElementById("fuelType").value;
let amount=document.getElementById("amount").value;

let request={name,phone,fuelType,amount};

let requests=JSON.parse(localStorage.getItem("fuelRequests"))||[];

requests.push(request);

localStorage.setItem("fuelRequests",JSON.stringify(requests));

document.getElementById("message").innerText="Fuel request sent successfully!";

});


function sendSOS(){

alert("Emergency request sent!");

}

function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

}

function toggleChat(){

let box=document.getElementById("chatbox");

box.style.display=box.style.display==="none"?"block":"none";

}

function sendMessage(){

let input=document.getElementById("userInput");

let message=input.value;

let chat=document.getElementById("messages");

chat.innerHTML+="<p><b>You:</b> "+message+"</p>";

let response="I can help with fuel delivery or mechanic service.";

if(message.toLowerCase().includes("fuel")){
response="Please fill the fuel request form ⛽";
}

if(message.toLowerCase().includes("mechanic")){
response="Mechanic service coming soon 🔧";
}

chat.innerHTML+="<p><b>Bot:</b> "+response+"</p>";

input.value="";

}