export const BASE_URL = "http://api.pr-mesto.nomoredomains.xyz";

export const checkServer = (res) => {
  if (res.ok) {
    return res.json();
  }else{
  return Promise.reject(`Ошибка: ${res.status}`);
  }
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  }).then((res) => {
    return checkServer(res)
  })
}

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    return checkServer(res);
})
}

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`
    },
  })
    .then((res) => {
      return checkServer(res)
})
};
