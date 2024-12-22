document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const consultaInput = document.getElementById("consulta");
    const condicionesInput = document.getElementById("condiciones");

    form.addEventListener("submit", (event) => {
        
        let isValid = true;
    
        console.log("Validando formulario...");
    
        if (nombreInput.value.trim() === "") {
            console.log("Nombre vacío");
            showError(nombreInput, "El nombre es obligatorio.");
            isValid = false;
        }
    
        if (emailInput.value.trim() === "") {
            console.log("Correo vacío");
            showError(emailInput, "El correo es obligatorio.");
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            console.log("Formato de correo inválido");
            showError(emailInput, "El formato del correo no es válido.");
            isValid = false;
        }
    
        if (consultaInput.value.trim() === "") {
            console.log("Consulta vacía");
            showError(consultaInput, "La consulta no puede estar vacía.");
            isValid = false;
        }
    
        if (!condicionesInput.checked) {
            console.log("Condiciones no aceptadas");
            showError(condicionesInput, "Debes aceptar las condiciones para continuar.");
            isValid = false;
        }
    
        if (!isValid) {
            event.preventDefault();
        } else {
            console.log("Formulario válido");
        }
    });

    // Función para mostrar errores
    function showError(input, message) {
        const error = document.createElement("p");
        error.textContent = message;
        error.classList.add("error");
    
        // Evita agregar múltiples mensajes para el mismo campo
        const existingError = input.parentElement.querySelector(".error");
        if (existingError) {
            existingError.textContent = message;
        } else {
            input.parentElement.appendChild(error);
        }
    }

    // Función para limpiar errores previos
    function clearErrors() {
        const errors = document.querySelectorAll(".error");
        errors.forEach((error) => error.remove());
    }

    // Función para validar formato de correo electrónico
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});






document.addEventListener("DOMContentLoaded", () => {
    // Inicializa el carrito desde localStorage o como un arreglo vacío
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Guarda el carrito en localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Actualiza el contador del carrito
    function updateCartCounter() {
        const cartCounter = document.getElementById("cart-counter");
        if (cartCounter) {
            cartCounter.textContent = cart.length;
        }
    }

    // Función para renderizar el carrito
    function renderCart() {
        const cartDetails = document.getElementById("cart-details");
        const cartTotal = document.getElementById("cart-total");
        const finalizeButton = document.querySelector(".finalize-button");

        if (!cartDetails || !cartTotal || !finalizeButton) return;

        // Limpia los detalles actuales
        cartDetails.innerHTML = "";

        // Calcula el total
        let total = 0;

        // Si el carrito está vacío, muestra un mensaje y desactiva el botón
        if (cart.length === 0) {
            cartDetails.innerHTML = `<p>El carrito está vacío.</p>`;
            cartTotal.textContent = "0.00";
            finalizeButton.disabled = true;
            finalizeButton.textContent = "Carrito vacío";
            return;
        }

        // Genera el HTML para cada producto
        cart.forEach((product, index) => {
            total += product.price;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <span>${product.name}</span>
                <span>$${product.price.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;

            cartDetails.appendChild(cartItem);
        });

        // Actualiza el total
        cartTotal.textContent = total.toFixed(2);

        // Activa el botón "Finalizar Compra"
        finalizeButton.disabled = false;
        finalizeButton.textContent = "Finalizar Compra";
        finalizeButton.onclick = () => {
            alert(`Gracias por tu compra. Total a pagar: $${total.toFixed(2)}`);
            clearCart();
            updateCartCounter();
        };

        // Asigna eventos a los botones "Eliminar"
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                removeFromCart(index);
                updateCartCounter();
            });
        });
    }

    // Función para agregar un producto al carrito
    function addToCart(product) {
        cart.push(product);
        saveCart();
        updateCartCounter();
        alert(`${product.name} agregado al carrito.`);
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    // Función para vaciar el carrito
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        updateCartCounter();
    }

    // Carga los productos en productos.html
    async function loadProducts() {
        const productsContainer = document.getElementById("products-container");

        try {
            const response = await fetch("/productos.json");
            if (!response.ok) throw new Error("Error al cargar el archivo JSON");

            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            productsContainer.innerHTML = "<p>Error al cargar los productos.</p>";
        }
    }

    // Renderiza los productos en el DOM
    function renderProducts(products) {
        const productsContainer = document.getElementById("products-container");
        productsContainer.innerHTML = "";

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("item");

            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p><strong>${product.name}</strong></p>
                <p>${product.description}</p>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Agregar al carrito
                </button>
            `;

            productsContainer.appendChild(productItem);
        });

        // Asigna eventos a los botones "Agregar al carrito"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const product = {
                    id: button.getAttribute("data-id"),
                    name: button.getAttribute("data-name"),
                    price: parseFloat(button.getAttribute("data-price")),
                };
                addToCart(product);
            });
        });
    }

    // Inicializa
    renderCart();
    loadProducts();
    updateCartCounter();

    // Asigna el evento al botón "Vaciar carrito"
    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", clearCart);
        updateCartCounter();
    }
});


// Lógica del slider
const sliderImages = document.querySelector('.slider-images');
const images = document.querySelectorAll('.slider-images img');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;

function updateSlider() {
    const width = images[0].clientWidth;
    sliderImages.style.transform = `translateX(-${currentIndex * width}px)`;
}

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlider();
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlider();
});

window.addEventListener('resize', updateSlider); // Ajusta el slider al redimensionar la ventana



