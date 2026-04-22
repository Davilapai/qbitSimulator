import { CircuitBuilder } from './circuit.js';
import { QuantumEngine } from './engine.js';
import { Measurement } from './measure.js';
import { Visualizer } from './visualizer.js';

// Variables Globales
let NUM_QUBITS = parseInt(document.getElementById('num-qubits-select').value) || 3;
let circuitBuilder = new CircuitBuilder(NUM_QUBITS);
let stepCounter = 0;

// Referencias del DOM
const gridDiv = document.getElementById('grid');
const visualizer = new Visualizer('histogram');

// --- 1. RENDERIZADO DEL CIRCUITO (UI Básica Día 3) ---
function renderCircuitUI() {
    gridDiv.innerHTML = ''; // Limpiar
    
    // Crear líneas por cada qubit
    for (let i = 0; i < NUM_QUBITS; i++) {
        const wire = document.createElement('div');
        wire.className = 'qubit-wire';
        
        const label = document.createElement('div');
        label.className = 'qubit-label';
        label.innerText = `|q${i}⟩`;
        
        const line = document.createElement('div');
        line.className = 'wire-line';
        line.id = `wire-${i}`;
        
        wire.appendChild(label);
        wire.appendChild(line);
        gridDiv.appendChild(wire);
    }

    // Dibujar las compuertas en sus respectivas líneas
    const circuitDef = circuitBuilder.getCircuit();
    circuitDef.gates.forEach(gate => {
        if (gate.type === 'H' || gate.type === 'X') {
            const line = document.getElementById(`wire-${gate.target}`);
            const gateDiv = document.createElement('div');
            gateDiv.className = 'gate-box';
            gateDiv.innerText = gate.type;
            line.appendChild(gateDiv);
        } else if (gate.type === 'CNOT') {
            // Render simplificado: Bloque CNOT en target, punto en control
            const lineTarget = document.getElementById(`wire-${gate.target}`);
            const tDiv = document.createElement('div');
            tDiv.className = 'gate-box';
            tDiv.style.backgroundColor = '#ebcb8b'; // Diferente color
            tDiv.innerText = 'CX';
            lineTarget.appendChild(tDiv);

            const lineControl = document.getElementById(`wire-${gate.control}`);
            const cDiv = document.createElement('div');
            cDiv.className = 'gate-cnot-control';
            lineControl.appendChild(cDiv);
        }
    });
}

// --- 2. LÓGICA DE BOTONES (Event Listeners) ---
document.getElementById('btn-h').addEventListener('click', () => {
    const target = parseInt(document.getElementById('qubit-target').value);
    circuitBuilder.addGate('H', target, stepCounter++);
    renderCircuitUI();
});

document.getElementById('btn-x').addEventListener('click', () => {
    const target = parseInt(document.getElementById('qubit-target').value);
    circuitBuilder.addGate('X', target, stepCounter++);
    renderCircuitUI();
});

document.getElementById('btn-cnot').addEventListener('click', () => {
    const target = parseInt(document.getElementById('qubit-target').value);
    const control = parseInt(document.getElementById('qubit-control').value);
    try {
        circuitBuilder.addGate('CNOT', target, stepCounter++, control);
        renderCircuitUI();
    } catch(e) {
        alert(e.message);
    }
});

document.getElementById('btn-clear').addEventListener('click', () => {
    circuitBuilder = new CircuitBuilder(NUM_QUBITS);
    stepCounter = 0;
    visualizer.reset();
    renderCircuitUI();
});

// Listener para el selector de Qubits
document.getElementById('num-qubits-select').addEventListener('change', (e) => {
    NUM_QUBITS = parseInt(e.target.value);
    // Reiniciar circuito al cambiar qubits
    circuitBuilder = new CircuitBuilder(NUM_QUBITS);
    stepCounter = 0;
    visualizer.reset();
    renderCircuitUI();
});

// --- 3. SIMULACIÓN Y MEDICIÓN ---
function executeSimulation() {
    const circuitData = circuitBuilder.getCircuit();
    
    // Motor Cuántico
    const engine = new QuantumEngine();
    const finalState = engine.runCircuit(circuitData);
    
    // Medición (Probabilidades Globales)
    const measure = new Measurement(circuitData.numQubits);
    const probabilities = measure.getProbabilities(finalState);
    
    // Visualizador HTML con gráficos de barra nativos
    visualizer.renderHistogram(probabilities);

    // Extraer Esfera de Bloch del Qubit seleccionado
    const targetBlochQubit = parseInt(document.getElementById('bloch-qubit-select').value);
    const blochVector = measure.getBlochVector(finalState, targetBlochQubit);
    
    // Actualizar coords de texto
    const coordsDiv = document.getElementById('bloch-coords');
    coordsDiv.innerHTML = `x: ${blochVector.x.toFixed(3)}<br>y: ${blochVector.y.toFixed(3)}<br>z: ${blochVector.z.toFixed(3)}`;

    // Renderizar Esfera de Bloch
    visualizer.renderBlochSphere('bloch-canvas', blochVector);
}

document.getElementById('btn-simulate').addEventListener('click', executeSimulation);

// Re-renderizar la esfera si el usuario cambia el qubit objetivo
document.getElementById('bloch-qubit-select').addEventListener('change', () => {
    if (circuitBuilder.gates.length > 0) {
        executeSimulation();
    } else {
        // Renderizar un vector |0> por defecto si no hay compuertas
        visualizer.renderBlochSphere('bloch-canvas', {x: 0, y: 0, z: 1});
    }
});

// Inicializar UI Vacía
renderCircuitUI();
// Para que la esfera nazca renderizada en el estado |0>
visualizer.renderBlochSphere('bloch-canvas', {x: 0, y: 0, z: 1});

console.log("🚀 Q-bit App Inicializada (Día 4 + Bloch Sphere Completos)");