import login from "./login.js";
import register from "./register.js";
import userValidation from "./userValidation.js";
import header from "./header.js";

    if (window.location.pathname.endsWith("/register.html")) {
        document.addEventListener("DOMContentLoaded", () => {
        register();})
    }
    
    if (window.location.pathname.endsWith("/login.html")) {
        document.addEventListener("DOMContentLoaded", () => {
        login();})
    }

    if (window.location.pathname.endsWith("/home.html") || window.location.pathname.endsWith("/profile.html") || window.location.pathname.endsWith("/upload-product.html")) {
        console.log("uservvv");
        userValidation();
        console.log("entro");

        header();
        
    }
