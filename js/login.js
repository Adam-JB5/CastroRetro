import { mostrarError, mostrarExito } from "./utils.js";

export default function login() {
  const formulario = document.getElementById("login-form");

  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que se recargue la página

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;


    fetch("http://127.0.0.1:8080/CastroRetro/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "include",
      body: new URLSearchParams({ email, password })
    })
      .then(res => {
        if (!res.ok) throw new Error("Credenciales incorrectas");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          mostrarExito(data.mensaje);
          console.log(data.usuario);
          sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

          // Verificar que el servidor ya reconoce la sesión
          setTimeout(() => {
            fetch("http://127.0.0.1:8080/CastroRetro/api/validate-session", {
              method: "GET",
              credentials: "include"
            })
              .then(res => {
                if (res.ok) {
                  window.location.href = "./home.html";
                } else {
                  mostrarError(data.mensaje);
                }
              });
          }, 1000); // pequeño retardo para asegurar que la cookie se establezca
        } else {
          mostrarError(data.mensaje);
        }
      })
      .catch(err => {
        console.error(err); // Error exacto
        mostrarError("Error al iniciar sesión: " + (err.message || "Error desconocido"));
      });
  });

}