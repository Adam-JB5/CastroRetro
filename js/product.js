import { mostrarError, mostrarExito } from "./utils.js";

export default function product() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
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
            if (!data || !data.productId) {
                throw new Error("Producto no encontrado");
            }
            crearProducto(data);
        })
        .catch(err => {
            console.error(err);
            mostrarError();
        });

    function crearProducto(producto) {

        const main = document.querySelector("main");
        main.innerHTML = `
        <div class="flex flex-col h-full items-center justify-center bg-[#1b1d36] text-white py-12 px-4 space-y-10">

            <h1 class="text-7xl text-white">${producto.title.toUpperCase()}</h1>

            <div class="w-full h-full max-w-6xl flex flex-col lg:flex-row gap-12">

                <!-- Carrusel -->
                <div class="w-full lg:w-1/2">
                    <div id="productCarousel" class="carousel slide rounded-xl overflow-hidden shadow-lg aspect-[4/3]" data-bs-ride="carousel">
                        <div class="carousel-inner h-full">
                            ${producto.images.map((src, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''} h-full">
                                    <img src="http://127.0.0.1:8080/CastroRetro/${src}"
                                        class="d-block w-full h-full object-cover"
                                        alt="Imagen ${index + 1}">
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>

                <!-- Info producto -->
                <div class="w-full lg:w-1/2 flex flex-col h-full">
                    <!-- Parte superior -->
                    <div class="space-y-4">
                        <p class="text-gray-400 text-sm">Categoría: ${producto.category}</p>
                        <p class="text-gray-400 text-sm">Publicado: ${producto.publishDate}</p>
                        <p class="text-gray-400 text-sm">Estado: ${producto.state}</p>
                        <h2 class="text-4xl text-red-600 font-semibold">${producto.productPrice.toFixed(2)} €</h2>
                    </div>

                    <!-- Descripción centrada verticalmente -->
                    <div class="flex-1 flex items-center justify-center">
                        <p class="text-lg leading-relaxed text-center px-4">${producto.description}</p>
                    </div>

                    <!-- Botón abajo -->
                     <!-- Contenedor para el botón PayPal -->
                    <div id="paypal-button-container" class="mt-auto w-full"></div>
                </div>
            </div>
        </div>
        `;


        // Solo mostrar y activar botón PayPal si el producto está disponible
        if (producto.state === "Disponible") {
            const datos = { userId: usuario.userId, productId: producto.productId };
            paypal.Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: producto.productPrice.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        console.log('Pago completado por', details.payer.name.given_name);

                        // Simular compra en backend
                        return fetch("http://127.0.0.1:8080/CastroRetro/api/comprar", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams(datos)
                        })
                            .then(res => {
                                if (!res.ok) throw new Error("Error al procesar compra");
                                return res.json();
                            })
                            .then(data => {
                                console.log(data);
                                mostrarExito("Compra completada correctamente 🎉");
                            })
                            .catch(err => {
                                console.error(err);
                                mostrarError("Hubo un error al procesar la compra");
                            });
                    });
                },
                onCancel: function () {
                    mostrarError("Compra cancelada");
                },
                onError: function (err) {
                    console.error("Error en el pago", err);
                    mostrarError("Error en el pago");
                }
            }).render('#paypal-button-container');

        } else {
            // Producto no disponible: mostramos botón deshabilitado
            const container = document.getElementById('paypal-button-container');
            container.innerHTML = `
                <button disabled class="w-full px-6 py-3 bg-gray-500 text-black font-bold rounded-xl cursor-not-allowed opacity-50">
                    PRODUCTO NO DISPONIBLE
                </button>
            `;
        }

    }
}
