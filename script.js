document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('invitationCard');
    const doors = document.getElementById('gatefoldDoors');
    const wrapper = document.querySelector('.invitation-wrapper');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const rotateOverlay = document.getElementById('rotateScreenOverlay');
    let isMusicPlaying = false;
    let hintTimer;

    // ================= ESCALADO ADAPTATIVO =================
    function scaleInvitation() {
        if (!card || !wrapper) return;

        const cs = getComputedStyle(document.body);
        const availW = window.innerWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const availH = window.innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

        // Cerrada solo se ve la portada (50 %); abierta, el tríptico completo
        const contentW = card.classList.contains('open') ? 900 : 450;
        const contentH = 636;

        const margin = Math.min(availW, availH) < 500 ? 8 : 24;
        const scale = Math.min(
            (availW - margin * 2) / contentW,
            (availH - margin * 2) / contentH,
            1.4
        );

        card.style.transform = `scale(${scale})`;
        wrapper.style.width = `${contentW * scale}px`;
        wrapper.style.height = `${contentH * scale}px`;
    }

    // ================= AVISO DE GIRAR (solo al abrir, en vertical y móvil) =================
    function showRotateHint() {
        if (!rotateOverlay) return;
        const portrait = window.matchMedia('(orientation: portrait)').matches;
        if (!portrait || window.innerWidth > 768) return;
        rotateOverlay.classList.remove('fade-out');
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => rotateOverlay.classList.add('fade-out'), 3500);
    }

    function hideRotateHint() {
        clearTimeout(hintTimer);
        if (rotateOverlay) rotateOverlay.classList.add('fade-out');
    }

    if (rotateOverlay) {
        rotateOverlay.addEventListener('click', () => {
            hideRotateHint();
            try {
                const el = document.documentElement;
                (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
            } catch (e) {}
        });
    }

    // ================= ABRIR / CERRAR LA TARJETA + MÚSICA =================
    if (doors && card) {
        doors.addEventListener('click', () => {
            card.classList.add('open');
            scaleInvitation();
            showRotateHint();

            if (bgMusic) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicBtn?.classList.remove('paused');
                }).catch(() => {});
            }
        });
    }

    const panelCenter = document.querySelector('.panel-center');
    if (panelCenter && card) {
        panelCenter.addEventListener('click', (e) => {
            // No cerrar si se pulsa el enlace del mapa
            if (e.target.closest('a')) return;
            card.classList.remove('open');
            hideRotateHint();
            scaleInvitation();
        });
    }

    // ================= BOTÓN DE MÚSICA =================
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
                }).catch(() => {});
            }
        });
    }

    // ================= REDIMENSIÓN / GIRO DE PANTALLA =================
    window.addEventListener('resize', scaleInvitation);
    window.addEventListener('orientationchange', () => {
        hideRotateHint();
        setTimeout(scaleInvitation, 150);
        setTimeout(scaleInvitation, 500); // Safari a veces tarda en dar el tamaño final
    });

    scaleInvitation();
});
