const contenedorCarritoVacio = document.getElementById("carrito-vacio");
const contenedorCarritoProductos = document.getElementById("carrito-productos");
const contenedorCarritoAcciones = document.getElementById("carrito-acciones");
const contenedorCarritoComprado = document.getElementById("carrito-comprado");
const botonVaciar = document.getElementById("carrito-acciones-vaciar");
const contenedorTotal = document.getElementById("total");
const botonComprar = document.getElementById("carrito-acciones-comprar");

let productosEnCarrito = obtenerProductosEnCarrito();

function obtenerProductosEnCarrito() {
    const carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    return carrito;
}

function guardarProductosEnCarrito() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function cargarProductosCarrito() {
    const tieneProductos = productosEnCarrito.length > 0;

    contenedorCarritoVacio.classList.toggle("disabled", tieneProductos);
    contenedorCarritoProductos.classList.toggle("disabled", !tieneProductos);
    contenedorCarritoAcciones.classList.toggle("disabled", !tieneProductos);
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("carrito-producto");
        div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Título</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
        `;
        contenedorCarritoProductos.appendChild(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
}

function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idProducto = e.currentTarget.getAttribute("data-id");
    const index = productosEnCarrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        cargarProductosCarrito();
        guardarProductosEnCarrito();
    }
}

function vaciarCarrito() {
    if (productosEnCarrito.length === 0) {
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito = [];
            guardarProductosEnCarrito();
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    let totalCalculado = 0;
    
    for (const producto of productosEnCarrito) {
        totalCalculado += producto.precio * producto.cantidad;
    }

    contenedorTotal.innerText = `$${totalCalculado}`;
}

function comprarCarrito() {
    productosEnCarrito = [];
    guardarProductosEnCarrito();

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}

cargarProductosCarrito();

botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);




