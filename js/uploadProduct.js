import { mostrarError, mostrarExito } from "./utils.js";

export default function uploadProduct() {

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const userId = usuario.userId;

    let allFiles = [];


    function mostrarFormulario() {
        const categories = document.querySelectorAll(".category");
        console.log(categories);
        categories.forEach((opcion) => {

            opcion.addEventListener("click", () => {


                categories.forEach((opcion) => {
                    opcion.style.backgroundColor = "";
                    opcion.classList.remove("selected");
                });


                // Aplicar color específico desde data-bg
                const color = opcion.getAttribute("data-bg");
                opcion.style.backgroundColor = color;
                opcion.classList.add("selected");

                // Mostrar u ocultar secciones
                const categoria = opcion.getAttribute("data-category");
                const sections = document.getElementById("upload-product-sections");
                const aiDiv = document.getElementById("upload-product-ai-div");

                sections.classList.remove("opacity-0", "pointer-events-none");

                if (categoria === "Consola") {
                    aiDiv.classList.remove("hidden");
                } else {
                    aiDiv.classList.add("hidden");
                }
            });
        });
    }


    function subidaArchivos() {
        const input = document.getElementById("file-upload");
        const previewDiv = document.getElementById("preview");
        const botonEliminarFotos = document.getElementById("upload-product-delete-images-button");
        allFiles = []; // Acumulamos aquí todos los archivos


        function actualizarVista() {
            // Limpiar vista
            previewDiv.innerHTML = '';

            // Mostrar imágenes acumuladas
            allFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('w-full', 'h-auto', 'object-cover', 'rounded');
                    previewDiv.appendChild(img);
                };
                reader.readAsDataURL(file);
            });

            // Habilitar o deshabilitar botón
            botonEliminarFotos.disabled = allFiles.length === 0;

        }

        function borrarFotos() {
            allFiles = [];
            actualizarVista();
        }

        botonEliminarFotos.addEventListener("click", borrarFotos);

        input.addEventListener('change', () => {
            const newFiles = Array.from(input.files);

            // Validar que el total no supere 10 archivos
            if (allFiles.length + newFiles.length > 10) {
                mostrarError("Solo puedes subir un máximo de 10 imágenes");
                input.value = '';
                return;
            }

            console.log(allFiles.length);
            if (!(allFiles.length < 1)) {
                botonEliminarFotos.disabled = true;
            }

            // Validar tamaño de cada archivo nuevo (máx 10MB)
            const valid = newFiles.every(file => file.size <= 10 * 1024 * 1024);
            if (!valid) {
                mostrarError("Algún archivo supera los 10MB");
                input.value = '';
                return;
            }

            // Añadir nuevos archivos al array acumulado
            allFiles = allFiles.concat(newFiles);

            console.log(allFiles);
            input.value = "";
            actualizarVista();

        });
    }

    function recogerDatosFormulario() {
        let categoria = document.querySelector(".category.selected").getAttribute("data-category");
        let fotos = allFiles;
        let titulo = document.getElementById("upload-product-titulo")?.value.trim();
        let descripcion = document.getElementById("upload-product-descripcion")?.value.trim();
        let precio = parseFloat(document.getElementById("upload-product-precio")?.value);

        // Validaciones específicas
        if (!categoria) {
            mostrarError("Debe seleccionar una categoría");
            return null;
        }

        if (allFiles.length === 0) {
            mostrarError("Debe subir al menos una foto");
            return null;
        }

        if (!titulo) {
            mostrarError("Debe ingresar un título para el producto");
            return null;
        }

        if (!descripcion) {
            mostrarError("Debe escribir una descripción del producto");
            return null;
        }

        if (!precio || isNaN(precio) || precio <= 0) {
            mostrarError("Debe ingresar un precio válido");
            return null;
        }

        if (!categoria || !titulo || !descripcion || isNaN(precio) || fotos.length === 0) {
            mostrarError("Faltan datos por completar");
            return null;
        }
        console.log(categoria);
        console.log(fotos);
        console.log(titulo);
        console.log(descripcion);
        console.log(precio);

        const datos = {
            categoria,
            fotos,
            titulo,
            descripcion,
            precio
        };
        return datos;

    }

    function prepararEnvio() {
        const botonEnviar = document.getElementById("upload-product-submit");
        botonEnviar.addEventListener("click", async (e) => {
            e.preventDefault();

            const datos = recogerDatosFormulario();
            if (!datos) return;

            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("categoria", datos.categoria);
            formData.append("titulo", datos.titulo);
            formData.append("descripcion", datos.descripcion);
            formData.append("precio", datos.precio);

            // Agregar imágenes (fotos) al formData
            datos.fotos.forEach((foto, index) => {
                formData.append("fotos[]", foto); // usar "fotos[]" si backend lo espera como array
            });

            try {
                const response = await fetch("http://127.0.0.1:8080/CastroRetro/api/upload-product", {
                    method: "POST",
                    body: formData,
                    credentials: "include", // si usas cookies de sesión
                });

                const data = await response.json();

                if (data.success) {
                    mostrarExito(data.mensaje || "Producto creado correctamente");

                    setTimeout(() => {
                        fetch("http://127.0.0.1:8080/CastroRetro/api/validate-session", {
                            method: "GET",
                            credentials: "include"
                        })
                            .then(res => {
                                if (res.ok) {
                                    window.location.reload();
                                } else {
                                    mostrarError(data.mensaje);
                                }
                            });
                    }, 500);
                } else {
                    mostrarError(data.mensaje || "Hubo un problema al crear el producto");
                }

            } catch (error) {
                console.error(error);
                mostrarError("Ocurrió un error al enviar los datos");
            }
        });
    }


    subidaArchivos();
    mostrarFormulario();
    prepararEnvio();
}
