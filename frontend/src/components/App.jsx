// компоненты
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithSubmit from "./PopupWithSubmit";

import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";

import Header from "./Header";

// авторизация
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";

// допы
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  // popup
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltip, setIsInfoTooltip] = useState(false);

  const [isPopupWithSubmit, setIsPopupWithSubmit] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  // апи
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // карточки
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();
  
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
// ------------------------------------------------------
// -----------------------------------------------------------------------
// получение пользователя
useEffect(() => {
  if (loggedIn) {
    api.getDataUser()
      .then((res) => {
        // setCards(initialCards);
        setCurrentUser(res.data);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      });
  }
}, [loggedIn]);

// -----------------------------------------------------------------------
// получение карточки
useEffect(() => {
if (loggedIn) {
  api.getInitialCards()
    .then((data) => {
      setCards(data.reverse());
    })
    .catch((err) => {
      console.log(`Ошибка: ${err.status}`);
    });
}
}, [loggedIn]);

// удаление карточки
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleCardDelete: ${err}`);
      });
  }
// ------------------------------------------------------
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
      .catch((err) => {
        console.log(`Ошибка в App, handleCardLike: ${err}`);
      });
  }
// ------------------------------------------------------
// обновление инфо юзера
  function handleUpdateUser(data) {
    api
      .editInfoUser(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      }).catch((err) => {
        console.log(`Ошибка в App, handleUpdateUser: ${err}`);
      });
  }
// -----------------------------------------------------------------------
// обновление аватара
  function handleUpdateAvatar(data) {
    api
      .editUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleUpdateAvatar: ${err}`);
      });
  }
// -----------------------------------------------------------------------
  function handleAddPlaceSubmit(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleAddPlace: ${err}`);
      });
  }
// -----------------------------------------------------------------------
  function handleCardDeleteConfirm(card) {
    setSelectedCard(card);
    setIsPopupWithSubmit(true);
    
  }
// -----------------------------------------------------------------------
  // токен
    function checkToken() {
      const token = localStorage.getItem("token");
      if (token) {
        auth
          .checkToken(token)
          .then((res) => {
            if (res.data) {
              setLoggedIn(true);
              setEmail(res.data.email);
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            console.log(`Ошибка в checkToken, в App: ${err.status}`);
          });
        }    
      }

  useEffect(() => {
    checkToken();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
// -----------------------------------------------------------------------
  // регистрация
  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        
          console.log(res, "Это res из register в App.jsx")
          setIsSuccess(true);
          navigate("/sign-in", { replace: true });
        }
      )
      .catch((err) => {
        setIsSuccess(false);
        console.log(`Ошибка в регистрации, в App: ${err}`)
      })
      // при ошибке выходит сообщение
      .finally(() => setIsInfoTooltip(true));
  }
  // -----------------------------------------------------------------------
  // вход
  function handleLogin({ email, password }) {
    auth
      .login(email, password)
      .then((data) => {
        if (data.token) {
          console.log(data, "Это res из login в App.jsx")
          setEmail(email);
          localStorage.setItem("token", data.token);
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsInfoTooltip(true);
        console.log(`Ошибка в App, loginUser: ${err}`);
      });
  }
// -----------------------------------------------------------------------

  // выход
  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail('');
    navigate('/sign-in', { replace: true });
  }

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
