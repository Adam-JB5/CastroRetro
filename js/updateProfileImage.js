let formularioImagen = document.getElementById("profile-image-form");

    formularioImagen.addEventListener("submit", () => {
        let image = document.getElementById("")
    });


 
                const fileInput = document.getElementById('profileImage');
                const submitButton = document.getElementById('profile-image-submit-button');
                const removeButton = document.getElementById('remove-image-button');
                const preview = document.getElementById('preview');
                const buttonGroup = document.getElementById('image-buttons');

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
                    // Resetear input
                    fileInput.value = "";
                    fileInput.classList.remove('hidden');

                    // Ocultar imagen y botones
                    preview.src = "";
                    preview.classList.add('hidden');
                    buttonGroup.classList.add('hidden');
                });