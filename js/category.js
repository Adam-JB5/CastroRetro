import { mostrarError, mostrarExito } from "./utils.js";


export default function category() {

    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    if (!categoria) {
        console.error("No se proporcionó un ID en la URL");
        mostrarError("No se proporcionó un ID en la URL");
        return;
    }

    const h1 = document.getElementById("category-title");

    switch (categoria) {
        case "Consola":
            h1.innerText = "Consolas".toUpperCase();
            break;
        case "Juego":
            h1.innerText = "Videojuegos".toUpperCase();
            break;
        case "Accesorio":
            h1.innerText = "Accesorios".toUpperCase();
            break;
        case "Otro":
            h1.innerText = "Otros productos".toUpperCase();
            break;
    }

    fetch(`http://127.0.0.1:8080/CastroRetro/api/products?estado=Disponible&categoria=${categoria}`, {
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
        const divProductos = document.getElementById("category-div-productos");

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