import { login } from "./login.js";
import { get, set} from "./cache.js";
import { geocode } from "./geocode.js";

const btn_login_admin = document.getElementById("btn_login_admin");
const inUsername = document.getElementById("inUsername");
const inPassword = document.getElementById("inPassword");

const pre_login = document.getElementById("pre_login");
const post_login_list = document.getElementById("post_login_list");
const list_log_out = document.getElementById("list_log_out");

const logged_animation_div = document.getElementById("logged_animation_div");

const delete_poi_btn = document.getElementById("delete_poi");

let all_poi_div;

let poi_id_to_delete = [];//lista dei poi che verranno eliminati se selezionati

// pressione bottone di log in e controllo delle credenziali 
btn_login_admin.onclick = () => {
  login(inUsername.value, inPassword.value, callback_login);
};

// controllo se l'admin è loggato
const check_login = () => {
  // controllo se è  loggato come admin o come utente 
  if(document.cookie.split(";").includes("adminLoggato")){
    logged_animation_div.classList.add("startAnimation");
    setTimeout(()=>{
      logged_animation_div.classList.remove("startAnimation");
    },3000);
    pre_login.classList.add("top-transition");
    // 
  } else if (document.cookie.split(";").includes("utenteLoggato")){
    window.location.replace("index.html");
  };
}

check_login();// controllo se è loggato

//Login credenziali: admin, admin
const callback_login = (resp) => {
  // controllo che le credenziali siano corrette
  if (resp.result && inUsername.value==="admin") {
    document.cookie = "adminLoggato";
    inUsername.classList.remove("border-danger");
    inPassword.classList.remove("border-danger");
    inUsername.value='';
    inPassword.value='';
    pre_login.classList.add("top-transition");
  } else {
    inUsername.classList.add("border-danger");
    inPassword.classList.add("border-danger");
    inPassword.value="";
  };
}

//3 - Dopo lo spostamento, spostamento al centro del Div POI
pre_login.ontransitionend = (e) => {
  if (e.propertyName == "top") {
    if (pre_login.classList.contains("top-transition")) { //se è add
      console.log("pre sopra")
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
      console.log("post centro")
      pre_login.classList.remove("top-transition");
      get("poi_torino",getPOI)
    };
  };
};

//Log out
list_log_out.onclick = () => {
  document.cookie = "adminLoggato; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; //delete cookie
  post_login_list.classList.add("d-none");
  pre_login.classList.remove("d-none");
  pre_login.classList.remove("top-transition")
};
//////////////////////////////////////


//Get e render dei poi dalla cache remota
//{"id":{name:"",coords:[], img:[], desc:"..."}}
let poi = {};

// prende la lista dei poi 
const getPOI = (resp) => {
  poi = JSON.parse(resp.result);
  if (Object.keys(poi).length != 0){
    renderList(poi);
  };
};

// funzione per creare il codice univoco
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
    <div type="button" class="card" id="%POI_ID" > 
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
</div>`;

// funzione che elimina i poi selezionati
const delete_poi_func =()=>{
  Object.keys(poi).forEach((id) => {
    if (poi_id_to_delete.includes(id)){
      delete poi[id];
    };
  });
  poi_id_to_delete=[];
  set("poi_torino",poi); 
  renderList(poi);
}

// click sul cestino
delete_poi_btn.onclick = () => {
  if(poi_id_to_delete.length>0){
    delete_poi_func();
    delete_poi_btn.disabled = true;
  }
}

// quando clicco su un poi
const press_poi_event = (all_poi_div, poi) =>{
  for (let i=0; i<all_poi_div.length; i++){
    all_poi_div[i].onclick = () => {
      all_poi_div[i].id=Object.keys(poi)[i];
      if(all_poi_div[i].classList.contains("card-select-delete")){
        all_poi_div[i].classList.remove("card-select-delete");
        poi_id_to_delete.splice(poi_id_to_delete.indexOf(poi_id_to_delete.id),1); // se viene deselezionato
        
      }else{
        all_poi_div[i].classList.add("card-select-delete");
        poi_id_to_delete.push(all_poi_div[i].id);
      }
      // il cestino funziona solo se ci sono poi selezionati
      if(poi_id_to_delete.length>0){
        delete_poi_btn.disabled = false;
      }else{
        delete_poi_btn.disabled = true;
      }
    };
  };
};

// renderizzo i poi
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
  // prendo tutti i poi renderizzati
  all_poi_div = document.querySelectorAll('.card');
  // aggimungo gli eventi per il click del poi
  press_poi_event(all_poi_div, poi);
};
///////////////////////////////////////

//Inserimento di un nuovo poi
const modal = document.getElementById("modal");
const modal_to_close = new bootstrap.Modal(modal);
const inPOI_name = document.getElementById("POI_name");
const inDescription = document.getElementById("POI_description");
const inImg = document.getElementById("img");
let POI_imgs = [];
const add_img = document.getElementById("add_img");
const save_error = document.getElementById("save_error");
const save_btn = document.getElementById("save_btn");

//url per la localizzazione del poi
const urlGeocode = "https://api.geoapify.com/v1/geocode/search?apiKey=5e8d464f7a6f48f281288c93c1531355&text=%PLACE";

// aggiunta url dell'immagine
const modal_poi_imgs = document.getElementById("modal_imgs_container");
let modal_img_html = '';
const template_modal_img =
`
<div class="col-6 col-sm-3">
  <div class="card">
    <img class="card-img" src="%IMG">
  </div>
