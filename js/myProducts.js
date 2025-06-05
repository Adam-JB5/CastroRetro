import { mostrarError, mostrarExito } from "./utils.js";

export default function myProducts() {

    function pestannas() {
        const tabComprados = document.getElementById('tab-comprados');
        const tabVendidos = document.getElementById('tab-vendidos');
        const contentComprados = document.getElementById('my-products-comprados');
        const contentVendidos = document.getElementById('my-products-vendidos');

        function activarTab(tabActiva, contenidoActivo, otraTab, otroContenido) {
            document.querySelector("main").classList.add("h-max");

            tabActiva.classList.add('tab-button-active');
            otraTab.classList.remove('tab-button-active');
            contenidoActivo.classList.add('tab-active');
            otroContenido.classList.remove('tab-active');
        }

        tabComprados.addEventListener('click', () => {
            activarTab(tabComprados, contentComprados, tabVendidos, contentVendidos);
        });

        tabVendidos.addEventListener('click', () => {
            activarTab(tabVendidos, contentVendidos, tabComprados, contentComprados);
        });
    }

    pestannas();

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const userId = usuario.userId;


    fetch(`http://127.0.0.1:8080/CastroRetro/api/products?userId=${userId}`, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            todosProductos(data);
        })
        .catch(err => {
            console.error(err);
            mostrarError("Ocurrió un error al recoger los productos");
        });

    function todosProductos(data) {
        const divProductos = document.querySelector("#my-products-vendidos > div");

        data.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'flex flex-col sm:flex-row items-start gap-6 bg-transparent text-white shadow-md p-4 mb-4 rounded-2xl border';

            const imagenes = producto.images.map(url => `
            <img src="http://127.0.0.1:8080/CastroRetro/${url}" alt="imagen" class="w-full h-32 object-cover rounded-md">`).join('');

            tarjeta.innerHTML = `
                <div class="grid grid-cols-2 gap-2 w-64 flex-shrink-0">
                    ${imagenes}
                </div>
                <form class="flex flex-col flex-grow space-y-4 w-full sm:w-auto">
                    <input type="text" value="${producto.title}" class="my-products-title w-3/4 text-white bg-black bg-opacity-80 focus:bg-opacity-100 text-2xl rounded-lg py-2 px-4" placeholder="Título"/>
                    
                    <textarea class="my-products-description w-3/4 text-white bg-black bg-opacity-80 focus:bg-opacity-100 text-xl rounded-lg py-2 px-4" rows="4" placeholder="Descripción (Estado, funcionamiento, daños...)">${producto.description}</textarea>
                    
                    <div class="relative w-3/4">
                        <select class="my-products-category w-full text-white bg-black bg-opacity-80 focus:bg-opacity-100 text-2xl rounded-lg py-2 px-4 pr-10 appearance-none">
                            <option value="Consola" ${producto.category === "Consola" ? "selected" : ""}>Consola</option>
                            <option value="Juego" ${producto.category === "Juego" ? "selected" : ""}>Videojuego</option>
                            <option value="Accesorio" ${producto.category === "Accesorio" ? "selected" : ""}>Accesorio</option>
                            <option value="Otro" ${producto.category === "Otro" ? "selected" : ""}>Otro</option>
                        </select>
                        <!-- Flecha personalizada -->
                        <div class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white text-2xl">
                            ▼
                        </div>
                    </div>
                    
                    <div class="flex">
                        <input type="number" value="${producto.productPrice}" class="my-products-price w-3/4 text-white bg-black bg-opacity-80 focus:bg-opacity-100 text-2xl rounded-lg py-2 px-4 mr-2"/>
                        <div class="bg-black w-1/12 h-12 flex justify-center items-center rounded-md">€</div>
                    </div>

                    <p class="text-white mb-1"><strong>Fecha publicación:</strong> ${producto.publishDate}</p>
                </form>
                <div class="flex flex-col gap-2 h-full justify-center items-end">
                    <button type="submit" class="guardar-btn bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                        Guardar cambios
                    </button>
                    <button class="eliminar-btn bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                        Eliminar
                    </button>
                </div>
            `;

            /* Evento de eliminacion */
            tarjeta.querySelector('.eliminar-btn').addEventListener('click', () => {
                const confirmar = confirm(`¿Estás seguro de que deseas eliminar "${producto.title}"?`);
                if (!confirmar) return;

                fetch(`http://127.0.0.1:8080/CastroRetro/api/delete-products?id=${producto.productId}`, {
                    method: 'POST',
                    credentials: 'include'
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Error al eliminar');
                        mostrarExito(`Producto "${producto.title}" eliminado`, 2000);
                        tarjeta.remove();
                    })
                    .catch(error => {
                        console.error(error);
                        mostrarError('No se pudo eliminar el producto.');
                    });
            });

            /* Evento de actualizacion de datos */
            /* Evento de actualizacion de datos - VERSIÓN CORREGIDA */
            tarjeta.querySelector('.guardar-btn').addEventListener("click", (e) => {
                e.preventDefault();

                const datos = recogerDatosFormulario();
                if (!datos) return;

                // OPCIÓN 1: Usar FormData (recomendado)
                const formData = new FormData();
                formData.append("categoria", datos.categoria);
                formData.append("titulo", datos.titulo);
                formData.append("descripcion", datos.descripcion);
                formData.append("precio", datos.precio.toString()); // Asegurar que sea string

                console.log("Enviando datos:");
                for (let [key, value] of formData.entries()) {
                    console.log(key + ': ' + value);
                }

                fetch(`http://127.0.0.1:8080/CastroRetro/api/update-products?id=${producto.productId}`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                })
                    .then(response => {
                        console.log('Response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Response data:', data);
                        if (data.success) {
                            mostrarExito(`Producto "${producto.title}" modificado`, 2000);
                            
                        } else {
                            mostrarError(data.mensaje || 'Error al actualizar el producto');
                        }
                    })
                    .catch(error => {
                        console.error('Error completo:', error);
                        mostrarError('No se pudo modificar el producto.');
                    });
            });

            

            divProductos.appendChild(tarjeta);

            function recogerDatosFormulario() {

                const titulo = tarjeta.querySelector(".my-products-title")?.value.trim();
                const descripcion = tarjeta.querySelector(".my-products-description")?.value.trim();
                const categoria = tarjeta.querySelector(".my-products-category")?.value;
                const precio = parseFloat(tarjeta.querySelector(".my-products-price")?.value);

                // Validaciones específicas
                if (!categoria) {
                    mostrarError("Debe seleccionar una categoría");
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

                if (!categoria || !titulo || !descripcion || isNaN(precio)) {
                    mostrarError("Faltan datos por completar");
                    return null;
                }
                console.log(categoria);
                console.log(titulo);
                console.log(descripcion);
                console.log(precio);

                const datos = {
                    categoria,
                    titulo,
                    descripcion,
                    precio
                };
                return datos;
            }
        });
    }
}