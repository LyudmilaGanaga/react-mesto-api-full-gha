import React from "react";
import uniconYes from "../images/UniconInfoTooltip.png";
import uniconNo from "../images/UnionInfoTooltipError.png";

export function InfoTooltip({ onClose, isOpen, isSuccess }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="info__container">
      
      <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        ></button>

        <img className="info__icon" src={isSuccess? uniconYes : uniconNo} alt="Результат авторизации/регистрации"/>
        
        <h2 className={`info__text`}>
          {isSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз."}
        </h2>
      </div>
    </div>
  )
}