</div>`;
// funzione per aggiungere una nuova immagine nella modale durante la creazione del poi
const renderModalImg = () => {
  let i = 1;
  let html = "";
    POI_imgs.forEach((poi_img) => {
    if (i % 4 == 1) {
      html += `<div class="row col-12 g-0">`;
    };
    html += template_modal_img.replace("%IMG",poi_img);
    if (i % 4 == 0) {
      html += `</div>`;
    };
    i++;
  });
  modal_poi_imgs.innerHTML = html;
};
// controlli se i campi input del poi sono stati compilati
inPOI_name.addEventListener('change',function(){
  if(inPOI_name.value !='' && inDescription.value !='' && POI_imgs.length>2){
    save_btn.disabled=false;
  }else{
    save_btn.disabled=true;
  }
});
inDescription.addEventListener('change',function(){
  if(inPOI_name.value !='' && inDescription.value !='' && POI_imgs.length>2){
    save_btn.disabled=false;
  }else{
    save_btn.disabled=true;
  }
});

// se viene cliccato il bottone per l'aggiunta di una nuova immagine nella modale
add_img.onclick=()=>{
  POI_imgs.push(inImg.value);
  // per agginugere il poi deve essere inseriti almeno 3 poi
  if(inPOI_name.value !='' && inDescription.value !='' && POI_imgs.length>2){
    save_btn.disabled=false;
  }else{
    save_btn.disabled=true;
  }
  renderModalImg()
  inImg.value=''
  // al massimo 10 immagini
  if(POI_imgs.length === 10){
    add_img.disabled = true;
  }
  else{
    add_img.disabled = false;
  }
}

// salvataggio del poi
save_btn.onclick = () => {
  let code;
  let trovato = false;
  // get unique code
  getCode(result => {
    code = result[0];
    // get poi cooridnates
    geocode(urlGeocode.replace("%PLACE", inPOI_name.value.split(" ").join("-")), (coord) => {
      for(let i=0;i<coord.features.length;i++){
        if(coord.features[i].properties.county_code==="TO"){
          poi[code]={'name':inPOI_name.value, 'img':POI_imgs,'desc':inDescription.value, 'coords': coord.features[i].geometry.coordinates};
          renderList(poi);
          modal_to_close.hide();
          //set poi
          set("poi_torino",poi);
          i=coord.features.length; 
        };
      };
      // se non è stato localizzato il poi
      if (!(trovato)) {
        save_error.innerText = inPOI_name.value +" non trovato\nprova ad essere più preciso";
      };
    });
    
  });
};

// resetta i campi della modale
modal.addEventListener('hidden.bs.modal', function (event) {
  POI_imgs=[];
  modal_poi_imgs.innerHTML = "";
  save_error.innerText = "";
  save_btn.disabled=true;
  document.getElementById("modal_form").reset();
});

//Ricarica la pagina se è stata aperta con il back button del browser
window.onpageshow = (event) => {
  if (event.persisted) {
    window.location.reload();
  }
};