export function mostrarError(mensaje) {
    let errorDiv = document.getElementById("register-error");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "register-error";
        errorDiv.className = `
            fixed top-10 left-1/2 transform -translate-x-1/2 
            bg-red-600 bg-opacity-60 text-white text-2xl px-6 py-4 
            rounded-xl shadow-lg z-50 fadeIn
        `;
        document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;

    // Ocultar automáticamente después de unos segundos
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}


export function mostrarExito(mensaje, tiempo) {
    let successDiv = document.getElementById("register-success");
    if (!successDiv) {
        successDiv = document.createElement("div");
        successDiv.id = "register-success";
        successDiv.className = `
            fixed top-10 left-1/2 transform -translate-x-1/2 
            bg-green-600 text-white text-2xl px-6 py-4 
            rounded-xl shadow-lg z-50 fadeIn
        `;
        document.body.appendChild(successDiv);
    }

    successDiv.textContent = mensaje;

    // Se elimina el div despues de 2 segundos
    setTimeout(() => {
        successDiv.remove();
    }, (tiempo || 2000));
}

export const consolasMap = {
  "Atari Jaguar": {
    nombre: "Atari - Jaguar",
    descripcion: "Consola de 64 bits de los años 90, con catálogo limitado y hardware único.",
    precio: 150
  },
  "Game Boy Color": {
    nombre: "Nintendo - Game Boy Color",
    descripcion: "Consola portátil de 8 bits con pantalla a color, muy popular en los 90.",
    precio: 50
  },
  "Microsoft Xbox": {
    nombre: "Microsoft - Xbox Original",
    descripcion: "Primera consola de Microsoft con hardware potente para su época.",
    precio: 60
  },
  "Microsoft Xbox One X": {
    nombre: "Microsoft - Xbox One X",
    descripcion: "Consola de alta gama con soporte 4K y gran potencia gráfica.",
    precio: 300
  },
  "Microsoft Xbox 360": {
    nombre: "Microsoft - Xbox 360",
    descripcion: "Consola exitosa con amplia biblioteca de juegos y soporte online.",
    precio: 100
  },
  "Gamecube Hd": {
    nombre: "Nintendo - GameCube (HD Modificado)",
    descripcion: "GameCube clásico con modificaciones para salida HD.",
    precio: 120
  },
  "Commodore 64": {
    nombre: "Commodore - 64",
    descripcion: "Clásico ordenador personal con capacidades de consola de videojuegos.",
    precio: 200
  },
  "Atari 2600": {
    nombre: "Atari - 2600",
    descripcion: "Consola pionera en videojuegos caseros, icono de los 70.",
    precio: 100
  },
  "Colecovision": {
    nombre: "Coleco - Vision",
    descripcion: "Consola de 8 bits con buena biblioteca y gráficos avanzados para su época.",
    precio: 120
  },
  "Game Boy Advance": {
    nombre: "Nintendo - Game Boy Advance",
    descripcion: "Consola portátil con pantalla más grande y catálogo extenso.",
    precio: 60
  },
  "Nec Turbografx-16": {
    nombre: "NEC - TurboGrafx-16",
    descripcion: "Consola de 16 bits con fuerte presencia en Japón y juegos exclusivos.",
    precio: 130
  },
  "Neo Geo Pocket": {
    nombre: "SNK - Neo Geo Pocket",
    descripcion: "Consola portátil con juegos arcade y buena duración de batería.",
    precio: 100
  },
  "Neo Geo": {
    nombre: "SNK - Neo Geo",
    descripcion: "Consola arcade doméstica con juegos legendarios y alto costo.",
    precio: 600
  },
  "Nintendo 3Ds": {
    nombre: "Nintendo - 3DS",
    descripcion: "Portátil con pantalla 3D sin gafas y amplia biblioteca.",
    precio: 120
  },
  "Nintendo 64": {
    nombre: "Nintendo - 64",
    descripcion: "Primera consola 3D de Nintendo con juegos icónicos.",
    precio: 150
  },
  "Nintendo Ds": {
    nombre: "Nintendo - DS",
    descripcion: "Consola portátil con doble pantalla y pantalla táctil.",
    precio: 80
  },
  "Nintendo Gamecube": {
    nombre: "Nintendo - GameCube",
    descripcion: "Consola casera con catálogo de juegos exclusivos y mando distintivo.",
    precio: 100
  },
  "Nintendo Switch Lite": {
    nombre: "Nintendo - Switch Lite",
    descripcion: "Versión portátil y más económica de la Switch original.",
    precio: 130
  },
  "Nintendo Switch Oled": {
    nombre: "Nintendo - Switch OLED",
    descripcion: "Switch con pantalla OLED y mejoras en audio y soporte.",
    precio: 250
  },
  "Nintendo Wii": {
    nombre: "Nintendo - Wii",
    descripcion: "Consola revolucionaria con control de movimiento y juegos familiares.",
    precio: 80
  },
  "Sony Playstation Portable": {
    nombre: "Sony - PlayStation Portable (PSP)",
    descripcion: "Consola portátil de Sony lanzada en 2004, con pantalla a color y buen catálogo de juegos multimedia",
    precio: 100
  },
  "Sony Playstation Classic": {
    nombre: "Sony - PlayStation 1",
    descripcion: "Primera consola de Sony con grandes juegos y gran éxito comercial.",
    precio: 70
  },
  "Sony Playstation 2": {
    nombre: "Sony - PlayStation 2",
    descripcion: "Consola más vendida de la historia con una biblioteca enorme.",
    precio: 100
  },
  "Playstation 3": {
    nombre: "Sony - PlayStation 3",
    descripcion: "Consola con Blu-Ray y funciones multimedia.",
    precio: 120
  },
  "Playstation 4": {
    nombre: "Sony - PlayStation 4",
    descripcion: "Consola popular con grandes exclusivas y potente hardware.",
    precio: 200
  },
  "Playstation 5": {
    nombre: "Sony - PlayStation 5",
    descripcion: "Última generación con soporte para ray tracing y juegos 4K.",
    precio: 450
  }
};