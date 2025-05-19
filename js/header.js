
export default function header() {

    const username = document.getElementById("header-username");
    const role = document.getElementById("header-role");

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    console.log(usuario);
    console.log(username);
    console.log(role);

    username.innerText = usuario.username;
    role.innerText = usuario.isAdmin ? "Administrador" : "Usuario";
}
