import { login } from "./login.js";
import { get, set} from "./cache.js";
import { geocode } from "./geocode.js";

const inAdminName = document.getElementById("inAdminName");
const inAdminPass = document.getElementById("inAdminPass");

const btn_login_admin = document.getElementById("btn_login_admin");
const post_login_list = document.getElementById("post_login_list");
const pre_login = document.getElementById("pre_login");
const list_log_out = document.getElementById("list_log_out");


//Login credenziali: admin, admin
const callback = (resp) => {
  if (resp.result && inAdminName.value==="admin") {
    pre_login.classList.remove("d-block")
    pre_login.classList.add("d-none");
    post_login_list.classList.remove("d-none");
    post_login_list.classList.add("d-block");
    get("poi_torino",getPOI);    
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
//{"id":{name:"",coords:[], img:[], desc:"..."}}
let poi = {};

const getPOI = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderList(poi);
  };
};

const getCode=(callback)=>{
  fetch('https://www.uuidtools.com/api/generate/v4/count/1',{
    method: "GET"
  })
  .then((result) => result.json())
  .then(callback)
  .catch(console.error);
}

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
  Object.keys(poi).forEach((id) => {
    if (i % 2 == 1) {
      html += `<div id="rowList" class="row col-12 g-0">`;
    };
    html += poi_card_template.replace("%IMG", poi[id]["img"][0]).replace("%NAME", poi[id]["name"]).replace("%DESC", poi[id]["desc"]);
    if (i % 2 == 0) {
      html += `</div>`;
    };
    i++;
  });
  list_css.innerHTML = html;
};
///////////////////////////////////////

//Inserimento di un nuovo poi
const inPOI_name = document.getElementById("POI_name");
const inDescription = document.getElementById("POI_description");
const inImg = document.getElementById("img");
let POI_imgs = [];
const add_img = document.getElementById("add_img");
const save_btn = document.getElementById("save_btn");

const urlGeocode = "https://api.geoapify.com/v1/geocode/search?apiKey=5e8d464f7a6f48f281288c93c1531355&text=%PLACE";

// aggiunta url dell'immagine
const modal_poi_imgs = document.getElementById("modal_imgs_container");
let modal_img_html = '';
const template_modal_img = 
`
<div class="col-6">
  <img src="%IMG" style="border-radius: 10px 10px 10px 10px; max-height: 100px; margin-top:5%">
</div>`

add_img.onclick=()=>{
  add_img.disabled = false;
  POI_imgs.push(inImg.value);
  modal_img_html+=template_modal_img.replace("%IMG",inImg.value);
  modal_poi_imgs.innerHTML=modal_img_html;
  inImg.value=''
  if(POI_imgs.length===2){
    add_img.disabled = true;
  }
  else{
    add_img.disabled = false;
  }
}

save_btn.onclick = () => {
  geocode(urlGeocode.replace("%PLACE", inPOI_name.value), (coord) => {
    //calcolo codice identificativo del poi
    coord.features.forEach((feature) => {
      if(feature.properties.city==="Turin"){
        getCode(result => {
          poi[result[0]]={'img':POI_imgs,'name':inPOI_name.value,'desc':inDescription.value, 'coords': feature.geometry.coordinates};
          renderList(poi);
          console.log(poi);
          //set
          set("poi_torino",poi);
           POI_imgs=[];
        });
      }
      // console.log(feature.properties.city,feature.geometry.coordinates);
    });
  });
 
}
/////////////////////////////////////////////7