// Base de datos extendida con múltiples imágenes y opción de video por producto
let products = [
    { 
        id: 1, name: "Saco Ejecutivo de Lino", price: 145.00, brand: "PH Premium", gender: "Hombre",
        sizes: ["S", "M", "L", "XL"], colors: ["Azul Marino", "Beige"], 
        description: "Saco ejecutivo ligero, perfecto para climas cálidos. Confeccionado en lino de alta calidad con forro interior de seda.",
        images: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"
        ] 
    },
    { 
        id: 2, name: "Blusa de Seda Minimalista", price: 55.00, brand: "PH Essential", gender: "Mujer",
        sizes: ["XS", "S", "M"], colors: ["Blanco", "Negro", "Vino"], 
        description: "Blusa de seda de corte limpio y minimalista. Ideal para conjuntos formales o casuales elegantes.",
        images: [
            "https://images.unsplash.com/photo-1551028719-0125fd6b9eb4?w=600&q=80",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
        ] 
    },
    { 
        id: 3, name: "Hoodie Urbano Oversize", price: 45.00, brand: "PH Street", gender: "Unisex",
        sizes: ["M", "L", "XL", "XXL"], colors: ["Gris", "Negro", "Verde Olivo"], 
        description: "Sudadera holgada de algodón pesado. Ideal para un look urbano y relajado.",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80"
        ] 
    },
    { 
        id: 4, name: "Vestido Midi Floreado", price: 78.00, brand: "PH Exclusive", gender: "Mujer",
        sizes: ["S", "M", "L"], colors: ["Rosa Pastel", "Azul Cielo"], 
        description: "Vestido midi con estampado floral sutil, tejido fresco y caída elegante para eventos casuales diurnos.",
        images: [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
        ] 
    },
    { 
        id: 5, name: "Pantalón Chino Casual", price: 62.00, brand: "PH Casual", gender: "Hombre",
        sizes: ["30", "32", "34", "36"], colors: ["Caqui", "Azul Marino", "Gris"], 
        description: "Pantalón chino de corte moderno, cómodo y versátil para el día a día u oficina moderna.",
        images: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&q=80"
        ] 
    },
    { 
        id: 6, name: "Conjunto Deportivo Infantil", price: 35.00, brand: "PH Kids", gender: "Niños",
        sizes: ["4A", "6A", "8A", "10A"], colors: ["Rojo", "Azul", "Negro"], 
        description: "Conjunto deportivo suave y resistente, diseñado especialmente para la comodidad y movilidad de los niños.",
        images: [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
            "https://images.unsplash.com/photo-1503944563490-ab10b374d57a?w=600&q=80"
        ] 
    }
];

// Configuración de Redes Sociales
const CONTACT_INFO = {
    whatsappPhone: "1234567890",
    instagramUrl: "https://instagram.com/tu_usuario",
    facebookUrl: "https://facebook.com/tu_pagina",
    tiktokUrl: "https://tiktok.com/@tu_usuario"
};

let isLoggedIn = false;
let currentFilter = "Todos";
let searchQuery = "";

// Referencias del DOM
const views = {
    catalog: document.getElementById('view-catalog'),
    detail: document.getElementById('view-detail'),
    login: document.getElementById('view-login'),
    admin: document.getElementById('view-admin')
};
const btnCatalog = document.getElementById('btn-catalog');
const btnLogout = document.getElementById('btn-logout');

// Navegación
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
    
    if (viewName === 'catalog') {
        btnCatalog.classList.add('active');
        renderCatalog();
    } else {
        btnCatalog.classList.remove('active');
    }

    if (viewName === 'admin') renderAdminTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnCatalog.addEventListener('click', () => switchView('catalog'));
document.getElementById('btn-back-catalog').addEventListener('click', () => switchView('catalog'));
btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    btnLogout.classList.add('hidden');
    switchView('catalog');
});

// Doble clic en logo abre Login de Admin
document.getElementById('secret-admin-trigger').addEventListener('dblclick', () => {
    isLoggedIn ? switchView('admin') : switchView('login');
});

