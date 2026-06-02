// ============================================
// VELTRIX - Fondo de partículas animadas
// ============================================

const canvas = document.getElementById('particulas');
const ctx = canvas.getContext('2d');

let ancho, alto;
let particulas = [];

// Configuración
const NUM_PARTICULAS = 80;
const COLOR_PRIMARIO = 'rgba(0, 212, 255, 0.8)';
const COLOR_SECUNDARIO = 'rgba(123, 47, 255, 0.6)';

// Redimensionar canvas
function redimensionar() {
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho;
    canvas.height = alto;
}

// Crear partícula
function crearParticula() {
    return {
        x: Math.random() * ancho,
        y: Math.random() * alto,
        radio: Math.random() * 3 + 1,
        velocidadX: (Math.random() - 0.5) * 0.8,
        velocidadY: (Math.random() - 0.5) * 0.8,
        color: Math.random() > 0.5 ? COLOR_PRIMARIO : COLOR_SECUNDARIO,
        opacidad: Math.random() * 0.6 + 0.2
    };
}

// Inicializar partículas
function iniciarParticulas() {
    particulas = [];
    for (let i = 0; i < NUM_PARTICULAS; i++) {
        particulas.push(crearParticula());
    }
}

// Dibujar conexiones entre partículas cercanas
function dibujarConexiones() {
    for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
            const dx = particulas[i].x - particulas[j].x;
            const dy = particulas[i].y - particulas[j].y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distancia / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particulas[i].x, particulas[i].y);
                ctx.lineTo(particulas[j].x, particulas[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animar
function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    // Dibujar conexiones primero (detrás de las partículas)
    dibujarConexiones();

    for (let p of particulas) {
        // Mover
        p.x += p.velocidadX;
        p.y += p.velocidadY;

        // Rebote en bordes
        if (p.x < 0 || p.x > ancho) p.velocidadX *= -1;
        if (p.y < 0 || p.y > alto) p.velocidadY *= -1;

        // Dibujar
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.8', String(p.opacidad)).replace('0.6', String(p.opacidad));
        ctx.fill();

        // Brillo externo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacidad * 0.1})`;
        ctx.fill();
    }

    requestAnimationFrame(animar);
}

// Evento de redimensionar
window.addEventListener('resize', () => {
    redimensionar();
    iniciarParticulas();
});

// Iniciar
redimensionar();
iniciarParticulas();
animar();