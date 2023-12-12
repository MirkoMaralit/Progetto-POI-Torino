import { login } from "./login.js";
import { get, set } from "./cache.js";

const current_url = new URL(window.location.href);
const params = new URLSearchParams(current_url.search);

//Get e render dei poi dalla cache remota
let poi = {};

const getPOI = (resp) => {
  poi = JSON.parse(resp.result);
  console.log(poi)
  renderPoi(poi);
};

get("poi_torino", getPOI);

const renderPoi = (poi) => {
  //quando params.get("code") è presenti tra le chiavi del dizionario di poi
};