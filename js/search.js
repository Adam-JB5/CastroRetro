import { mostrarError, mostrarExito } from "./utils.js";

export default function search() {
    const params = new URLSearchParams(window.location.search);
    const termino = params.get("busqueda");

    if (!termino) {
        console.error("No se proporcionó un término");
        mostrarError("No se proporcionó un término");
        return;
    }

    function normalizar(texto) {
        return texto
            .normalize("NFD")                  // separa letras y tildes
            .replace(/[\u0300-\u036f]/g, "")  // elimina los signos diacríticos (tildes)
            .toLowerCase()                    // pasa a minúsculas
            .replace(/\s+/g, " ")             // normaliza espacios múltiples a uno
            .trim();                          // quita espacios al inicio y final
    }

    function buscarProductos(productos, termino) {
        const terminoNormalizado = normalizar(termino);

        return productos.filter(producto => {
            const titulo = normalizar(producto.title || "");
            const descripcion = normalizar(producto.description || "");
            const categoria = normalizar(producto.category || "");

            return (
                titulo.includes(terminoNormalizado) ||
                descripcion.includes(terminoNormalizado) ||
                categoria.includes(terminoNormalizado)
            );
        });
    }

    fetch(`http://127.0.0.1:8080/CastroRetro/api/products?estado=Disponible`, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const productosFiltrados = buscarProductos(data, termino);
            console.log(productosFiltrados);
            crearProductos(productosFiltrados);
            animacionProductos();
        })
        .catch(err => {
            console.error(err);
            mostrarError("Ocurrió un error al recoger los productos");
        });

    function crearProductos(datos) {
        const divProductos = document.getElementById("search-div-productos");

        if (!datos.length) {
            mostrarError("No se han encontrado productos que coincidan con la búsqueda.\nPrueba otro término");
            return;
        } else {
            mostrarExito(`Se han encontrado ${datos.length} productos`);
        }

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