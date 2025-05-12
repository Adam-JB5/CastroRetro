import login from "./login.js";
import register from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/register.html") {
        console.log("Página de registro cargada");
        register();
        // Aquí va el código de tu formulario de registro
    } else {
        login();
    }
    
    console.log("appjs");
});