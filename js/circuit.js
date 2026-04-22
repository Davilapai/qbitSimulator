/**
 * Módulo 1: Circuit Builder
 * Responsabilidad: Gestionar el estado lógico del circuito interactivo.
 */

export class CircuitBuilder {
    constructor(numQubits = 3) {
        if (numQubits > 8) {
            throw new Error("El simulador soporta un máximo de 8 qubits.");
        }
        this.numQubits = numQubits;
        this.gates = []; // Partitura temporal de compuertas
    }

    /**
     * Agrega una compuerta al circuito.
     */
    addGate(type, target, step, control = null) {
        // Validaciones básicas de integridad
        if (target < 0 || target >= this.numQubits) {
            throw new Error(`Target qubit ${target} fuera de los límites (0 a ${this.numQubits - 1}).`);
        }
        if (control !== null) {
            if (control < 0 || control >= this.numQubits) {
                throw new Error(`Control qubit ${control} fuera de los límites.`);
            }
            if (control === target) {
                throw new Error("El qubit de control no puede ser el mismo que el target.");
            }
        }

        const gate = { type, target, step };
        if (control !== null) {
            gate.control = control;
        }

        this.gates.push(gate);
        
        // Mantener las compuertas siempre ordenadas por step de tiempo
        this.gates.sort((a, b) => a.step - b.step);
    }

    /**
     * Elimina una compuerta específica.
     */
    removeGate(type, target, step) {
        this.gates = this.gates.filter(g => 
            !(g.type === type && g.target === target && g.step === step)
        );
    }

    /**
     * Devuelve el estado actual del circuito (Structure Data).
     */
    getCircuit() {
        return {
            numQubits: this.numQubits,
            // Retorna una copia para inmutabilidad básica
            gates: [...this.gates] 
        };
    }
}

/**
 * Función de test temporal para el Día 1.
 */
export function runDay1Tests() {
    console.log("🧪 Iniciando Tests de Circuit Builder (Día 1)...");
    try {
        const builder = new CircuitBuilder(3);
        
        builder.addGate('H', 0, 0); // Hadamard en qubit 0, step 0
        builder.addGate('X', 1, 0); // NOT en qubit 1, step 0
        builder.addGate('CNOT', 1, 1, 0); // CNOT control=0, target=1, step 1
        
        let circuit = builder.getCircuit();
        console.assert(circuit.gates.length === 3, "Debería tener 3 compuertas");
        console.assert(circuit.gates[2].type === 'CNOT', "La última compuerta debe ser CNOT");
        
        console.log("✅ Agregar compuertas funciona. Estado:", circuit);

        builder.removeGate('X', 1, 0);
        circuit = builder.getCircuit();
        console.assert(circuit.gates.length === 2, "Debería tener 2 compuertas tras remover una");
        
        console.log("✅ Remover compuerta funciona. Estado final:", circuit);
        console.log("🎉 Test de circuito exitoso.");

    } catch (error) {
        console.error("❌ Fallo en los tests: ", error);
    }
}