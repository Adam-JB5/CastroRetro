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
                  window.location.href = "home.html";
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
        alert("Error al iniciar sesión: " + (err.message || "Error desconocido"));
      });
  });


  function mostrarError(mensaje) {
    let errorDiv = document.getElementById("register-error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "register-error";
      errorDiv.className = `
            fixed top-10 left-1/2 transform -translate-x-1/2 
            bg-red-600 bg-opacity-60 text-white text-2xl px-6 py-4 
            rounded-xl shadow-lg z-50 fadeIn
        `;
      document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;

    // Eliminar despues de unos segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  function mostrarExito(mensaje) {
    let successDiv = document.getElementById("register-success");
    if (!successDiv) {
      successDiv = document.createElement("div");
      successDiv.id = "register-success";
      successDiv.className = `
            fixed top-10 left-1/2 transform -translate-x-1/2 
            bg-green-600 text-white text-2xl px-6 py-4 
            rounded-xl shadow-lg z-50 fadeIn
        `;
      document.body.appendChild(successDiv);
    }

    successDiv.textContent = mensaje;

    // Eliminar despues de unos segundos
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

}