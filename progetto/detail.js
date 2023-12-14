import { login } from "./login.js";
import { get, set } from "./cache.js";

const nomepoi=document.getElementById("nomepoi");
const coordinate=document.getElementById("coordinate");
const img=document.getElementById("img");
const descrizione=document.getElementById("descrizione");

const current_url = new URL(window.location.href);
const params = new URLSearchParams(current_url.search);

//Get e render dei poi dalla cache remota
let poi = {};

const template= `
  <img src="%immg">
  `;

const callback = (resp) => {
  poi = JSON.parse(resp.result);
  console.log(poi)
  renderPoi(poi);
};

get("poi_torino", callback);

const renderPoi = (poi) => {
  //quando params.get("id") è presenti tra le chiavi del dizionario di poi
  nomepoi.innerText=poi[params.get("id")]["name"];
  coordinate.innerText=poi[params.get("id")]["coords"];
  let rowHtml = ""
  poi[params.get("id")]["img"].forEach((immagine)=>{
    rowHtml += template.replace("%immg", immagine);
  });
  img.innerHtml=rowHtml;
  descrizione.innerText=poi[params.get("id")]["desc"];
};

//{"id":{name:"",coords:[], img:[], desc:"..."}}