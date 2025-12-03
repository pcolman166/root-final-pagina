
document.addEventListener("DOMContentLoaded", () => { 
    // ===========================================
    // 1. APARICIÓN DE ELEMENTOS AL HACER SCROLL
    // ===========================================
    const hiddenElements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    hiddenElements.forEach(element => observer.observe(element));


    // ===========================================
    // 2. FUNCIONALIDAD DEL MENÚ DE NAVEGACIÓN
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.content');
    const cuenta = document.querySelector('.menu-cuenta > a');
    const menuCuenta = document.querySelector('.menu-cuenta');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('show');
            document.body.classList.toggle('menu-abierto', menu.classList.contains('show'));
            // Cambia el icono del botón (☰ <-> X)
            if (menu.classList.contains('show')) {
                menuToggle.innerHTML = '&times;'; // X
            } else {
                menuToggle.innerHTML = '&#9776;'; // ☰
            }
        });
        // Asegura que el icono sea ☰ al cargar
        menuToggle.innerHTML = '&#9776;';
    }

    // Lógica para desplegar el submenú "Mi Cuenta" solo en móvil
    // Nota: El submenú es controlado por CSS usando la clase .open
    if (window.innerWidth <= 430 && cuenta && menuCuenta) {
        cuenta.addEventListener('click', (e) => {
            e.preventDefault();
            menuCuenta.classList.toggle('open');
        });
    }


    // ===========================================
    // 3. CARRUSEL (Solo si la pantalla es móvil <= 600px)
    // ===========================================
    if (window.innerWidth <= 600) {
        const slider = document.querySelector(".slider--inner");
        const images = document.querySelectorAll(".slider--inner img");
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");

        let currentIndex = 0;

        const updateCarousel = () => {
            // Aseguramos que solo se mueva por el ancho del *contenedor visible*
            const width = slider.offsetWidth;
            slider.style.transform = `translateX(-${currentIndex * width}px)`;
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % images.length; // Cicla al inicio
            updateCarousel();
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length; // Cicla al final
            updateCarousel();
        };

        if (nextButton && prevButton) {
            nextButton.addEventListener("click", showNextImage);
            prevButton.addEventListener("click", showPrevImage);
        }

        // Opcional: Avanzar automáticamente cada 5 segundos
        setInterval(showNextImage, 5000);

        // Ajustar el carrusel al redimensionar la ventana (para evitar descalibres)
        window.addEventListener("resize", updateCarousel);
        
        // Ejecutar al inicio para asegurar el posicionamiento
        updateCarousel(); 
    }
    
    
    // ===========================================
    // 4. LÓGICA DE CAMBIO DE MONEDA EN LOS CURSOS
    // ===========================================
    const selectorMoneda = document.getElementById('moneda');

    if (selectorMoneda) {
        // Función para actualizar la visibilidad de los precios
        function actualizarPrecios() {
            const monedaSeleccionada = selectorMoneda.value;
            const mostrarPesos = monedaSeleccionada === 'ars';
            
            // Oculta/Muestra ARS
            document.querySelectorAll('.precio-ars').forEach(el => {
                // Usamos 'inline' para elementos <span> de precios
                el.style.display = mostrarPesos ? 'inline' : 'none'; 
            });

            // Oculta/Muestra USD
            document.querySelectorAll('.precio-usd').forEach(el => {
                el.style.display = mostrarPesos ? 'none' : 'inline';
            });
        }

        selectorMoneda.addEventListener('change', actualizarPrecios);
        
        // Ejecuta la función al cargar para establecer el estado inicial correcto
        actualizarPrecios();
    }
});


// ===========================================
// CONFIGURACIÓN DE LA GALERÍA DE FOTOS
// ===========================================

