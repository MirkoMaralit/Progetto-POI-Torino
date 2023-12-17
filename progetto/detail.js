import { login } from "./login.js";
import { get, set } from "./cache.js";

const content = document.getElementById("content");

const nomepoi=document.getElementById("nomepoi");
const coordinate=document.getElementById("coordinate");
const immagini = document.getElementById("immagini");
const descrizione=document.getElementById("descrizione");

const current_url = new URL(window.location.href);
const params = new URLSearchParams(current_url.search);

//Get e render dei poi dalla cache remota
let poi = {};

const callback = (resp) => {
  poi = JSON.parse(resp.result);
  console.log(poi)
  renderPoi(poi);
};

const check_login = () => {
  console.log(document.cookie.split(";"))
  if (document.cookie.split(";").includes("adminLoggato")){
    window.location.replace("admin.html");
  } else if (!(document.cookie.split(";").includes("utenteLoggato"))){
    window.location.replace("index.html");
  } else {
    get("poi_torino", callback);
  };
}
check_login();

const template3=`
  <button id="btn_prev" class="carousel-control-prev" style="filter: invert(1);" type="button" data-bs-target="#carouselcontrols" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </button>
  <button id="btn_next" class="carousel-control-next" style="filter: invert(1);" type="button" data-bs-target="#carouselcontrols" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </button>
  `;

const template=`
<div id="%" class="carousel-item active">
  <img src="%immg" class="d-block" style="margin:auto; height:100%; object-fit: contain;">
</div>
`;
const template2=`
  <div id="%" class="carousel-item">
    <img src="%immg" class="d-block" style="margin:auto; height:100%; object-fit: contain;">
  </div>
  `;
 
let rowHtml='';


const renderPoi = (poi) => {
  nomepoi.innerText=poi[params.get("id")]["name"];
  coordinate.innerText="Coordinate: " + poi[params.get("id")]["coords"].reverse();
  let listaimg=poi[params.get("id")]["img"];
  for(let i=0; i<listaimg.length; i++){
    let contenitore = listaimg[i];
    if (i==0){
      rowHtml+=template.replace("%immg",contenitore).replace("%",i);
    } else {
      rowHtml+=template2.replace("%immg",contenitore).replace("%",i);
    };
    immagini.innerHTML=rowHtml;
    //contatore.push(i.toString());
  };
  immagini.innerHTML+=template3;
  
  descrizione.innerText=poi[params.get("id")]["desc"];
  // Mostro il div solo quando ho sostituito tutto
  content.classList.remove("d-none");
};


//Ricarica la pagina se è stata aperta con il back button del browser
window.onpageshow = (event) => {
  if (event.persisted) {
    window.location.reload();
  }
};