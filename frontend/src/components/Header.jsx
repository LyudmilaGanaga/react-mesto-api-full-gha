import React from "react";
import headerLogo from "../../src/images/Vector.svg";
import { Link, Route, Routes } from "react-router-dom";

export default function Header({ email, logout }) {
  return (
    <header className="header">
      <img className="headerLogo" src={headerLogo} alt="Логотип" />

      <Routes>
        <Route
          path="/sign-in"
          element={
            <Link to="/sign-up" className="header__register">
              Регистрация
            </Link>
          }
        ></Route>

        <Route
          path="/sign-up"
          element={
            <Link to="/sign-in" className="header__register">
              Войти
            </Link>
          }
        />

        <Route
          path="/"
          element={
            <div className="header__register-containter">
              <p className="header__email">{email}</p>
              <Link
                to="/sign-in"
                className="header__register header__register-logged"
                onClick={logout}
              >
                Выйти
              </Link>
            </div>
          }
        />
      </Routes>
    </header>
  );
}
