```md
# 🧠 Plan de Implementación Detallado — Simulador Cuántico (8 Qubits, Web)

## 🎯 Objetivo
Construir un simulador interactivo de circuitos cuánticos que:
- Soporte hasta **8 qubits** (limitación intencional para rendimiento frontend, $2^8 = 256$ estados).
- Ejecute **100% en el navegador (sin backend)**.
- Permita la creación de circuitos mediante:
  - Inserción de compuertas de 1 qubit (H, X).
  - Inserción de compuertas de 2 qubits (CNOT).
  - Cálculo de la evolución del estado cuántico (Statevector).
  - Visualización de las probabilidades de medición.
- Esté optimizado para publicarse en **GitHub Pages**.

---

## 🧩 Stack Tecnológico
- **Lenguaje:** Vanilla JavaScript (ES6+ con ES Modules).
- **Interfaz (UI):** HTML5 + CSS3 (CSS Grid para el layout del circuito cuántico).
- **Cálculo Matemático:** `math.js` (exclusivo para facilitar operaciones con números complejos).
- **Despliegue:** GitHub Pages (archivos estáticos).
- **Librería de Gráficos (Opcional para Día 4):** Chart.js para el histograma de probabilidades.

---

## 🏗️ Arquitectura y Estructura de Archivos

Una arquitectura modular desacoplada:

```text
/q-bit
│
├── index.html            # Interfaz principal (Grid del circuito y paneles)
├── css/
│   └── style.css         # Estilos y variables CSS
├── js/
│   ├── app.js            # Orquestador central (Event Loop y DOM binding)
│   ├── circuit.js        # Modulo 1: Circuit Builder (Estado de la UI interactiva)
│   ├── engine.js         # Modulo 2: Quantum Engine (Núcleo de simulación)
│   ├── measure.js        # Modulo 3: Measurement (Extracción de probabilidades)
│   └── visualizer.js     # Modulo 4: Visualizer (Render de resultados y DOM)
└── README.md             # Documentación del proyecto
```

---

## 🧠 Definición de Módulos

### 1. Circuit Builder (`circuit.js`)
**Maneja el estado lógico del circuito interactivo.**
- **Estructura Interna:** Una clase que guarda número de qubits y la "partitura" temporal de compuertas.
- **Formato Estricto:**
  ```json
  {
    "numQubits": 3,
    "gates": [
      { "type": "H", "target": 0, "step": 0 },
      { "type": "X", "target": 1, "step": 0 },
      { "type": "CNOT", "control": 0, "target": 1, "step": 1 }
    ]
  }
  ```

### 2. Quantum Engine (`engine.js`)
**Motor matemático del Statevector.**
- **Inicialización:** Array lineal de tamaño $N = 2^n$. El estado inicial `|0...0>` tiene el índice `0` con amplitud `1 + 0i`, y el resto en `0`.
- **Estrategia Algorítmica (Bitwise):** 
  *Para evitar matrices de $2^n \times 2^n$ en memoria, aplicaremos operaciones directas sobre el vector iterando estados emparejados por el bit "target".*
  - **Puerta X (NOT):** Para cada estado, si el bit en la posición `target` es 0, intercambia su amplitud con el estado donde el bit es 1.
  - **Puerta H (Hadamard):** Para cada par de estados (diferenciados solo por el bit `target`):
    $$A'_{0} = \frac{A_0 + A_1}{\sqrt{2}}$$
    $$A'_{1} = \frac{A_0 - A_1}{\sqrt{2}}$$
  - **Puerta CNOT:** Iterar sobre los estados; si el bit correspondiente al qubit `control` es 1, aplicar la regla de intercambio de amplitudes del bit `target` (comportamiento de la compuerta X).

### 3. Measurement (`measure.js`)
**Conversor de estado cuántico a datos observables.**
- **Cálculo:** Iterar el Statevector final. Para cada índice binario, la probabilidad es la magnitud al cuadrado del número complejo: $P(x) = (\text{Re}(A_x))^2 + (\text{Im}(A_x))^2$.
- **Filtrado:** Emitir solo estados con probabilidad $> 0.0001$ para limpiar la UI de errores de flotantes.

### 4. Visualizer (`visualizer.js`)
**Capa de inyección DOM y gráficos.**
- Renderizar los cables del circuito en CSS Grid.
- Manejar drag-and-drop o botones de click para poner compuertas en el `step` correcto.
- Pintar el Histograma interactivo con las probabilidades obtenidas.

---

## 🚀 Plan de Desarrollo Diario (Roadmap)

### Día 1: Core Base y Estructura
- [ ] Configurar el repositorio y la estructura estática (`index.html`, carpetas de `js`, e importar `math.js`).
- [ ] Construir `circuit.js` garantizando metodos `addGate()`, `removeGate()`, `getCircuit()`.
- [ ] Escribir test unitarios básicos / comprobaciones de consola para asegurar el formato JSON correcto.

### Día 2: Motor Cuántico y Lógica Matemática
- [ ] Construir `engine.js` y la función `initializeState(numQubits)`.
- [ ] Implementar el operador bit a bit para la compuerta **X** e iterador de estados.
- [ ] Implementar el operador matemático para la compuerta **H** ($1/\sqrt{2}$).
- [ ] Implementar la lógica condicional de pares para la compuerta **CNOT**.

### Día 3: Interfaz de Usuario (UI) y Medición
- [ ] Escribir `measure.js` (procesar amplitudes a `P(x)` y formato binario, ej. `010`).
- [ ] Diseño CSS Grid de los qubits (las líneas horizontales).
- [ ] Lógica simple en `app.js` para que al pulsar un botón "Agregar H al Qubit 0", se actualice `circuit.js` e invoque a `engine.js`.

### Día 4: Visualización e Integración
- [ ] Integrar un histograma rudimentario (HTML puro con `div` anchuras o Chart.js).
- [ ] Refinar UI: Botón para reiniciar circuito, inputs para seleccionar número de qubits.
- [ ] Configurar GitHub Actions o usar la rama principal para hacer el Deploy a **GitHub Pages**.

---

## ⚠️ Restricciones y Reglas Estrictas
1. **Límite de Qubits:** Máximo 8 (previene crash del navegador por bucles asíncronos en vanilla JS).
2. **Optimizacion:** NO crear NUNCA matrices 2D que representen al operador completo global del sistema. Siempre usar bucles 1D que evalúen los bits via operadores binarios (`i & (1 << target)`).
3. **Dependencias:** Minimizar descargas. Si `math.js` es excesivo, escribir una clase `ComplexNumber` propia para sumar, restar y multiplicar (súper recomendado para velocidad).

---

## 💡 Mejoras Opcionales Futuras
- **Ejecución Asíncrona:** Si se aumenta a >10 qubits, usar Web Workers para que la UI no se congele durante los reemplazos del array.
- **Q-Sphere / Bloch Sphere:** Visualización tridimensional nativa del estado de los qubits individuales.
- **Exportación:** Un botón para descargar la sesión completa de JSON de `circuit.js`.
- **Otras compuertas:** Z, Y, S, T, Toffoli, SWAP.
