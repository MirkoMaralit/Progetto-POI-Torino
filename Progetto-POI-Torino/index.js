import { login } from "./login.js";
import { get, set } from "./cache.js";

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

const url_register = 'https://ws.progettimolinari.it/credential/register';
const url_login = 'https://ws.progettimolinari.it/credential/login';

map = document.getElementById('map');

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

//{"id":{name:"",coords:[], img:[], desc:"..."}}

let poi = {
  "Palazzo reale": { coords: [45.0727, 7.686], img: ["https://imgur.com/a/fl1QvR9"], desc: "Nel 1563 il duca Emanuele Filiberto stabilisce la capitale del ducato sabaudo a Torino, insediando la corte nell’antico palazzo vescovile della città. Nel 1584, per volontà di Carlo Emanuele I, viene affidato all’architetto Ascanio Vitozzi il progetto per la costruzione di un nuovo palazzo e negli anni successivi al 1643 la direzione dei lavori passa ad Amedeo di Castellamonte e poi ancora a Carlo Morello. Le sale del primo piano sono arricchite con soffitti intagliati e grandi tele allegoriche di Jan Miel e Charles Dauphin che esaltano le virtù del sovrano. Nel 1688 Daniel Seyter è chiamato da Roma per affrescare la fastosa galleria affacciata sui giardini e lavora con il genovese Bartolomeo Guidobono anche negli appartamenti del piano terra. Con la conquista del titolo regio (1713) Vittorio Amedeo II affida a Filippo Juvarra la creazione della “zona di comando” costituita dalle Segreterie, dal Teatro Regio e dagli Archivi di Stato. La carica di primo architetto regio passa poi a Benedetto Alfieri, che progetta gli apparati decorativi del secondo piano e allestisce le nuove camere degli Archivi, affrescate da Francesco De Mura e da Gregorio Guglielmi. Al tempo di Carlo Alberto (1831-1849) molti ambienti sono radicalmente rinnovati sotto la direzione di Pelagio Palagi e nel 1862 prende forma il nuovo scalone d’onore. Con il trasferimento della capitale da Torino a Firenze (1864) e poi a Roma, il palazzo perde progressivamente le sue funzioni di residenza e con la nascita della Repubblica italiana (1946) diviene proprietà dello Stato. fonte: https://museireali.beniculturali.it/palazzo-reale/" },
  "Mole antonelliana": { coords: [45.06898, 7.69324], img: ["https://imgur.com/a/Y1gPoN3"], desc: "L'edificio fu ideato da Alessandro Antonelli, noto architetto dell'ottocento, appartenente alla fede ebraica, al quale fu commissionato di progettare un nuovo tempio per gli israeliti comprensivo di una scuola interna. Antonelli quindi cercò di progettare un edificio strutturato da un'ampia parte inferiore per assolvere a questa duplice funzione di luogo sacro e d'istruzione e di ultimare il progetto con una cupola a base quadrata, in linea con lo stile architettonico di molte altre sinagoghe edificate in Europa. La storia della mole antonelliana è particolare: la costruzione dell'edificio partì a seguito dell'autorizzazione del Regio Decreto del 17 marzo 1863 e si completò parzialmente nel giro di 6 anni, con un'altezza pari a circa 70 metri. L'ambizioso progetto di Antonelli non fu particolarmente apprezzato dalla Comunità Ebraica di Torino a fronte dei numerosi costi aggiuntivi da sostenere per poter rinforzare e saldare un edificio di una portata importante. Pertanto i membri della Comunità Ebraica decisero di vendere la struttura al Comune di Torino e di costruire una nuova sinagoga nel quartiere di San Salvario. fonte: https://moleantonellianatorino.it" }
};

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
  list_css.innerHTML += html; // = non +=
};

//Bottone per il log-in utente
btn_login_utente.onclick = () => {
  pre_login.classList.remove("d-block");
  pre_login.classList.add("d-none");
  post_login_list.classList.remove("d-none");
  post_login_list.classList.add("d-block");
  change_div.classList.remove("d-none");
  change_div.classList.add("d-block");
  const username = input_userName.value;
  const password = input_password.value;
  //login
  renderList(poi)
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
    post_login_list.classList.remove("d-none");
    post_login_map.classList.add("d-none");
    setTimeout(() => {
      list_css.classList.remove("bottom-transition");
      change_div.classList.remove("rot-transition");
    }, 0);
  };
};


//Bottone log-out per tornare alla schermata di log-in utente
list_log_out.onclick = () => {
  post_login_list.classList.remove("d-block");
  post_login_list.classList.add("d-none");
  change_div.classList.remove("d-block");
  change_div.classList.add("d-none");
  pre_login.classList.remove("d-none");
  pre_login.classList.add("d-block");
};