// --- SISTEMA DE FILTRADO Y BÚSQUEDA ---
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCatalog();
});

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderCatalog();
    });
});

// Renderizado del Catálogo
function renderCatalog() {
    const container = document.getElementById('product-container');
    const noResultsMsg = document.getElementById('no-results');
    container.innerHTML = '';
    
    const filteredProducts = products.filter(prod => {
        const matchesCategory = (currentFilter === "Todos" || prod.gender === currentFilter);
        const matchesSearch = prod.name.toLowerCase().includes(searchQuery) || 
                              prod.brand.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        noResultsMsg.classList.remove('hidden');
        return;
    } else {
        noResultsMsg.classList.add('hidden');
    }

    filteredProducts.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProductDetail(prod.id);
        
        // Muestra la primera imagen como miniatura principal del catálogo
        const mainImg = (prod.images && prod.images.length > 0) ? prod.images[0].trim() : '';

        card.innerHTML = `
            <img src="${mainImg}" alt="${prod.name}" class="product-img">
            <div class="product-info">
                <h3>${prod.name}</h3>
                <p>$${prod.price.toFixed(2)}</p>
                <span class="gender-tag-small">${prod.gender}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Vista Detalle del Producto con Galería de Fotos y Video
function openProductDetail(id) {
    const prod = products.find(p => p.id === id);
    const container = document.getElementById('product-detail-container');
    
    const sizesHtml = prod.sizes.map(s => `<span class="badge">${s.trim()}</span>`).join('');
    const colorsHtml = prod.colors.map(c => `<span class="badge">${c.trim()}</span>`).join('');
    const msg = encodeURIComponent(`Hola, me interesa el producto "${prod.name}" (Género: ${prod.gender} | Precio: $${prod.price}). ¿Podrían darme más información?`);
    const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsappPhone}?text=${msg}`;

    const mediaList = prod.images.map(m => m.trim()).filter(m => m !== "");
    const firstMedia = mediaList.length > 0 ? mediaList[0] : "";

    // Función auxiliar para saber si es un video (.mp4 u otros)
    function isVideo(url) {
        return url.endsWith('.mp4') || url.includes('video/');
    }

    // Render inicial del visor multimedia principal
    let mainMediaHtml = isVideo(firstMedia) 
        ? `<video src="${firstMedia}" controls autoplay muted></video>` 
        : `<img src="${firstMedia}" alt="${prod.name}">`;

    // Render de las miniaturas del carrusel
    let thumbnailsHtml = '';
    mediaList.forEach((media, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const isVid = isVideo(media);
        const thumbClass = isVid ? 'thumbnail-item video-thumb' : 'thumbnail-item';
        
        let thumbContent = isVid 
            ? `<video src="${media}"></video>` 
            : `<img src="${media}" alt="Vista previa">`;

        thumbnailsHtml += `
            <div class="${thumbClass} ${activeClass}" data-index="${index}" onclick="changeMainMedia('${media}', this)">
                ${thumbContent}
            </div>
        `;
    });

    container.innerHTML = `
        <div class="media-gallery">
            <div class="main-media-container" id="main-media-display">
                ${mainMediaHtml}
            </div>
            <div class="thumbnails-container">
                ${thumbnailsHtml}
            </div>
        </div>
        <div class="detail-info">
            <div class="brand-gender-wrapper">
                <span class="detail-brand">${prod.brand}</span>
                <span class="gender-badge">${prod.gender}</span>
            </div>
            <h2>${prod.name}</h2>
            <div class="detail-price">$${prod.price.toFixed(2)}</div>
            <p class="detail-desc">${prod.description}</p>
            
            <div class="spec-group">
                <h4>Colores Disponibles</h4>
                <div class="badges-container">${colorsHtml}</div>
            </div>
            
            <div class="spec-group">
                <h4>Tallas Disponibles</h4>
                <div class="badges-container">${sizesHtml}</div>
            </div>

            <h4 class="contact-section-title">Hablar con un asesor</h4>
            <div class="social-contact-grid">
                <a href="${whatsappLink}" target="_blank" class="contact-btn btn-whatsapp">WhatsApp</a>
                <a href="${CONTACT_INFO.instagramUrl}" target="_blank" class="contact-btn btn-instagram">Instagram</a>
                <a href="${CONTACT_INFO.facebookUrl}" target="_blank" class="contact-btn btn-facebook">Facebook</a>
                <a href="${CONTACT_INFO.tiktokUrl}" target="_blank" class="contact-btn btn-tiktok">TikTok</a>
            </div>
        </div>
    `;
    switchView('detail');
}

// Función global para cambiar la foto/video principal al hacer clic en las miniaturas
window.changeMainMedia = function(url, element) {
    const displayContainer = document.getElementById('main-media-display');
    
    if (url.endsWith('.mp4') || url.includes('video/')) {
        displayContainer.innerHTML = `<video src="${url}" controls autoplay></video>`;
    } else {
        displayContainer.innerHTML = `<img src="${url}" alt="Vista detallada">`;
    }

    // Actualizar clase activa en miniaturas
    document.querySelectorAll('.thumbnail-item').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
};

// Lógica de Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    if (user === 'admin' && pass === '1234') {
        isLoggedIn = true;
        errorMsg.textContent = '';
        btnLogout.classList.remove('hidden');
        document.getElementById('login-form').reset();
        switchView('admin');
    } else {
        errorMsg.textContent = 'Credenciales incorrectas.';
    }
});

