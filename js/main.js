let productos = [];
const contenedorProductos = document.getElementById("contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.getElementById("titulo-principal");
const numerito = document.getElementById("numerito");

const fetchData = async () => {
    try {
      const response = await fetch("./JSON/productos.json");
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      const data = await response.json();
      productos = data;
      cargarProductos(productos);
    } catch (error) {
      console.error('Hubo un error al obtener los datos:', error);
    }
  }
  
  fetchData(); 

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const { imagen, titulo, precio, id } = producto;

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${imagen}" alt="${titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${titulo}</h3>
                <p class="producto-precio">$${precio}</p>
                <button class="producto-agregar" data-id="${id}">Agregar</button>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const categoriaSeleccionada = e.currentTarget.id;
            const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaSeleccionada);
            tituloPrincipal.innerText = productosFiltrados[0].categoria.nombre;
            cargarProductos(productosFiltrados);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

let productosEnCarrito = obtenerProductosEnCarrito();

function obtenerProductosEnCarrito() {
    const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
    return productosEnCarritoLS ? JSON.parse(productosEnCarritoLS) : [];
}

function guardarProductosEnCarrito() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { }
    }).showToast();

    const idBoton = e.currentTarget.getAttribute("data-id");
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    guardarProductosEnCarrito();
}

function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}







