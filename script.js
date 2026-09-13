document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('invitationCard');
    const doors = document.getElementById('gatefoldDoors');
    const wrapper = document.querySelector('.invitation-wrapper');

    // ================= CONTROL DEL OVERLAY DE ROTACIÓN =================
    const rotateOverlay = document.getElementById('rotateScreenOverlay');

    if (rotateOverlay) {
        const timer = setTimeout(() => {
            rotateOverlay.classList.add('fade-out');
        }, 3500);

        rotateOverlay.addEventListener('click', () => {
            clearTimeout(timer);
            rotateOverlay.classList.add('fade-out');
        });

        window.addEventListener('orientationchange', () => {
            clearTimeout(timer);
            rotateOverlay.classList.add('fade-out');
        });
    }

    // ================= APERTURA DE LA TARJETA =================
    doors.addEventListener('click', () => {
        card.classList.add('open');
    });

    // ================= MODAL INFORMACIÓN EXTRA =================
    const openBtn = document.getElementById('openInfoBtn');
    const closeBtn = document.getElementById('closeInfoBtn');
    const overlay = document.getElementById('modalOverlay');

    function openModal() {
        if (overlay) overlay.classList.add('active');
    }

    function closeModal() {
        if (overlay) overlay.classList.remove('active');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ================= ESCALADO ADAPTATIVO =================
    function scaleInvitation() {
        if (!card || !wrapper) return;

        const isMobile = window.innerWidth <= 768;
        const marginX = isMobile ? 8 : 40;
        const marginY = isMobile ? 80 : 90;

        const availableW = window.innerWidth - marginX;
        const availableH = window.innerHeight - marginY;

        const scaleX = availableW / 900;
        const scaleY = availableH / 636;
        
        const scale = Math.min(scaleX, scaleY, 1);

        card.style.transform = `scale(${scale})`;
        wrapper.style.width = `${900 * scale}px`;
        wrapper.style.height = `${636 * scale}px`;
    }

    window.addEventListener('resize', scaleInvitation);
    window.addEventListener('orientationchange', scaleInvitation);
    scaleInvitation();
});
