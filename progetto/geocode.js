const geocode = (url, callback) => {
  console.log(url);
  fetch(url)
    .then((result) => result.json())
    .then(callback)
    .catch(console.error);
};

export{geocode};

