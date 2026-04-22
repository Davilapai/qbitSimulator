/**
 * Módulo 4: Visualizer
 * Renderiza el Histograma de Probabilidades en el DOM.
 */
export class Visualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Limpia el contenedor y renderiza el histograma
     * @param {Object} probabilities - Ejemplo: { "00": 0.5, "11": 0.5 }
     */
    renderHistogram(probabilities) {
        this.container.innerHTML = ''; // Limpiar el contenedor actual
        
        const entries = Object.entries(probabilities);
        
        if (entries.length === 0) {
            this.container.innerHTML = '<p style="color:#bf616a;">Sin resultados (Estado nulo o colapso inesperado).</p>';
            return;
        }

        // Ordenar estados binarios de menor a mayor (ej: "00", "01", "10", "11")
        entries.sort((a, b) => a[0].localeCompare(b[0]));

        entries.forEach(([state, prob]) => {
            const percentage = (prob * 100).toFixed(2);
            
            // Contenedor general de la barra
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';

            // Etiqueta del estado (ej: |011>)
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.innerText = `|${state}⟩`;

            // Pista de fondo de la barra
            const track = document.createElement('div');
            track.className = 'bar-track';

            // Relleno animado
            const fill = document.createElement('div');
            fill.className = 'bar-fill';
            
            // Usamos un pequeño timeout para forzar la transición CSS
            setTimeout(() => {
                fill.style.width = `${percentage}%`;
            }, 50);

            // Texto con porcentaje
            const value = document.createElement('div');
            value.className = 'bar-value';
            value.innerText = `${percentage}%`;

            // Armar piezas
            track.appendChild(fill);
            barContainer.appendChild(label);
            barContainer.appendChild(track);
            barContainer.appendChild(value);

            // Inyectar al DOM
            this.container.appendChild(barContainer);
        });
    }

    /**
     * Resetea la vista a su estado inicial.
     */
    reset() {
        this.container.innerHTML = '<p style="color: #88c0d0;">Aún no se ha simulado. Agrega compuertas y presiona "Simular y Medir".</p>';
    }

    /**
     * Dibuja una Esfera de Bloch isométrica en un elemento <canvas>
     * @param {string} canvasId - El id del canvas
     * @param {Object} blochVector - Objeto con {x, y, z}
     */
    renderBlochSphere(canvasId, blochVector) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2 - 25; // Margen dinámico
        const cx = width / 2;
        const cy = height / 2;

        ctx.clearRect(0, 0, width, height);

        // 1. Dibujar el contorno de la Esfera
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 2. Dibujar el Ecuador (elipse)
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * 0.35, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // Proyección Isométrica Básica para pasar de 3D a 2D
        // Eje Z (Arriba/Abajo) | Eje Y (Derecha/Izquierda) | Eje X (Profundidad/Diagonal)
        const project = (x, y, z) => {
            const px = cx + (y * radius) - (x * radius * 0.4);
            const py = cy - (z * radius) + (x * radius * 0.25);
            return { px, py };
        };

        // 3. Dibujar Ejes X, Y, Z
        ctx.beginPath();
        ctx.setLineDash([4, 4]);

        // Eje Z (-1 a 1)
        let p1 = project(0, 0, -1); let p2 = project(0, 0, 1);
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);

        // Eje Y (-1 a 1)
        p1 = project(0, -1, 0); p2 = project(0, 1, 0);
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);

        // Eje X (-1 a 1)
        p1 = project(-1, 0, 0); p2 = project(1, 0, 0);
        ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);

        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // 4. Etiquetas
        ctx.fillStyle = '#88c0d0';
        ctx.font = '14px sans-serif';
        const pZ0 = project(0, 0, 1.15); // |0> Arriba
        const pZ1 = project(0, 0, -1.15); // |1> Abajo
        const pX = project(1.15, 0, 0); // Eje X
        const pY = project(0, 1.15, 0); // Eje Y

        ctx.fillText('|0⟩', pZ0.px - 8, pZ0.py);
        ctx.fillText('|1⟩', pZ1.px - 8, pZ1.py + 10);
        ctx.fillText('x', pX.px - 5, pX.py + 5);
        ctx.fillText('y', pY.px, pY.py + 5);

        // 5. Dibujar el Vector Cuántico (Statevector evaluado)
        const {x, y, z} = blochVector;
        const vProj = project(x, y, z);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vProj.px, vProj.py);
        ctx.strokeStyle = '#bf616a'; // Rojo cálido
        ctx.lineWidth = 3;
        ctx.stroke();

        // Punto final del vector
        ctx.beginPath();
        ctx.arc(vProj.px, vProj.py, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#bf616a';
        ctx.fill();
    }
}