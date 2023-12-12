const token = "4de1fe80-bf5d-47cc-822a-469736ff5e5c";
const url = "https://ws.progettimolinari.it/credential/login";

const login = (username, password, callback) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": token
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  }).then((response) => {
    response.json().then(callback).catch(err => (console.log(err)));
  })
};

export { login };