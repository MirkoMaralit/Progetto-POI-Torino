import { login } from "./login.js";
import { get, set } from "./cache.js";


const btn_login_utente = document.getElementById("btn_login_utente");
const pre_login = document.getElementById("pre_login");
const inUsername = document.getElementById("inUsername");
const inPassword = document.getElementById("inPassword");

const post_login_map = document.getElementById("post_login_map");
const post_login_list = document.getElementById("post_login_list");
const change = document.getElementById("change");
const change_div = document.getElementById("change_div");

const list_log_out = document.getElementById("list_log_out");
const map_log_out = document.getElementById("map_log_out");

const url_register = 'https://ws.progettimolinari.it/credential/register';
const url_login = 'https://ws.progettimolinari.it/credential/login';

const logged_animation_div = document.getElementById("logged_animation_div");

//Div che contiene le POI card
const list_css = document.getElementById("list_css");

//{"id":{name:"",coords:[], img:[], desc:"..."}}
let poi = {};

//Template della POI nell'elenco
const poi_card_template = `
<div class="col-12 col-sm-6">
  <a href="detail.html?id=%ID" style="color: inherit;
  text-decoration: inherit;">
    <div class="card">
      <div class="row col-12">
        <div class="col-6">
          <img class="card-img" src="%IMG">
        </div>
        <div class="d-flex align-items-center col-6">
          <div class="card-body p-0">
            <h5 class="card-title">%NAME</h5>
            <p class="card-text">%DESC</p>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>`;



/* Da Log-in a Render lista POI / Animazioni */

// controllo se l'utente è loggato
const check_login = () => {
  if (document.cookie.split(";").includes("utenteLoggato")){
    pre_login.classList.add("top-transition");
  } else if (document.cookie.split(";").includes("adminLoggato")){
    window.location.replace("admin.html");
  };
};
check_login();

//1 - Click Bottone Log-in utente
btn_login_utente.onclick = () => {
  login(inUsername.value, inPassword.value, callback_login);
};

//2 - Controllo login e spostamento in alto del Div Log-in
const callback_login = (resp) => {
  if (resp.result && inUsername.value==="utente") {
    document.cookie = "utenteLoggato";
    inUsername.classList.remove("border-danger");
    inPassword.classList.remove("border-danger");
    inUsername.value="";
    inPassword.value="";
    pre_login.classList.add("top-transition");
  } else {
    inUsername.classList.add("border-danger");
    inPassword.classList.add("border-danger");
    inPassword.value="";
  };
};

//3 - Dopo lo spostamento, spostamento al centro del Div POI
pre_login.ontransitionend = (e) => {
  if (e.propertyName == "top") {
    if (pre_login.classList.contains("top-transition")) { //se è add
      pre_login.classList.add("d-none");
      post_login_list.classList.remove("d-none");
      setTimeout(() => {
        post_login_list.classList.remove("bottom-transition");
      }, 0);
    };
  };
};

//4 - Dopo lo spostamento, Fetch dei POI
post_login_list.ontransitionend = (e) => {
  if (e.propertyName == "bottom") {
    if (!(post_login_list.classList.contains("bottom-transition"))) { //se è remove
      change_div.classList.remove("d-none");
      pre_login.classList.remove("top-transition");
      get("poi_torino",callback_poi)
    };
  };
};

//5 - Salvataggio dei POI nel dizionario
const callback_poi = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderList(poi);
    
  };
};

//6 - Render dei POI nella Lista
const renderList = (poi) => {
  let i = 1;
  let html = "";
  Object.keys(poi).forEach((id) => {
    if (i % 2 == 1) {
      html += `<div class="row col-12 g-0">`;
    };
    html += poi_card_template.replace("%ID",id).replace("%IMG", poi[id]["img"][0]).replace("%NAME", poi[id]["name"]).replace("%DESC", poi[id]["desc"]);
    if (i % 2 == 0) {
      html += `</div>`;
    };
    i++;
  });
  list_css.innerHTML = html;
};





/* Change Lista-Mappa e Animazioni */

//Click del Bottone Change Lista-Mappa
change.onclick = () => {
  if (!(change_div.classList.contains("rot-transition"))) {
    //Se in Div Lista
    //Spostamento in basso di Div Lista e Change
    list_css.classList.add("bottom-transition");
    change_div.classList.add("rot-transition");
  } else {
    //Se in Div Mappa
    //Nasconde Div Mappa, Mostra Div Lista
    //Spostamento in alto di Div Lista e Change
    post_login_map.classList.add("d-none");
    post_login_list.classList.remove("d-none");
    setTimeout(() => {
      list_css.classList.remove("bottom-transition");
      change_div.classList.remove("rot-transition");
    }, 0);
  };
};

//Nasconde Div Lista, Mostra Div Mappa
list_css.ontransitionend = (e) => {
  if (e.propertyName == "bottom") {
    if (list_css.classList.contains("bottom-transition")) { //se è add
      post_login_list.classList.add("d-none");
      post_login_map.classList.remove("d-none");
    };
  };
};



/* Log-out */

//Bottoni log-out per tornare alla schermata di log-in admin
list_log_out.onclick = () => {
  document.cookie = "userLoggato; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; //delete cookie
  post_login_list.classList.add("d-none");
  change_div.classList.add("d-none");
  post_login_list.classList.add("bottom-transition");
  pre_login.classList.remove("d-none");
};

map_log_out.onclick = () => {
  document.cookie = "userLoggato; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; //delete cookie
  post_login_map.classList.add("d-none");
  change_div.classList.add("d-none");
  post_login_list.classList.add("bottom-transition");
  pre_login.classList.remove("d-none");
  list_css.classList.remove("bottom-transition");
  change_div.classList.remove("rot-transition");
};
