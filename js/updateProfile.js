export default function updateProfile() {
    let formulario = document.getElementById("profile-form");
    let username = document.getElementById("profile-username");
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const userId = usuario.userId;

    username.placeholder = usuario.username;

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        let nuevoUsername = username.value.trim();
        let password = document.getElementById("profile-password").value.trim();

        // Validar si hubo algun cambio
        const usernameCambio = nuevoUsername !== "" && nuevoUsername !== usuario.username;
        const passwordCambio = password !== "";

        if (!usernameCambio && !passwordCambio) {
            mostrarError("Debe modificar al menos un campo");
            return;
        }

        // Validar contraseña si fue modificada
        if (passwordCambio) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                mostrarError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
                return;
            }
        }

        // Preparar datos para enviar
        const data = { id: userId };
        if (usernameCambio) data.username = nuevoUsername;
        if (passwordCambio) data.password = password;


        fetch("http://127.0.0.1:8080/CastroRetro/api/update-profile", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(data)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.mensaje || "Actualización de datos no exitosa");
                return data;
            })
            .then(data => {
                // Actualizar sessionStorage con los datos nuevos
                if (data.usuario) {
                    sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
                }

                mostrarExito(data.mensaje);

                // Validar sesión luego de un breve delay
                setTimeout(() => {
                    fetch("http://127.0.0.1:8080/CastroRetro/api/validate-session", {
                        method: "GET",
                        credentials: "include"
                    })
                        .then(res => {
                            if (res.ok) {
                                window.location.href = "./profile.html";
                            } else {
                                mostrarError(data.mensaje);
                            }
                        });
                }, 500);
            })
            .catch(err => {
                mostrarError("Error al actualizar: " + err.message);
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

        // Ocultar automáticamente después de unos segundos
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

        // Redirección automática luego de 2 segundos
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }

}