// Lógica CRUD de Administración
const formContainer = document.getElementById('product-form-container');
const productForm = document.getElementById('product-form');
const formTitle = document.getElementById('form-title');

document.getElementById('btn-add-new').addEventListener('click', () => {
    productForm.reset();
    document.getElementById('prod-id').value = '';
    formTitle.textContent = 'Agregar Nuevo Producto';
    formContainer.classList.remove('hidden');
});

document.getElementById('btn-cancel-form').addEventListener('click', () => {
    formContainer.classList.add('hidden');
});

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idField = document.getElementById('prod-id').value;
    
    const newProduct = {
        name: document.getElementById('prod-name').value,
        price: parseFloat(document.getElementById('prod-price').value),
        brand: document.getElementById('prod-brand').value,
        gender: document.getElementById('prod-gender').value,
        sizes: document.getElementById('prod-sizes').value.split(','),
        colors: document.getElementById('prod-colors').value.split(','),
        description: document.getElementById('prod-desc').value,
        images: document.getElementById('prod-images').value.split(',')
    };

    if (idField) {
        const index = products.findIndex(p => p.id == idField);
        newProduct.id = parseInt(idField);
        products[index] = newProduct;
    } else {
        newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(newProduct);
    }
    
    formContainer.classList.add('hidden');
    renderAdminTable();
});

function renderAdminTable() {
    const tbody = document.getElementById('admin-product-list');
    tbody.innerHTML = '';
    
    products.forEach(prod => {
        const firstImg = (prod.images && prod.images.length > 0) ? prod.images[0].trim() : '';
        tbody.innerHTML += `
            <tr>
                <td>
                    <img src="${firstImg}" alt="${prod.name}">
                    <span style="font-weight:500">${prod.name}</span>
                </td>
                <td><span class="badge">${prod.gender}</span></td>
                <td>$${prod.price.toFixed(2)}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct(${prod.id})">Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.editProduct = function(id) {
    const prod = products.find(p => p.id === id);
    document.getElementById('prod-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-brand').value = prod.brand;
    document.getElementById('prod-gender').value = prod.gender;
    document.getElementById('prod-sizes').value = prod.sizes.join(', ');
    document.getElementById('prod-colors').value = prod.colors.join(', ');
    document.getElementById('prod-desc').value = prod.description;
    document.getElementById('prod-images').value = prod.images.join(', ');
    
    formTitle.textContent = 'Editar Producto';
    formContainer.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteProduct = function(id) {
    if(confirm('¿Estás seguro de eliminar este producto del catálogo?')) {
        products = products.filter(p => p.id !== id);
        renderAdminTable();
    }
};

// Inicializar
renderCatalog();