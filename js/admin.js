import { mostrarError, mostrarExito } from "./utils.js";

export default function admin() {

    function validacionAdmin() {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario.isAdmin) {
            window.location.href = "./home.html";
            return;
        }
    }
    validacionAdmin();

    const divProducts = document.getElementById('admin-products-div');

    fetch('http://127.0.0.1:8080/CastroRetro/api/products?estado=Pendiente de aprobacion', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            divProducts.innerHTML = ''; // limpiar

            if (!data || data.length === 0) {
                const h2 = document.createElement("h2");
                h2.innerText = "NO HAY PRODUCTOS POR APROBAR";
                h2.className = "text-gray-400 text-5xl";
                divProducts.appendChild(h2);
                return;
            }

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

                divProducts.appendChild(tarjeta);
            });
        })
        .catch(error => {
            console.error('Error cargando productos pendientes:', error);
        });
}
