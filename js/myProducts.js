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


    function ventas() {

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
            const divProductos = document.querySelector("#contenido-ventas");


            if (!data || data.length === 0) {
                const mensaje = document.createElement('p');
                mensaje.textContent = "NO HAS PUBLICADO NINGÚN PRODUCTO";
                mensaje.className = "text-center text-gray-500 text-4xl pt-32";
                divProductos.appendChild(mensaje);
                return;
            }



            data.forEach(producto => {

                let estadoHTML = { parrafo: "", color: "" };

                switch (producto.state) {
                    case "Pendiente de aprobacion":
                        estadoHTML.parrafo = '<p class="text-red-400 text-xl font-black">Pendiente de aprobación</p>';
                        estadoHTML.color = "#f8717140";
                        break;
                    case "Vendido":
                        estadoHTML.parrafo = '<p class="text-yellow-400 text-xl font-black">Vendido</p>';
                        estadoHTML.color = "#facc1550";
                        break;
                    case "Disponible":
                        estadoHTML.parrafo = '<p class="text-green-500 text-xl font-black">Disponible</p>';
                        estadoHTML.color = "#22c55e50";
                        break;
                    default:
                        estadoHTML.parrafo = '<p class="text-gray-400">🔍 Estado no especificado</p>';
                        break;
                }


                console.log(estadoHTML.color);
                const tarjeta = document.createElement('div');
                tarjeta.className = `flex flex-col sm:flex-row items-start gap-6 bg-transparent text-white shadow-md p-4 mb-4 rounded-2xl border`;
                tarjeta.style.backgroundColor = `${estadoHTML.color}`;

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
                    
                    ${estadoHTML.parrafo}
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
                tarjeta.querySelector('.guardar-btn').addEventListener("click", (e) => {
                    e.preventDefault();

                    const datos = recogerDatosFormulario();
                    if (!datos) return;


                    const formData = new FormData();
                    formData.append("categoria", datos.categoria);
                    formData.append("titulo", datos.titulo);
                    formData.append("descripcion", datos.descripcion);
                    formData.append("precio", datos.precio.toString()); // Asegurar que sea string

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
    ventas();

    function compras() {
        fetch(`http://127.0.0.1:8080/CastroRetro/api/bought-products?userId=${userId}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                crearProductos(data);
                animacionProductos();
            })
            .catch(err => {
                console.error(err);
                mostrarError("Ocurrió un error al recoger los productos");
            });


        function crearProductos(datos) {
            const divProductos = document.querySelector("#contenido-compras");

            datos.forEach((producto) => {
                const a = document.createElement("a");
                a.href = `./product.html?id=${producto.productId}`;
                a.className = "product flex flex-col my-5 p-2 justify-center items-center rounded-xl";

                a.innerHTML = `
					<div class="w-full aspect-square">
						<img class="w-full h-full object-cover rounded-xl" src="${"http://127.0.0.1:8080/CastroRetro/" + producto.images[0]}" alt="${producto.title}">
					</div>
					<div class="w-full p-4">
						<div class="flex justify-between items-center">
						<p class="text-2xl font-bold text-[#ff0000] mb-1">${producto.productPrice} €</p>
						<p class="text-lg font-thin text-gray-400 mb-1">${producto.category}</p>
						</div>
						<p class="text-2xl font-bold text-[#ffb847] truncate">${producto.title}</p>
						<p class="text-sm pt-2 text-white line-clamp-3">${producto.description}</p>
					</div>
					`;

                divProductos.appendChild(a);
            });

        }

        function animacionProductos() {
            document.querySelectorAll('.product').forEach(product => {
                product.addEventListener('mousemove', (e) => {
                    const rect = product.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const rotateX = -((y / rect.height - 0.5) * 20);
                    const rotateY = ((x / rect.width - 0.5) * 20);

                    product.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                product.addEventListener('mouseleave', () => {
                    product.style.transform = `rotateX(0deg) rotateY(0deg)`;
                });
            });
        }
    }
    compras();
}