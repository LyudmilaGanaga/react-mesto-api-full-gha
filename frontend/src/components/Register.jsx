import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export function Register({ onRegister }) {
  const {formValue, setFormValue} = useForm({
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
    onRegister(formValue);
  }

  return (
    <div className="register">
      <p className="register__title">Регистрация</p>
      <form
        onSubmit={handleSubmit}
        className={"register__form"}
        name="register"
        method="POST"
      >
        <input
          className="register__input"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          value={formValue.email}
          onChange={handleChange}
          required
        />
        
        <input
          className="register__input"
          placeholder="Пароль"
          id="password"
          name="password"
          type="password"
          value={formValue.password}
          onChange={handleChange}
          required
        />

        <button className="register__button-container" type="submit">
          Зарегистрироваться
        </button>
      </form>

      <p className="register__signin">
        Уже зарегистрированы?
        <Link to="login" className="register__login-link">
          Войти
        </Link>
      </p>
    </div>
  );
}
