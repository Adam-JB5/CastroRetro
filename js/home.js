import { mostrarError, mostrarExito } from "./utils.js";

export default function home() {

	fetch('http://127.0.0.1:8080/CastroRetro/api/products?estado=Disponible', {
		credentials: 'include'
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			crearUltimosProductos(data);
			crearProductos(data);
			animacionProductos();
			animacionCategorias();
		})
		.catch(err => {
			console.error(err);
			mostrarError("Ocurrió un error al recoger los productos");
		});

	function crearUltimosProductos(datos) {
		// Seleccionamos los 3 items ya presentes en el DOM
		const slides = document.querySelectorAll("#carouselExample .carousel-item");

		for (let i = 0; i < slides.length; i++) {
			const slide = slides[i];
			slide.innerHTML = ''; // Limpiar contenido anterior

			const flexContainer = document.createElement("div");
			flexContainer.className = "flex";

			for (let j = 0; j < 2; j++) {
				const index = i * 2 + j;
				if (index >= datos.length) break;

				const producto = datos[index];

				const a = document.createElement("a");
				a.href = `./product.html?id=${producto.productId}`;
				a.className = "product flex flex-col my-5 p-2 justify-center items-center w-1/5 rounded-xl mx-auto";

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

				flexContainer.appendChild(a);
			}

			slide.appendChild(flexContainer);
		}
	}

	function crearProductos(datos) {
		const divProductos = document.getElementById("home-div-productos");

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

	function animacionCategorias() {
		document.querySelectorAll('.home-category').forEach(div => {
			let x = 50;
			let y = 50;

			div.addEventListener('mousemove', function (e) {
				const rect = div.getBoundingClientRect();
				x = ((e.clientX - rect.left) / rect.width) * 100;
				y = ((e.clientY - rect.top) / rect.height) * 100;
				div.style.backgroundPosition = `${x}% ${y}%`;
			});


		});
	}

}