class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  // проверка
  _getJson(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  // заголовки
  _setHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      ...this._headers,
    };
  }

  // получить данные пользователя
  getDataUser() {
    return fetch(`${this._url}/users/me`, {
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  // заменить данные пользователя PATCH
  editInfoUser(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._getJson);
  }

  // заменить аватар PATCH
  editUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._getJson);
  }

  // получить список всех карточек
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  // добавить карточку (POST)
  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: this._setHeaders(),
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._getJson);
  }

  // удалить карточку (DELETE)
  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  // лайк PUT
  putLike(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  // удалить лайк карточки (DELETE)
  deleteLike(id, token) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  // для лайка
  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.putLike(cardId);
    } else {
      return this.deleteLike(cardId);
    }
  }
}

export const api = new Api({
  url: "https://api.pr-mesto.nomoredomains.xyz",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});
