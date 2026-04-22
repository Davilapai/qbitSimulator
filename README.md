# 🪐 Q-bit: Simulador Cuántico Web

Q-bit es un simulador interactivo de circuitos cuánticos que se ejecuta **100% en el navegador**. Está diseñado para ser rápido, educativo y sin dependencias de backend, soportando la simulación matemática completa de hasta 8 qubits mediante operaciones a nivel de bits (bitwise).

---

## 🚀 Instalación y Despliegue

¡No requiere instalación! Al ser una aplicación construida con HTML, CSS y Vanilla JS (ES6+), simplemente necesitas abrir el archivo principal:

1. Clona o descarga este repositorio.
2. Haz doble clic en el archivo `index.html` para abrirlo en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
3. (Opcional) Sube los archivos a GitHub Pages para compartir el simulador públicamente.

---

## 📖 Manual de Uso

El simulador está dividido visualmente en tres áreas principales: **Circuito**, **Controles** y **Resultados** (incluyendo la Esfera de Bloch).

### 1. Configurar el tamaño del circuito
En la sección superior derecha de "Circuito", encontrarás el campo **"Número de Qubits"**.
- Puedes seleccionar desde **1 hasta 8 qubits**.
- *Nota:* Si cambias este valor, el circuito actual se reiniciará para adaptar el lienzo.

### 2. Agregar Compuertas Cuánticas
Dirígete a la sección de **Controles** para armar tu circuito. Actualmente se soportan tres compuertas fundamentales:

*   **H (Hadamard):** Crea una superposición cuántica. Convierte un estado `|0⟩` en una probabilidad del 50/50 entre `|0⟩` y `|1⟩`.
    *   *Uso:* Escribe el número del qubit en "Qubit Objetivo" y presiona el botón **H**.
*   **X (NOT):** Invierte el estado del qubit (de `|0⟩` a `|1⟩` o viceversa).
    *   *Uso:* Escribe el número del qubit en "Qubit Objetivo" y presiona el botón **X**.
*   **CNOT (NOT Controlado):** Aplica una compuerta X al "Target" **solo si** el qubit "Control" está en estado `|1⟩`. Entrelaza qubits.
    *   *Uso:* Escribe el objetivo en "Qubit Objetivo", el control en "Qubit Control" y presiona **CNOT**.

### 3. Simular y Medir
A diferencia de los circuitos lógicos tradicionales, la simulación cuántica se evalúa al final del proceso.
- Una vez que hayas construido tu partitura de compuertas visuales, presiona el botón verde **"Simular y Medir"**.
- En la sección inferior aparecerá un **Histograma** de barras mostrando las probabilidades probabilísticas de que el sistema colapse en cada estado posible (ej. `|010⟩ 100%`, o `|00⟩ 50%` y `|11⟩ 50%`).

### 4. Inspeccionar la Esfera de Bloch
La **Esfera de Bloch** permite visualizar geométricamente el estado de un solo qubit.
- Cambia el número en **"Inspeccionar Qubit"** para ver cómo las compuertas han rotado el vector vectorial de ese qubit en específico a través de los ejes X, Y y Z.
- **Entrelazamiento (Advertencia):** Si un qubit está fuertemente entrelazado con otros (por ejemplo, tras usar una CNOT en un estado de superposición), su vector en la esfera de Bloch se encogerá hacia el origen `(0,0,0)`. Esto ocurre porque pierde su estado puro individual y se convierte en un *estado mixto*.

---

## 🧪 Ejemplo Práctico: Crear un Estado de Bell (Entrelazamiento)

Sigue estos pasos para crear el entrelazamiento cuántico más famoso:

1. Asegúrate de tener al menos **2 Qubits** seleccionados en el panel superior.
2. En controles, pon "Qubit Objetivo" en `0` y presiona **H (Hadamard)**.
3. Ahora, pon "Qubit Objetivo" en `1` y "Qubit Control" en `0`. Presiona **CNOT**.
4. Verás en el diagrama visual cómo la puerta H está en la línea superior y la CNOT conecta ambas líneas.
5. Presiona **Simular y Medir**.
6. **Resultado esperado:** El histograma mostrará aproximadamente `50%` para el estado `|00⟩` y `50%` para el estado `|11⟩`. ¡Has entrelazado exitosamente los qubits!

---

## 🛠️ Stack Tecnológico
*   **Interfaz:** HTML5, CSS3 (CSS Grid).
*   **Lógica y Motor Cuántico:** Vanilla JavaScript (ES Modules).
*   **Matemáticas:** `math.js` (solo para cálculos precisos con números complejos).
*   **Renderizado de la Esfera:** `HTML5 Canvas` (Proyección Isométrica de 3D a 2D matemática).