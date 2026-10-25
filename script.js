document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('invitationCard');
    const doors = document.getElementById('gatefoldDoors');
    const wrapper = document.querySelector('.invitation-wrapper');

    // ================= CONTROL DE MÚSICA DE FONDO =================
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    let isMusicPlaying = false;

    // ================= CONTROL DEL OVERLAY DE ROTACIÓN =================
    const rotateOverlay = document.getElementById('rotateScreenOverlay');

    if (rotateOverlay) {
        const timer = setTimeout(() => {
            rotateOverlay.classList.add('fade-out');
        }, 3500);

        rotateOverlay.addEventListener('click', () => {
            clearTimeout(timer);
            rotateOverlay.classList.add('fade-out');
            
            try {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                }
            } catch (error) {}
        });

        window.addEventListener('orientationchange', () => {
            clearTimeout(timer);
            rotateOverlay.classList.add('fade-out');
        });
    }

    // ================= APERTURA Y CIERRE DE LA TARJETA + MÚSICA =================
    if (doors && card) {
        doors.addEventListener('click', () => {
            card.classList.add('open');

            if (bgMusic) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    if (musicBtn) musicBtn.classList.remove('paused');
                }).catch(error => {
                    console.log("Reproducción bloqueada por el navegador:", error);
                });
            }
        });
    }

    // Cerrar al hacer clic en el panel central
    const panelCenter = document.querySelector('.panel-center');
    if (panelCenter && card) {
        panelCenter.addEventListener('click', (e) => {
            // Evitamos cerrar si el usuario ha hecho clic sobre el enlace del mapa
            if (e.target.closest('a')) return;
            
            card.classList.remove('open');
        });
    }

    // Control del botón flotante de música
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                musicBtn.classList.add('paused');
            } else {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicBtn.classList.remove('paused');
                }).catch(error => {});
            }
        });
    }

    // ================= ESCALADO ADAPTATIVO EXACTO PARA SAFARI =================
    function scaleInvitation() {
        if (!card || !wrapper) return;

        const bodyRect = document.body.getBoundingClientRect();
        const availableW = bodyRect.width;
        const availableH = bodyRect.height;

        const isMobile = availableW <= 768;
        const isLandscape = availableW > availableH;
        
        const marginX = isMobile ? 12 : 40;
        const marginY = isMobile ? (isLandscape ? 35 : 12) : 40;

        const scaleX = (availableW - marginX) / 900;
        const scaleY = (availableH - marginY) / 636;
        
        const scale = Math.min(scaleX, scaleY, 1);

        card.style.transform = `scale(${scale})`;
        wrapper.style.width = `${900 * scale}px`;
        wrapper.style.height = `${636 * scale}px`;
    }

    window.addEventListener('resize', scaleInvitation);
    window.addEventListener('orientationchange', () => {
        setTimeout(scaleInvitation, 150);
    });
    
    scaleInvitation();
});
