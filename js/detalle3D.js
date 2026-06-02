// ============================================
// VELTRIX – Visor 3D con Three.js (r128)
// ============================================

let modeloActual = null;

// ESCENA
const escena = new THREE.Scene();
escena.background = new THREE.Color(0xffffff);

// CÁMARA
const camara = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    100
);

camara.position.set(0, 0, 20);

// RENDERER
const renderizador = new THREE.WebGLRenderer({
    antialias: true
});

renderizador.setPixelRatio(window.devicePixelRatio);
renderizador.setSize(500, 500);

renderizador.outputEncoding = THREE.sRGBEncoding;

// CONTENEDOR HTML
const contenedor = document.getElementById('detalleCanvas3D');

contenedor.style.width = '100%';
contenedor.style.height = '500px';
contenedor.style.display = 'block';
contenedor.style.border = '2px solid red';

contenedor.appendChild(renderizador.domElement);

// DEBUG VISUAL
renderizador.domElement.style.width = '100%';
renderizador.domElement.style.height = '500px';
renderizador.domElement.style.display = 'block';
renderizador.domElement.style.background = 'pink';
renderizador.domElement.style.border = '4px solid blue';

// TAMAÑO INICIAL
renderizador.setSize(
    contenedor.clientWidth,
    contenedor.clientHeight
);

// LUCES
const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    1
);

escena.add(luzAmbiente);

const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    2
);

luzPrincipal.position.set(5, 10, 7);

escena.add(luzPrincipal);

// CONTROLES
const controls = new THREE.OrbitControls(
    camara,
    renderizador.domElement
);

controls.enableDamping = true;

controls.target.set(0, 0, 0);

controls.update();

// ============================================
// CARGAR MODELO
// ============================================

function cargarModelo(ruta) {

    if (modeloActual) {

        escena.remove(modeloActual);

        modeloActual = null;
    }

    const loader = new THREE.GLTFLoader();

    loader.load(

        ruta,

        (gltf) => {

            modeloActual = gltf.scene;

            escena.add(modeloActual);
            

            modeloActual.position.set(0, 0, 0);

            modeloActual.scale.set(10, 10, 10);
            modeloActual.rotation.y = Math.PI;

            camara.position.set(0, 0, 5);

            controls.target.set(0, 0, 0);

            controls.update();

            console.log('✅ Modelo agregado DIRECTO');
        },

        undefined,

        (error) => {

            console.error(
                '❌ Error al cargar modelo:',
                error
            );
        }
    );
}

// ============================================
// AJUSTAR TAMAÑO
// ============================================

function ajustarTamaño() {

    const ancho = contenedor.clientWidth;

    const alto = contenedor.clientHeight;

    renderizador.setSize(ancho, alto);

    camara.aspect = ancho / alto;

    camara.updateProjectionMatrix();
}

window.addEventListener(
    'resize',
    ajustarTamaño
);

// ============================================
// ANIMACIÓN
// ============================================

function animar() {

    requestAnimationFrame(animar);

    renderizador.render(
        escena,
        camara
    );

    console.log("renderizando...");
}

//ajustarTamaño();

animar();