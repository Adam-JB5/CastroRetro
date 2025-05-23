
export default function header() {

    const username = document.getElementById("header-username");
    const role = document.getElementById("header-role");
    const profileImage = document.getElementById("header-profile-image");

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    console.log(usuario);
    console.log(username);
    console.log(role);

    username.innerText = usuario.username;
    role.innerText = usuario.isAdmin ? "Administrador" : "Usuario";
    profileImage.src = `http://127.0.0.1:8080/CastroRetro/${usuario.profileImage}`;
}
