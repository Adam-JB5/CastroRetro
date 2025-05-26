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


export function mostrarExito(mensaje) {
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

    // Redirección automática luego de 2 segundos
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}