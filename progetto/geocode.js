// funzione per la localizzazione del poi
const geocode = (url, callback) => {
  fetch(url)
    .then((result) => result.json())
    .then(callback)
    .catch(console.error);
};
export{geocode};

