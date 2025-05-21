
export default function register() {
    const formulario = document.getElementById("register-form");
    console.log("antes");
    console.log(formulario);
    console.log("despues");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const username = document.getElementById("register-username").value;

        // 🔐 Validación con RegEx
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            mostrarError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
            return;
        }


        fetch("http://127.0.0.1:8080/CastroRetro/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ email, password, username })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.mensaje || "Registro NO exitoso");
                return data;
            })
            .then(data => {
                mostrarExito(data.mensaje)
            })
            .catch(err => {
                mostrarError("Error al registrarse: " + err.message);
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
