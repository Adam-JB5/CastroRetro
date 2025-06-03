import { mostrarError } from "./utils.js";

export default function product() {


    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("No se proporcionó un ID en la URL");
        mostrarError();
        return;
    }

    fetch(`http://127.0.0.1:8080/CastroRetro/api/product?id=${id}`, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
            mostrarError();
        });

    function crearProducto(datos) {
        const divProductos = document.getElementById("product-div-productos");

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
}