/**
 * Módulo 2: Quantum Engine
 * Motor matemático del Statevector optimizado con bitwise.
 */
export class QuantumEngine {
    constructor() {
        this.numQubits = 0;
        this.size = 0;
        this.state = [];
    }

    /**
     * Inicializa el vector de estado en |0...0>
     * @param {number} numQubits 
     */
    initializeState(numQubits) {
        this.numQubits = numQubits;
        this.size = 1 << numQubits; // 2^n
        
        // Asumiendo que math.js está cargado globalmente (CDN en HTML)
        this.state = new Array(this.size).fill(0).map(() => math.complex(0, 0));
        
        // El estado inicial siempre es |0...0> o índice 0 con amplitud 1
        this.state[0] = math.complex(1, 0);
    }

    /**
     * Aplica la compuerta X (Pauli-X / NOT) a un qubit objetivo
     */
    applyX(target) {
        for (let i = 0; i < this.size; i++) {
            // Asegurarnos de visitar cada par de amplitudes solo una vez
            if ((i & (1 << target)) === 0) {
                let j = i | (1 << target);
                
                // Intercambio simple
                let temp = this.state[i];
                this.state[i] = this.state[j];
                this.state[j] = temp;
            }
        }
    }

    /**
     * Aplica la compuerta de Hadamard a un qubit objetivo
     */
    applyH(target) {
        const r2 = 1 / Math.SQRT2; // 1 / √2
        
        for (let i = 0; i < this.size; i++) {
            // Visitar el estado en el que el bit objetivo es 0
            if ((i & (1 << target)) === 0) {
                let j = i | (1 << target); // Mismo estado pero con bit objetivo a 1
                
                let a0 = this.state[i];
                let a1 = this.state[j];
                
                // A'_0 = (A_0 + A_1) * (1 / √2)
                let new_a0 = math.multiply(math.add(a0, a1), r2);
                
                // A'_1 = (A_0 - A_1) * (1 / √2)
                let new_a1 = math.multiply(math.subtract(a0, a1), r2);
                
                this.state[i] = new_a0;
                this.state[j] = new_a1;
            }
        }
    }

    /**
     * Aplica la compuerta CNOT usando un control y un target
     */
    applyCNOT(control, target) {
        for (let i = 0; i < this.size; i++) {
            // Iterar sobre pares donde el target es 0
            if ((i & (1 << target)) === 0) {
                // Solo si el bit de control está encendido en este estado
                if ((i & (1 << control)) !== 0) {
                    let j = i | (1 << target);
                    
                    // Intercambiar (comportamiento igual a la puerta X)
                    let temp = this.state[i];
                    this.state[i] = this.state[j];
                    this.state[j] = temp;
                }
            }
        }
    }

    /**
     * Procesa un JSON de circuito completo y retorna el Statevector final
     * @param {Object} circuit - Retorno de CircuitBuilder.getCircuit()
     */
    runCircuit(circuit) {
        this.initializeState(circuit.numQubits);

        for (const gate of circuit.gates) {
            switch (gate.type) {
                case 'H':
                    this.applyH(gate.target);
                    break;
                case 'X':
                    this.applyX(gate.target);
                    break;
                case 'CNOT':
                    this.applyCNOT(gate.control, gate.target);
                    break;
                default:
                    console.warn(`Compuerta ${gate.type} no soportada aún.`);
            }
        }

        return this.state;
    }
}