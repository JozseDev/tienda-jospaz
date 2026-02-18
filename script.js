// Menú desplegable para móvil
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    function setupDropdowns() {
        if (window.innerWidth <= 768) {
            // MODO MÓVIL: activar con clic solo en la flecha/área del dropdown
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');

                // Remover cualquier evento anterior (para evitar duplicados)
                link.removeEventListener('click', handleClick);

                // Agregar nuevo evento
                link.addEventListener('click', handleClick);
            });
        } else {
            // MODO ESCRITORIO: remover clase active y eventos
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                link.removeEventListener('click', handleClick);
                dropdown.classList.remove('active');
            });
        }
    }

    function handleClick(e) {
        // Prevenir que el enlace navegue SOLO si tiene la clase dropdown
        // Y SOLO en móvil
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown');

            // Cerrar otros dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });

            // Toggle el actual
            dropdown.classList.toggle('active');
        }
    }

    // Ejecutar al cargar
    setupDropdowns();

    // Ejecutar al redimensionar la ventana
    window.addEventListener('resize', function () {
        setupDropdowns();
    });
});