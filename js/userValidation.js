export default function userValidation() {
  console.log("userv");
  fetch("http://127.0.0.1:8080/CastroRetro/api/validate-session", {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (res.status === 401 || sessionStorage.getItem("usuario") == null) {
        window.location.href = "./login.html";
      }
    })
    .catch(err => {
      console.error("Error validando sesión:", err);
      window.location.href = "./login.html";
    });
}