
export default function home() {
	console.log("homehome");
	fetch('http://127.0.0.1:8080/CastroRetro/api/products', {
		credentials: 'include'
	})
		.then(res => res.json())
		.then(data => {
			// Seleccionamos los 3 items ya presentes en el DOM
			const slides = document.querySelectorAll("#carouselExample .carousel-item");

			for (let i = 0; i < slides.length; i++) {
				const slide = slides[i];
				slide.innerHTML = ''; // Limpiar contenido anterior

				const flexContainer = document.createElement("div");
				flexContainer.className = "flex";

				for (let j = 0; j < 2; j++) {
					const index = i * 2 + j;
					if (index >= data.length) break;

					const p = data[index];

					const a = document.createElement("a");
					a.href = `./product.html?id=${p.product_id}`;
					a.className = "product flex flex-col h-5/6 my-5 p-2 justify-center items-center max-w-xs rounded-xl mx-auto";

					a.innerHTML = `
      <div class="w-full aspect-square">
        <img class="w-full h-full object-cover rounded-xl" src="${"http://127.0.0.1:8080/CastroRetro/" + p.images[0]}" alt="${p.title}">
      </div>
      <div class="w-full p-4">
        <div class="flex justify-between items-center">
          <p class="text-2xl font-bold text-[#ff0000] mb-1">${p.product_price} €</p>
          <p class="text-lg font-thin text-gray-400 mb-1">${p.category}</p>
        </div>
        <p class="text-2xl font-bold text-[#ffb847] truncate">${p.title}</p>
        <p class="text-sm pt-2 text-white line-clamp-3">${p.description}</p>
      </div>
    `;

					flexContainer.appendChild(a);
				}

				slide.appendChild(flexContainer);
			}
		});

}