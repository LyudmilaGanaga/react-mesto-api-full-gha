import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

import { useForm } from "react-hook-form";
import classNames from "classnames";

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
  });

  function onSubmit({ avatar }) {
    onUpdateAvatar({ avatar });
  }

  useEffect(() => {
    reset();
  }, [isOpen, reset]);


  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isValid={isValid}
      isDirty={isDirty}
    >
      <input
        className={classNames("popup__input", {
          popup__input_type_error: errors.avatar,
        })}
        type="url"
        placeholder="Ссылка на картинку"
        {...register("avatar", {
          required: {
          value: true,
          message: "Пожалуйста введите URL",
          },
          pattern: {
            value:
            /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/,
            message: "Введите адрес сайта",
          },
        })}
      />
      <span
        className={classNames("popup__input-error", {
          "popup__input-error_visible": errors.avatar,
        })}
      >
        {errors.avatar?.message}
      </span>
    </PopupWithForm>
  );
}
