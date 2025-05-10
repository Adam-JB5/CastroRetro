export default function login() {
  const formulario = document.getElementById("login-form");

  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que se recargue la página

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    console.log("Email:", email);
    console.log("Password:", password);

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
      // Redirigir si el login fue exitoso
      window.location.href = "home.html"; // Ajuste la ruta según corresponda
    })
    .catch(err => {
      alert("Error al iniciar sesión: " + err.message);
    });
  });
}