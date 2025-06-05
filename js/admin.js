import { mostrarError, mostrarExito } from "./utils.js";

export default function admin() {


    /* VALIDACION DE ADMIN */
    function validacionAdmin() {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario.isAdmin) {
            window.location.href = "./home.html";
            return;
        }
    }
    validacionAdmin();


    /* APROBACION DE PRODUCTOS */

    const divApproveProducts = document.getElementById('admin-approve-products-div');

    function productosPorAprobar(data) {
        data.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className =
                'flex flex-row items-start gap-6 bg-transparent text-white shadow-md p-4 mb-4 rounded-2xl border';

            const imagenes = producto.images.map(url => `
                    <img src="http://127.0.0.1:8080/CastroRetro/${url}" alt="imagen" class="w-full h-32 object-cover rounded-md">`).join('');

            tarjeta.innerHTML = `
					<div class="grid grid-cols-2 gap-2 w-64 flex-shrink-0">
						${imagenes}
					</div>
					<div class="flex-grow">
						<h3 class="text-xl font-bold mb-1">${producto.title}</h3>
						<p class="text-white mb-1"><strong>Descripción:</strong> ${producto.description}</p>
						<p class="text-white mb-1"><strong>Categoría:</strong> ${producto.category}</p>
						<p class="text-white mb-1"><strong>Precio:</strong> ${producto.productPrice} €</p>
                        <p class="text-white mb-1"><strong>Fecha publicación:</strong> ${producto.publishDate}</p>
					</div>
					<div class="flex items-center">
						<button class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all aprobar-btn">
							Aprobar
						</button>
					</div>
				`;

            // Evento al botón de aprobar
            tarjeta.querySelector('.aprobar-btn').addEventListener('click', () => {
                fetch(`http://127.0.0.1:8080/CastroRetro/api/approve-products?id=${producto.productId}`, {
                    method: 'POST',
                    credentials: 'include'
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Error al aprobar');
                        mostrarExito(`Producto "${producto.title}" aprobado`, 2000);
                        tarjeta.remove(); // Eliminar de la vista
                    })
                    .catch(error => {
                        console.error(error);
                        mostrarError('No se pudo aprobar el producto.');
                    });
            });

            divApproveProducts.appendChild(tarjeta);
        });
    }

    fetch('http://127.0.0.1:8080/CastroRetro/api/products?estado=Pendiente de aprobacion', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {

            divApproveProducts.innerHTML = ''; // limpiar

            if (!data || data.length === 0) {
                const h2 = document.createElement("h2");
                h2.innerText = "NO HAY PRODUCTOS POR APROBAR";
                h2.className = "text-gray-400 text-5xl";
                divApproveProducts.appendChild(h2);
                return;
            }

            productosPorAprobar(data);
        })
        .catch(error => {
            console.error('Error cargando productos pendientes:', error);
        });


    /* TODOS LOS PRODUCTOS */

    const divProducts = document.getElementById("admin-products-div");

    function todosProductos(data) {
        data.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className =
                'flex flex-row items-start gap-6 bg-transparent text-white shadow-md p-4 mb-4 rounded-2xl border';

            const imagenes = producto.images.map(url => `
                    <img src="http://127.0.0.1:8080/CastroRetro/${url}" alt="imagen" class="w-full h-32 object-cover rounded-md">`).join('');

            tarjeta.innerHTML = `
					<div class="grid grid-cols-2 gap-2 w-64 flex-shrink-0">
						${imagenes}
					</div>
					<div class="flex-grow">
						<h3 class="text-xl font-bold mb-1">${producto.title}</h3>
						<p class="text-white mb-1"><strong>Descripción:</strong> ${producto.description}</p>
						<p class="text-white mb-1"><strong>Categoría:</strong> ${producto.category}</p>
						<p class="text-white mb-1"><strong>Precio:</strong> ${producto.productPrice} €</p>
                        <p class="text-white mb-1"><strong>Fecha publicación:</strong> ${producto.publishDate}</p>
					</div>
					<div class="flex items-center">
						<button id="eliminar-btn" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
							Eliminar
						</button>
					</div>
				`;

            // Evento al botón de eliminar
            tarjeta.querySelector('#eliminar-btn').addEventListener('click', () => {

                const confirmar = confirm(`¿Estás seguro de que deseas eliminar "${producto.title}"?`);

                if (!confirmar) return;

                
                fetch(`http://127.0.0.1:8080/CastroRetro/api/delete-products?id=${producto.productId}`, {
                    method: 'POST',
                    credentials: 'include'
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Error al eliminar');
                        mostrarExito(`Producto "${producto.title}" eliminado`, 2000);
                        tarjeta.remove(); // Eliminar de la vista
                    })
                    .catch(error => {
                        console.error(error);
                        mostrarError('No se pudo eliminar el producto.');
                    });
            });

            divProducts.appendChild(tarjeta);
        });
    }

    fetch('http://127.0.0.1:8080/CastroRetro/api/products', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {

            divProducts.innerHTML = ''; // limpiar

            if (!data || data.length === 0) {
                const h2 = document.createElement("h2");
                h2.innerText = "NO HAY PRODUCTOS";
                h2.className = "text-gray-400 text-5xl";
                divProducts.appendChild(h2);
                return;
            }

            todosProductos(data);
        })
        .catch(error => {
            console.error('Error cargando productos pendientes:', error);
        });
}
