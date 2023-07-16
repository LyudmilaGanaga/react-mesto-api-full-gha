import React, { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithSubmit from "./PopupWithSubmit";

import * as auth from "../utils/auth.js";
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPopupWithSubmit, setIsPopupWithSubmit] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltip, setIsInfoTooltip] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // Обработка закрытия вне элемента
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    }
    function closeOverlayClick(e) {
      if (e.target.classList.contains("popup_opened")) {
        closeAllPopups();
      }
    }
    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isImagePopupOpen ||
      isPopupWithSubmit ||
      isInfoTooltip
    ) {
      document.addEventListener("keyup", handleEscClose);
      document.addEventListener("click", closeOverlayClick);
    }
    return () => {
      document.removeEventListener("click", closeOverlayClick);
      document.removeEventListener("keyup", handleEscClose);
    };
  }, [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isImagePopupOpen,
    isPopupWithSubmit,
    isInfoTooltip,
  ]);
  
  // обработчики
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsPopupWithSubmit(false);
    setIsInfoTooltip(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => alert(err));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => alert(err));
  }

  function handleUpdateUser(value) {
    api
      .editInfoUser(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  function handleUpdateAvatar(value) {
    api
      .editUserAvatar(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  function handleCardDeleteConfirm(card) {
    setIsPopupWithSubmit(true);
    setSelectedCard(card);
  }

  useEffect(() => {
    function checkToken() {
      const jwt = localStorage.getItem("token");
      if (jwt) {
        auth
          .checkToken(jwt)
          .then((user) => {
            if (user) {
              setLoggedIn(true);
              setEmail(user.data.email);
              navigate("/", { replace: true });
            }
          })
          .catch((err) => console.log(err));
      }
    }

    checkToken();
  }, [navigate]);

  // регистрация
  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then((data) => {
        if (data) {
          setIsSuccess(true);
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        console.log(err);
      })
      .finally(() => setIsInfoTooltip(true));
  }
  // вход
  function handleLogin({ email, password }) {
    auth
      .login(email, password)
      .then((user) => {
        if (user.token) {
          localStorage.setItem("token", user.token);
          setLoggedIn(true);
          setEmail(email);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltip(true);
      });
  }
  // выход
  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/sign-in");
  }

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getDataUser()])
        .then(([initialCards, user]) => {
          setCards(initialCards);
          setCurrentUser(user);
        })
        .catch((err) => {
          console.log("Ошибка: ", err);
        });
    }
  }, [loggedIn]);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header logout={handleLogout} email={email} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onUpdateUser={handleUpdateUser}
                cards={cards}
                onCardDeleteConfirm={handleCardDeleteConfirm}
                loggedIn={loggedIn}
              />
            }
          />

          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />

          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        ></ImagePopup>

        <PopupWithSubmit
          isOpen={isPopupWithSubmit}
          onClose={closeAllPopups}
          card={selectedCard}
          onCardDelete={handleCardDelete}
        ></PopupWithSubmit>

        <InfoTooltip
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
