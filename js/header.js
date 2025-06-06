import { mostrarExito } from "./utils.js";

export default function header() {

    const username = document.getElementById("header-username");
    const role = document.getElementById("header-role");
    const profileImage = document.getElementById("header-profile-image");

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));


    username.innerText = usuario.username;
    role.innerText = usuario.isAdmin ? "Administrador" : "Usuario";

    let imageUrl = usuario.profileImage
        ? `http://127.0.0.1:8080/CastroRetro/${usuario.profileImage}`
        : './assets/icons/profilePlaceholder.svg';

    profileImage.src = imageUrl;

    function esAdmin() {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const buttonsDiv = document.getElementById("header-buttons-div");

        if (usuario.isAdmin) {
            const adminButton = document.createElement("a");

            adminButton.id = "admin-button";
            adminButton.href = "./admin.html";
            adminButton.textContent = "ADMIN";
            adminButton.className = "bg-transparent hover:bg-[#bb3f3f] border border-white transition-colors ml-10 px-4 py-1.5 font-medium rounded-sm";

            buttonsDiv.appendChild(adminButton);
        }
    }

    function zoomImagenPerfil() {

        profileImage.addEventListener("mouseenter", (e) => {

            const preview = document.createElement("div");
            preview.id = "image-preview-popup";

            preview.style.position = "fixed";
            preview.style.top = `${e.clientY - 10}px`;
            preview.style.left = `${e.clientX - 400}px`;
            preview.style.padding = "10px";
            preview.style.background = "##1e1e4a";
            preview.style.border = "1px solid #000000";
            preview.style.borderRadius = "8px";
            preview.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            preview.style.zIndex = "9999";

            const bigImg = document.createElement("img");
            bigImg.src = imageUrl;
            bigImg.style.width = "25vw";
            bigImg.style.height = "auto";
            bigImg.style.objectFit = "cover";
            bigImg.style.borderRadius = "4px";

            preview.appendChild(bigImg);
            document.body.appendChild(preview);
        });

        profileImage.addEventListener("mouseleave", () => {
            const popup = document.getElementById("image-preview-popup");
            if (popup) popup.remove();
        });
    }

    function cerrarSesion() {
        fetch("http://127.0.0.1:8080/CastroRetro/api/logout", {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.removeItem("usuario");

                    mostrarExito("Se cerró la sesión correctamente");

                    setTimeout(() => {
                        window.location.href = "./login.html";
                    }, 1000);

                }
            })
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
                mostrarError("Hubo un problema al cerrar sesión. Inténtelo de nuevo.");
            });
    }

    document.getElementById("header-logout-button").addEventListener("click", cerrarSesion);
    esAdmin();
    zoomImagenPerfil();
}
