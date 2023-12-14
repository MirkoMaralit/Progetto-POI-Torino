import { login } from "./login.js";
import { get, set } from "./cache.js";
//import { addMarker,remove_marker } from "./map.js";


const btn_login_utente = document.getElementById("btn_login_utente");
const pre_login = document.getElementById("pre_login");
const input_userName = document.getElementById("inUserName");
const input_password = document.getElementById("inUserPass");

const post_login_map = document.getElementById("post_login_map");
const post_login_list = document.getElementById("post_login_list");
const change = document.getElementById("change");
const change_div = document.getElementById("change_div");
const change_to_list = document.getElementById("change_to_list");

const list_log_out = document.getElementById("list_log_out");
const map_log_out = document.getElementById("map_log_out");

const url_register = 'https://ws.progettimolinari.it/credential/register';
const url_login = 'https://ws.progettimolinari.it/credential/login';

map = document.getElementById('map');

//Div dell'elenco POI
const list_css = document.getElementById("list_css");

//Template della POI nell'elenco
const poi_card_template = `
<div class="col-12 col-sm-6">
  <a href="detail.html?id=%ID" style="color: inherit;
  text-decoration: inherit;">
    <div class="card" style="border-radius: 10px; border:0;">
      <div class="row col-12">
        <div class="col-6">
          <img class="card-img" src="%IMG"
            style="border-radius: 10px 0px 0px 10px;">
        </div>
        <div class="d-flex align-items-center col-6">
          <div class="card-body p-0">
            <h5 class="card-title">%NAME</h5>
            <p class="card-text" style="color:transparent;">%DESC</p>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>`

//{"id":{name:"",coords:[], img:[], desc:"..."}}
let poi = {};
const callback = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderList(poi);
  };
};

const renderList = (poi) => {
  let i = 1;
  let html = "";
  Object.keys(poi).forEach((id) => {
    if (i % 2 == 1) {
      html += `<div id="rowList" class="row col-12 g-0">`;
    };
    html += poi_card_template.replace("%ID",id).replace("%IMG", poi[id]["img"][0]).replace("%NAME", poi[id]["name"]).replace("%DESC", poi[id]["desc"]);
    if (i % 2 == 0) {
      html += `</div>`;
    };
    i++;
  });
  list_css.innerHTML = html;
};


//Per le animazioni
post_login_list.ontransitionend = (e) => {
  if (e.propertyName == "bottom") {
    if (!(post_login_list.classList.contains("bottom-transition"))) {
      change_div.classList.remove("d-none");
      pre_login.classList.remove("top-transition");
      const username = input_userName.value;
      const password = input_password.value;
      //login
      get("poi_torino",callback)
    };
  };
};

//Per le animazioni
pre_login.ontransitionend = (e) => {
  if (e.propertyName == "top") {
    if (pre_login.classList.contains("top-transition")) {
      pre_login.classList.add("d-none");
      post_login_list.classList.remove("d-none");
      setTimeout(() => {
        post_login_list.classList.remove("bottom-transition");
      }, 0);
    };
  };
};

//Bottone per il log-in utente
btn_login_utente.onclick = () => {
  pre_login.classList.add("top-transition");
};

//Per le animazioni
list_css.ontransitionend = (e) => {
  if (e.propertyName == "bottom") {
    if (list_css.classList.contains("bottom-transition")) {
      post_login_list.classList.add("d-none");
      post_login_map.classList.remove("d-none");
    };
  };
};

//Bottone per cambiare dall'elenco alla mappa e animazioni
change.onclick = () => {
  if (!(change_div.classList.contains("rot-transition"))) {
    list_css.classList.add("bottom-transition");
    change_div.classList.add("rot-transition");
  } else {
    post_login_map.classList.add("d-none");
    post_login_list.classList.remove("d-none");
    setTimeout(() => {
      list_css.classList.remove("bottom-transition");
      change_div.classList.remove("rot-transition");
    }, 0);
  };
};


//Bottoni log-out per tornare alla schermata di log-in utente
list_log_out.onclick = () => {
  post_login_list.classList.add("d-none");
  change_div.classList.add("d-none");
  post_login_list.classList.add("bottom-transition");
  pre_login.classList.remove("d-none");
};

map_log_out.onclick = () => {
  post_login_map.classList.add("d-none");
  change_div.classList.add("d-none");
  post_login_list.classList.add("bottom-transition");
  pre_login.classList.remove("d-none");
  list_css.classList.remove("bottom-transition");
  change_div.classList.remove("rot-transition");
};

