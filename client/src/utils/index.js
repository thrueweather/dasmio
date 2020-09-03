import React from "react";
import { store } from "react-notifications-component";
import { Loader } from "semantic-ui-react";
import Spinner from "react-spinkit";

export const saveData = (value) => {
  const timestamp = +new Date();
  const data = JSON.stringify({ token: value, timestamp });

  localStorage.setItem("token", data);
};

export const deleteData = () => {
  localStorage.removeItem("token");
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const getItem = (maxLen) => {
  const array = [];
  let len = 1;

  while (len <= maxLen) {
    array.push(len);
    len += 1;
  }

  return array;
};

export const withPromise = (f, delay) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(f);
    }, delay);
  });

export const showAlert = (title, message) =>
  store.addNotification({
    title,
    message,
    type: "info",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true,
      pauseOnHover: true,
      showIcon: true,
      click: true,
    },
  });

export const getMilliseconds = (time) => ((time % 60000) / 1000).toFixed(0);

export const preloader = () => {
  return (
    <div className="loading">
      <Loader active inverted />
    </div>
  );
};

export const loader = (
  <div className="loader">
    <Spinner name="cube-grid" color="black" noFadeIn />
  </div>
);
