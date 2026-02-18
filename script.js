// ===== CARRITO DE COMPRAS - ALMA NEUTRA =====
// Inicializar carrito desde localStorage o array vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += producto.cantidad || 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: producto.cantidad || 1
        });
    }

    guardarCarrito();
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    guardarCarrito();
    mostrarCarrito(); // Si estamos en la página del carrito
}

// Vaciar carrito completo
function vaciarCarrito() {
    if (carrito.length === 0) return;

    if (confirm('¿Vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        mostrarCarrito(); // Si estamos en la página del carrito
    }
}

// Calcular total del carrito
function calcularTotal() {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

// Mostrar carrito en la página carrinho.html
function mostrarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const totalContainer = document.getElementById('carrito-total');
    const carritoVacio = document.getElementById('carrito-vacio');

    if (!contenedor) return; // No estamos en la página del carrito

    if (carrito.length === 0) {
        contenedor.innerHTML = '';
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (totalContainer) totalContainer.innerHTML = '$0';
        return;
    }

    if (carritoVacio) carritoVacio.style.display = 'none';

    let html = '';
    carrito.forEach(producto => {
        html += `
            <div class="carrito-item">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-imagen">
                <div class="carrito-item-info">
                    <h4>${producto.nombre}</h4>
                    <p class="carrito-item-precio">$${producto.precio.toLocaleString('es-CL')}</p>
                    <div class="carrito-item-cantidad">
                        <button onclick="cambiarCantidad('${producto.id}', -1)">-</button>
                        <span>${producto.cantidad}</span>
                        <button onclick="cambiarCantidad('${producto.id}', 1)">+</button>
                    </div>
                </div>
                <div class="carrito-item-subtotal">
                    <p>$${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</p>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito('${producto.id}')">✕</button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;

    if (totalContainer) {
        totalContainer.innerHTML = `$${calcularTotal().toLocaleString('es-CL')}`;
    }
}

// Cambiar cantidad de un producto
function cambiarCantidad(id, delta) {
    const producto = carrito.find(item => item.id === id);
    if (!producto) return;

    producto.cantidad += delta;

    if (producto.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarCarrito();
        mostrarCarrito();
    }
}

// Notificación flotante
function mostrarNotificacion(mensaje) {
    // Eliminar notificación existente
    const notificacionExistente = document.querySelector('.notificacion-carrito');
    if (notificacionExistente) notificacionExistente.remove();

    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    // Mostrar y luego eliminar
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    actualizarContadorCarrito();

    // Configurar botones "Añadir" en todas las páginas
    const botonesAgregar = document.querySelectorAll('.add-to-cart');
    botonesAgregar.forEach((boton, index) => {
        boton.addEventListener('click', function (e) {
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            // Extraer información del producto
            const img = productCard.querySelector('.product-image img');
            const nombre = productCard.querySelector('h3')?.textContent || 'Producto';
            const precioTexto = productCard.querySelector('.price')?.textContent || '$0';
            const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));

            // Crear ID único basado en nombre y precio (para desarrollo)
            const id = `prod-${nombre.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`;

            const producto = {
                id: id,
                nombre: nombre,
                precio: precio,
                imagen: img ? img.src : 'https://placehold.co/400x400/f0f0f0/ff7f7f?text=Producto',
                cantidad: 1
            };

            agregarAlCarrito(producto);
        });
    });

    // Si estamos en carrinho.html, mostrar el carrito
    if (document.getElementById('carrito-items')) {
        mostrarCarrito();

        // Botón vaciar carrito
        const btnVaciar = document.getElementById('vaciar-carrito');
        if (btnVaciar) {
            btnVaciar.addEventListener('click', vaciarCarrito);
        }

        // Botón seguir comprando
        const btnSeguir = document.getElementById('seguir-comprando');
        if (btnSeguir) {
            btnSeguir.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
});