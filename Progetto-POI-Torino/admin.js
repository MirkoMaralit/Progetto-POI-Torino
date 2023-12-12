import { login } from "./login.js";
import { get, set, getCode} from "./cache.js";
import { geocode } from "./geocode.js";


const inAdminName = document.getElementById("inAdminName");
const inAdminPass = document.getElementById("inAdminPass");

const btn_login_admin = document.getElementById("btn_login_admin");
const post_login_list = document.getElementById("post_login_list");
const pre_login = document.getElementById("pre_login");
const list_log_out = document.getElementById("list_log_out");

//Login credenziali: admin, admin
const callback = (resp) => {
  if (resp.result) {
    pre_login.classList.remove("d-block");
    pre_login.classList.add("d-none");
    post_login_list.classList.remove("d-none");
    post_login_list.classList.add("d-block");
    get("poi_torino",getPOI)
  };
}

btn_login_admin.onclick = () => {
  login(inAdminName.value, inAdminPass.value, callback);
};

//Log out
list_log_out.onclick = () => {
  post_login_list.classList.remove("d-block");
  post_login_list.classList.add("d-none");
  pre_login.classList.remove("d-none");
  pre_login.classList.add("d-block");
};
//////////////////////////////////////

//Get e render dei poi dalla cache remota
let poi = {};

const getPOI = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderList(poi);
  };
};

//Div dell'elenco POI
const list_css = document.getElementById("list_css");

//Template della POI nell'elenco
const poi_card_template = `
<div class="col-12 col-sm-6">
    <div class="card" style="border-radius: 10px; border:0;">
      <div class="row col-12">
        <div class="col-6">
          <img class="card-img" src="%IMG"
            style="border-radius: 10px 0px 0px 10px;">
        </div>
        <div class="col-6" style="padding: 0;">
          <div class="card-body">
            <h5 class="card-title">%NAME</h5>
            <p class="card-text">%DESC</p>
          </div>
        </div>
      </div>
    </div>
  </div>`

const renderList = (poi) => {
  let i = 1;
  let html = "";
  Object.keys(poi).forEach((name) => {
    if (i % 2 == 1) {
      html += `<div id="rowList" class="row col-12 g-0">`;
    };
    html += poi_card_template.replace("%IMG", poi[name]["img"][0]).replace("%NAME", name).replace("%DESC", poi[name]["desc"]);
    if (i % 2 == 0) {
      html += `</div>`;
    };
    i++;
  });
  list_css.innerHTML = html;
};
///////////////////////////////////////7

//Inserimento di un nuovo poi
const inPOI_name = document.getElementById("POI_name");
const inDescription = document.getElementById("POI_description");
let POI_imgs = [];

const save_btn = document.getElementById("save_btn");
const urlGeocode = "https://api.geoapify.com/v1/geocode/search?apiKey=5e8d464f7a6f48f281288c93c1531355&text=%PLACE";


save_btn.onclick = () => {
  geocode(urlGeocode.replace("%PLACE", inPOI_name.value), (result) => {
  });
  //calcolo codice identificativo del poi
  getCode(result => {console.log(result)});
  //set
  // set("poi_torino",poi)
};
/////////////////////////////////////////////7