export default function login() {
    const botonLogin = document.getElementById("login-submit-button");

    console.log(botonLogin);
  
    botonLogin.addEventListener("click", () => {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      console.log(email);
      console.log(password);
  
      fetch("http://localhost:8080/CastroRetro/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ email, password })
      })
      .then(res => {
        if (!res.ok) throw new Error("Credenciales incorrectas");
        return res.json();
      })
      .then(data => {
        alert(data.mensaje);
        alert(data.success);
        // Redirigir a la página principal si el login fue exitoso
        window.location.href = "home.html"; // Cambie por su página principal real
      })
      .catch(err => {
        alert("Error al iniciar sesión: " + err.message);
      });
    });
  }