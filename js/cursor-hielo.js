// ============================================
// VELTRIX – Cursor de fractura de hielo
// ============================================

{
    const canvasHielo = document.getElementById('canvasHielo');
    const ctxHielo = canvasHielo.getContext('2d');

    let anchoHielo = canvasHielo.width = window.innerWidth;
    let altoHielo = canvasHielo.height = window.innerHeight;

    window.addEventListener('resize', () => {
        anchoHielo = canvasHielo.width = window.innerWidth;
        altoHielo = canvasHielo.height = window.innerHeight;
    });

    const raton = { x: anchoHielo / 2, y: altoHielo / 2, prevX: anchoHielo / 2, prevY: altoHielo / 2 };
    const grietas = [];
    const cursorPunto = document.getElementById('cursorHielo');

    document.addEventListener('mousemove', (e) => {
        raton.prevX = raton.x;
        raton.prevY = raton.y;
        raton.x = e.clientX;
        raton.y = e.clientY;

        if (cursorPunto) {
            cursorPunto.style.left = raton.x + 'px';
            cursorPunto.style.top = raton.y + 'px';
        }

        const velocidad = Math.hypot(raton.x - raton.prevX, raton.y - raton.prevY);

        if (velocidad > 1) {
            for (let i = 0; i < 3; i++) {
                grietas.push({
                    x: raton.x,
                    y: raton.y,
                    vx: (raton.x - raton.prevX) * 0.3 + (Math.random() - 0.5) * 2,
                    vy: (raton.y - raton.prevY) * 0.3 + (Math.random() - 0.5) * 2,
                    vida: 1
                });
            }
        }
    });

    function dibujarHielo() {
        ctxHielo.clearRect(0, 0, anchoHielo, altoHielo);

        for (let i = grietas.length - 1; i >= 0; i--) {
            const g = grietas[i];
            g.x += g.vx;
            g.y += g.vy;
            g.vida -= 0.02;

            ctxHielo.beginPath();
            ctxHielo.strokeStyle = `rgba(180, 230, 255, ${g.vida * 0.6})`;
            ctxHielo.shadowBlur = 8;
            ctxHielo.shadowColor = 'rgba(0, 212, 255, 0.8)';
            ctxHielo.moveTo(g.x, g.y);
            ctxHielo.lineTo(g.x + g.vx * 4, g.y + g.vy * 4);
            ctxHielo.stroke();

            if (g.vida <= 0) {
                grietas.splice(i, 1);
            }
        }

        ctxHielo.shadowBlur = 0;
        ctxHielo.globalAlpha = 1;

        requestAnimationFrame(dibujarHielo);
    }

    dibujarHielo();
}