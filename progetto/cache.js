
const urlSet = "https://ws.progettimolinari.it/cache/set";
const urlGet = "https://ws.progettimolinari.it/cache/get";
const token = "4de1fe80-bf5d-47cc-822a-469736ff5e5c";

const get = (chiave, callback) => {
  fetch(urlGet, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": token
    },
    body: JSON.stringify({
      key: chiave
    })
  }).then((response) => {
    response.json().then(callback).catch(err => (console.log(err)));
  })
};

const set = (chiave, content) => {
  fetch(urlSet, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": token
    },
    body: JSON.stringify({
      key: chiave,
      value: JSON.stringify(content)
    })
  }).then((response) => {
    response.json().then(console.log("ok"));
  });
};

export{get,set};


