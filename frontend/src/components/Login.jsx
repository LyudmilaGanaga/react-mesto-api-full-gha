import React, { useState } from "react";

export function Login({ onLogin }) {
  const {formValue, setFormValue} = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(formValue);
  }

  return (
    <div className="register">
      <p className="register__title">Вход</p>
      <form
        onSubmit={handleSubmit}
        name="login"
        method="POST"
        className="register__form"
      >
        <input
          className="register__input"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          required
          value={formValue.email}
          onChange={handleChange}
        />
        <input
          className="register__input"
          placeholder="Пароль"
          id="password"
          name="password"
          type="password"
          required
          value={formValue.password}
          onChange={handleChange}
        />

        <button className="register__button-container" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}
