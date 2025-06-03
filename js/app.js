import login from "./login.js";
import register from "./register.js";
import userValidation from "./userValidation.js";
import header from "./header.js";
import updateProfile from "./updateProfile.js";
import updateProfileImage from "./updateProfileImage.js";
import uploadProduct from "./uploadProduct.js";
import home from "./home.js";
import admin from "./admin.js";
import product from "./product.js";

if (window.location.pathname.endsWith("/register.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        register();
    })
}

if (window.location.pathname.endsWith("/login.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        login();
    })
}

const rutasProtegidas = [
    "/home.html",
    "/profile.html",
    "/upload-product.html",
    "/product.html",
    "/admin.html"
];

if (rutasProtegidas.some(ruta => window.location.pathname.endsWith(ruta))) {
    userValidation();
    header();
}

if (window.location.pathname.endsWith("/home.html")) {
    home();
}

if (window.location.pathname.endsWith("/profile.html")) {
    updateProfile();
    updateProfileImage();
}

if (window.location.pathname.endsWith("/upload-product.html")) {
    uploadProduct();
}

if (window.location.pathname.endsWith("/product.html")) {
    product();
}

if (window.location.pathname.endsWith("/admin.html")) {
    admin();
}