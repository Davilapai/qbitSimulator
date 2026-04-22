/**
 * Módulo 3: Measurement
 * Convierte las amplitudes complejas del vector de estado en probabilidades observables.
 */
export class Measurement {
    constructor(numQubits) {
        this.numQubits = numQubits;
    }

    /**
     * Calcula las probabilidades a partir del statevector final.
     * @param {Array} statevector - Arreglo de números complejos (math.complex)
     * @returns {Object} Diccionario con estados binarios como llaves (ej: "010") y su probabilidad
     */
    getProbabilities(statevector) {
        const results = {};
        
        statevector.forEach((complexAmp, index) => {
            // P(x) = |A_x|^2 = Re(A)^2 + Im(A)^2
            const prob = Math.pow(complexAmp.re, 2) + Math.pow(complexAmp.im, 2);
            
            // Filtrar números muy cercanos a cero debido a imprecisión de floats
            if (prob > 0.0001) {
                // Convertir el índice a cadena binaria de longitud `numQubits`
                // binStr representa el estado de los qubits |Q_n ... Q_1 Q_0>
                const binStr = index.toString(2).padStart(this.numQubits, '0');
                results[binStr] = prob;
            }
        });

        return results;
    }

    /**
     * Calcula las coordenadas vectoriales (x, y, z) de la esfera de Bloch
     * para un solo qubit (Matriz de densidad reducida).
     */
    getBlochVector(statevector, targetQubit) {
        let x = 0, y = 0, z = 0;
        
        for (let i = 0; i < statevector.length; i++) {
            let prob = Math.pow(statevector[i].re, 2) + Math.pow(statevector[i].im, 2);
            
            // Evaluamos si el bit num `targetQubit` es 0 o 1
            if ((i & (1 << targetQubit)) === 0) {
                z += prob; // Amplitudes donde qubit es |0> suman a Z
                
                let j = i | (1 << targetQubit); // El índice hermano donde el qubit es |1>
                
                // Extraer parte real e imaginaria del estado i y j
                let re1 = statevector[i].re, im1 = statevector[i].im;
                let re2 = statevector[j].re, im2 = statevector[j].im;
                
                // x = 2 * Re(A_i^* * A_j)
                x += 2 * (re1 * re2 + im1 * im2);
                
                // y = 2 * Im(A_i^* * A_j)
                y += 2 * (re1 * im2 - re2 * im1);
            } else {
                z -= prob; // Amplitudes donde qubit es |1> restan a Z
            }
        }
        
        return { x, y, z };
    }
}