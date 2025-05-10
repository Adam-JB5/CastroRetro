export default function register() {
    const formulario = document.getElementById("register-form");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que se recargue la página

        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const username = document.getElementById("register-username").value;

        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Username:", username);

        fetch("http://localhost:8080/CastroRetro/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ email, password, username })
        })
            .then(res => {
                if (!res.ok) throw new Error("Registro NO exitoso");
                return res.json();
            })
            .then(data => {
                alert(data.mensaje);
                alert(data.success);
                // Redirigir si el login fue exitoso
                window.location.href = "home.html"; // Ajuste la ruta según corresponda
            })
            .catch(err => {
                alert("Error al registrarse: " + err.message);
            });
    });
}