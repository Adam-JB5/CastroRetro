
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
                mostrarExito(data.mensaje);

                // Redirección automática despues de 2 segundos
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            })
            .catch(err => {
                mostrarError("Error al registrarse: " + err.message);
            });
    });
}
