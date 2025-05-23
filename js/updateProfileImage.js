export default function updateProfileImage() {

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const userId = usuario.userId;

    const formularioImagen = document.getElementById("profile-image-form");
    const fileInput = document.getElementById("profile-file-input");
    const removeButton = document.getElementById("profile-remove-image-button");
    const preview = document.getElementById("preview");
    const buttonGroup = document.getElementById("image-buttons");

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = e => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            };

            reader.readAsDataURL(file);

            fileInput.classList.add('hidden');
            buttonGroup.classList.remove('hidden');
        }
    });

    removeButton.addEventListener('click', () => {
        fileInput.value = "";
        fileInput.classList.remove('hidden');

        preview.src = "";
        preview.classList.add('hidden');
        buttonGroup.classList.add('hidden');
    });

    formularioImagen.addEventListener("submit", async (e) => {
        e.preventDefault();

        const image = fileInput.files[0];
        if (!image) {
            mostrarError("Por favor seleccione una imagen");
            return;
        }

        const formData = new FormData();
        formData.append("id", userId);
        formData.append("imagen", image);
        console.log(formData);

        console.log(userId);
        console.log(image);
        try {
            const response = await fetch("http://127.0.0.1:8080/CastroRetro/api/update-profile-image", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
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
            } else {
                mostrarError("Error: " + data.mensaje);
            }
        } catch (error) {
            mostrarError("Ocurrió un error al subir la imagen");
            console.error(error);
        }
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