const fotosServicios = {
    novias: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/novia (3).jpeg', titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia (1).jpeg', titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia (2).jpeg', titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia (4).jpeg', titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia (5).jpeg', titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia.jpeg',     titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novia.JPG',      titulo: 'Makeup Bodas' },
        { src: 'imagenes/cursos/fotos/novias.JPG',     titulo: 'Makeup Bodas' },
        { src: 'imagenes/bodas.jpeg',        titulo: 'Makeup Bodas' },
           { src: 'imagenes/agregadas/quince15.jpeg', titulo: 'Makeup bodas' },
        { src: 'imagenes/agregadas/boda0.jpeg',  titulo: 'Makeup Bodas' },
        { src: 'imagenes/agregadas/boda2.jpeg',  titulo: 'Makeup Bodas' },
        { src: 'imagenes/agregadas/boda3.jpeg',  titulo: 'Makeup Bodas' },
        { src: 'imagenes/agregadas/boda8.jpeg',  titulo: 'Makeup Bodas' },
        { src: 'imagenes/agregadas/bodas1.jpeg', titulo: 'Makeup Bodas' }
    ],

    quinceaneras: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/15.jpg',         titulo: 'Makeup Quinceañeras' },
        { src: 'imagenes/quinceañeraaa.jpeg', titulo: 'Makeup Quinceañeras' },
        { src: 'imagenes/quinceaños.jpeg',    titulo: 'Makeup Quinceañeras' },
        { src: 'imagenes/quinceee.jpeg',      titulo: 'Makeup Quinceañeras' },
        { src: 'imagenes/quincess.jpeg',      titulo: 'Makeup Quinceañeras' },
        { src: 'imagenes/agregadas/quinces.jpg',   titulo: 'Makeup Quinceañeras' }
    ],

    social: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/social.JPG',      titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (1).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (2).JPG',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (3).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (4).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (5).JPG',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (6).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (7).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social (8).jpg',  titulo: 'Makeup Social' },
        { src: 'imagenes/cursos/fotos/social.jpeg',     titulo: 'Makeup Social' },
        { src: 'imagenes/social222.jpeg',     titulo: 'Makeup Social' },
        { src: 'imagenes/socialllll.jpeg',    titulo: 'Makeup Social' },
        { src: 'imagenes/index-img/carrusel/fotocelina.jpg.jpeg',       titulo: 'Makeup Social' }
    ],

    campana: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/Campaña .JPG',    titulo: 'Editorial y Campaña' },
        { src: 'imagenes/cursos/fotos/campana (1).jpg', titulo: 'Editorial y Campaña' },
        { src: 'imagenes/cursos/fotos/campaña.jpg',     titulo: 'Editorial y Campaña' },
        { src: 'imagenes/cursos/fotos/campana.jpg',     titulo: 'Editorial y Campaña' },
        { src: 'imagenes/campañaaa.jpeg',     titulo: 'Editorial y campaña' },
        { src: 'imagenes/campañaaaaaaa.jpeg',  titulo: 'Editorial y campaña' },
        { src: 'imagenes/editorial.jpeg',     titulo: 'Editorial y campaña' },
        { src: 'imagenes/agregadas/campañana.jpeg',  titulo: 'Editorial y Campaña' },
        { src: 'imagenes/agregadas/camppaña.jpeg',   titulo: 'Editorial y Campaña' }
    ],

    artistico: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/artistico.jpg',      titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (1).jpg',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (2).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (3).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (4).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (5).jpg',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (6).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (7).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (8).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (9).JPG',  titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (10).JPG', titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (11).jpg', titulo: 'Makeup Artístico' },
        { src: 'imagenes/cursos/fotos/artistico (12).jpg', titulo: 'Makeup Artístico' },
        { src: 'imagenes/artisticoo.jpeg',         titulo: 'makeup Artístico' },
        { src: 'imagenes/artisticooo.jpeg',        titulo: 'makeup Artístico Full Color' },
        { src: 'imagenes/artisticooooo.jpeg',      titulo: 'makeup Artístico Full Color' },
        { src: 'imagenes/artisticooooooooo.jpeg',  titulo: 'makeup Artístico Full Color' }
    ],

    trabajo: [
        // --- FOTOS ANTERIORES ---
        { src: 'imagenes/cursos/fotos/certificado (1).jpeg', titulo: 'Certificaciones' },
        { src: 'imagenes/cursos/fotos/certificado.jpeg',     titulo: 'Certificaciones' },
        { src: 'imagenes/cursos/fotos/automake up.jpeg',     titulo: 'Taller Automaquillaje' },
        { src: 'imagenes/cursos/fotos/Bio.jpg',          titulo: 'Bio y Backstage' },
        { src: 'imagenes/trabajoooo.jpeg',        titulo: 'Trabajos Recientes' },

        // --- AGREGADAS RECIENTEMENTE (Carpeta agregadas) ---
        { src: 'imagenes/agregadas/1trabajo.jpeg',        titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/automakeupppp.jpeg',  titulo: 'Taller Automaquillaje' },
        { src: 'imagenes/agregadas/traabaajo.jpeg',       titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/trabajito.jpeg',       titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/trabajo5.jpeg',        titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/trabajoo8.jpeg',       titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/trabbajo.jpeg',        titulo: 'Trabajos Recientes' },
        { src: 'imagenes/agregadas/trrabajo.jpeg',        titulo: 'Trabajos Recientes' }
    ]
};
let servicioActual = null;
let indiceFoto = 0;

function abrirGaleria(servicio) {
    if (!fotosServicios[servicio]) return; // Si no existe la categoría, no hace nada

    servicioActual = servicio;
    indiceFoto = 0; // Siempre empieza por la primera foto
    actualizarVistaGaleria();

    const modal = document.getElementById('galeriaModal');
    modal.style.display = 'flex'; // Primero lo hacemos visible
    setTimeout(() => {
        modal.classList.add('activo'); // Luego activamos la opacidad para la animación
    }, 10);
    
    document.body.style.overflow = 'hidden'; // Evita scroll en la página de fondo
}

function cerrarGaleria() {
    const modal = document.getElementById('galeriaModal');
    modal.classList.remove('activo');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Reactiva scroll
    }, 300); // Espera a que termine la animación
}

function cambiarImagen(direccion) {
    if (!servicioActual) return;

    const totalFotos = fotosServicios[servicioActual].length;
    // Lógica circular (si llega al final vuelve al inicio)
    indiceFoto = (indiceFoto + direccion + totalFotos) % totalFotos;
    
    actualizarVistaGaleria();
}

function actualizarVistaGaleria() {
    const data = fotosServicios[servicioActual][indiceFoto];
    const imgElement = document.getElementById('imagenGaleria');
    const tituloElement = document.getElementById('tituloGaleria');
    const contador = document.getElementById('contadorFotos');

    // Efecto visual: ocultar un poco la imagen antes de cambiar
    imgElement.style.opacity = 0;
    
    setTimeout(() => {
        imgElement.src = data.src;
        tituloElement.textContent = data.titulo;
        contador.textContent = `${indiceFoto + 1} / ${fotosServicios[servicioActual].length}`;
        imgElement.style.opacity = 1;
    }, 200);
}

// Cerrar con tecla ESC y usar flechas del teclado
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('galeriaModal');
    // Solo si el modal está abierto
    if (modal.classList.contains('activo')) {
        if (e.key === 'Escape') cerrarGaleria();
        if (e.key === 'ArrowLeft') cambiarImagen(-1);
        if (e.key === 'ArrowRight') cambiarImagen(1);
    }
});