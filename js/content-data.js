/**
 * Aprendiendo MATLAB para análisis estructural
 * Base de Datos Didáctica y Contenido de Lecciones
 */

const COURSE_DATA = {
  title: "Aprendiendo MATLAB para análisis estructural",
  subtitle: "Método de Rigidez y Álgebra Matricial Aplicada a la Ingeniería Civil",
  philosophy: "El código debe contar el método, no esconderlo.",
  
  // Roadmap general de los 10 Módulos
  modules: [
    {
      id: "mod-1",
      number: 1,
      title: "Primer contacto con MATLAB",
      summary: "Interfaz básica, Command Window, Workspace, Editor, scripts, variables y comandos clc, clear y format.",
      status: "ready", // ready, in-progress, upcoming
      lessons: [
        {
          id: "les-1-1",
          number: "1.1",
          title: "El entorno de trabajo: Command Window, Workspace y Editor",
          objective: "Comprender la función de cada panel del entorno de MATLAB y la diferencia fundamental entre ejecutar instrucciones interactivas en la consola y estructurar scripts reproducibles.",
          theory: `MATLAB (abreviatura de <em>Matrix Laboratory</em>) es un entorno computacional diseñado primordialmente para operar con matrices y vectores numéricos. Para un ingeniero civil, MATLAB no es un simple lenguaje de programación, sino una pizarra de cálculo matricial interactiva donde se reproducen rigurosamente los métodos de la mecánica estructural.

El entorno se compone principalmente de tres áreas de trabajo:
1. <strong>Command Window (Ventana de Comandos):</strong> Espacio de ejecución inmediata. Se utiliza para ensayar operaciones rápidas o inspeccionar variables.
2. <strong>Workspace (Espacio de Trabajo):</strong> Registro en memoria de todas las variables, vectores y matrices creadas durante la sesión, indicando su nombre, tamaño y valor.
3. <strong>Editor de Scripts (.m):</strong> Panel donde se redactan secuencias ordenadas y documentadas de instrucciones. En análisis estructural, todo cálculo formal debe almacenarse en un archivo <code>.m</code> para garantizar trazabilidad y reproducibilidad.`,
          math: `\\text{Entorno de cálculo:} \\quad \\text{Entrada (Script / Consola)} \\longrightarrow \\text{Evaluación Matricial} \\longrightarrow \\text{Salida (Workspace)}`,
          glossary: [
            { var: "Command Window", desc: "Consola interactiva para evaluar sentencias directas mediante el prompt >>." },
            { var: "Workspace", desc: "Tabla de memoria con las variables activas y sus dimensiones matriciales." },
            { var: "Editor (.m)", desc: "Entorno para escribir programas y rutinas completas de análisis estructural." }
          ],
          code: `% =========================================================================
% PROYECTO: APRENDIENDO MATLAB PARA ANÁLISIS ESTRUCTURAL
% Lección 1.1: Asignación básica de propiedades mecánicas
% =========================================================================

% Definición del módulo de elasticidad del acero estructural (en kN/m^2)
E = 200e6; 

% Área de la sección transversal de una barra (en m^2)
A = 0.0045; 

% Rigidez axial de la barra (producto E*A en kN)
EA = E * A`,
          lineByLine: [
            { code: "E = 200e6;", desc: "Crea la variable escalar 'E' asignándole el valor 200×10⁶ (notación científica para 200 GPa expresados en kN/m²). El punto y coma final suprime la impresión en la consola." },
            { code: "A = 0.0045;", desc: "Crea la variable escalar 'A' con valor 0.0045 m² (equivalente a 45 cm²). El punto y coma mantiene limpio el Command Window." },
            { code: "EA = E * A", desc: "Calcula el producto escalar de rigidez axial. Al omitir el punto y coma final, MATLAB imprime inmediatamente el valor calculado en la consola." }
          ],
          output: `EA =
      900000`,
          interpretation: "El resultado obtenido muestra que la rigidez axial calculada para el elemento estructural es de 900,000 kN. Este término escalar (EA) constituye el factor de escala fundamental en la matriz de rigidez elemental de barras sometidas a solicitación axial.",
          frequentError: {
            title: "Omisión accidental del punto y coma (;)",
            desc: "En matrices de gran tamaño (como la matriz global de rigidez K de cientos de grados de libertad), olvidar el punto y coma provocará que MATLAB imprima miles de números en la consola, ralentizando la ejecución. Utiliza ';' al final de cada asignación salvo cuando desees verificar intencionalmente un resultado."
          },
          guidedExercise: {
            title: "Ejercicio Guiado: Cálculo del producto de inercia flexionante (E·I)",
            prompt: "Dada una viga de concreto con módulo de elasticidad E = 25×10⁶ kN/m² y momento de inercia I = 0.0012 m⁴, define el script para calcular la rigidez a flexión EI.",
            solutionCode: `E = 25e6;\nI = 0.0012;\nEI = E * I`
          },
          interactiveExercise: {
            id: "ex-1-1",
            type: "code-fill",
            badge: "Completar instrucción",
            prompt: "Escribe la instrucción en MATLAB para calcular la longitud L de un elemento dividiendo el volumen Vol entre el área A, sin imprimir el resultado en pantalla.",
            expectedAnswer: "L = Vol / A;",
            placeholder: "Escribe la instrucción exacta aquí...",
            hint: "Recuerda asignar a la variable 'L', usar el operador de división '/' y finalizar con ';' para suprimir la salida.",
            solution: "L = Vol / A;"
          },
          quiz: {
            question: "¿Qué ocurre en MATLAB cuando finalizas una línea de código con punto y coma (;)?",
            options: [
              "La variable se elimina del Workspace inmediatamente.",
              "La instrucción se ejecuta correctamente pero se suprime su impresión en el Command Window.",
              "Se genera un error de sintaxis.",
              "MATLAB guarda la variable en el disco duro."
            ],
            correctIndex: 1,
            explanation: "El punto y coma en MATLAB evalúa y almacena la instrucción en el Workspace, pero oculta la salida en la consola para mantener limpia la interfaz."
          }
        },
        {
          id: "les-1-2",
          number: "1.2",
          title: "Gestión de memoria y formato: clc, clear y format",
          objective: "Dominar los comandos fundamentales de limpieza y configuración numérica (clc, clear, format) para garantizar que los cálculos estructurales comiencen sin contaminación de datos previos.",
          theory: `En el cálculo estructural automatizado, uno de los errores más graves y difíciles de detectar es la <strong>contaminación de variables residuales</strong>. Si ejecutas un script para una estructura de 4 nodos habiendo corrido previamente una de 6 nodos, variables antiguas como matrices de rigidez o vectores de fuerzas residuales pueden permanecer en memoria alterando los resultados.

Por ello, todo script riguroso de cálculo estructural debe iniciar siempre con:
- <code>clear</code>: Borra todas las variables del Workspace (libera la memoria RAM).
- <code>clc</code>: Limpia el texto visible del Command Window (pantalla limpia).
- <code>close all</code>: Cierra ventanas de figuras gráficas abiertas previamente.
- <code>format short / long / shortEng</code>: Establece cómo se visualizan los valores decimales en consola sin alterar la precisión interna real (doble precisión IEEE 754 de 64 bits).`,
          math: `\\text{Inicio de Script Seguro:} \\quad \\begin{cases} \\mathbf{clear} & \\rightarrow \\text{Workspace vacío } (\\emptyset) \\\\ \\mathbf{clc} & \\rightarrow \\text{Consola despejada} \\\\ \\mathbf{format} & \\rightarrow \\text{Representación numérica controlada} \\end{cases}`,
          glossary: [
            { var: "clear", desc: "Comando que borra todas las variables almacenadas en el Workspace." },
            { var: "clc", desc: "Command Window Clear: limpia la pantalla visual sin borrar variables de memoria." },
            { var: "format long", desc: "Configura la visualización a 15 dígitos decimales (ideal para chequear desplazamientos pequeños)." },
            { var: "format shortEng", desc: "Visualización en notación de ingeniería con exponentes múltiplos de 3." }
          ],
          code: `% =========================================================================
% CABECERA ESTÁNDAR PARA CÁLCULO ESTRUCTURAL
% =========================================================================
clear;      % Elimina cualquier variable previa de la memoria
clc;        % Limpia el Command Window
close all;  % Cierra figuras o diagramas previos

% Configuración de visualización para desplazamientos estructurales
format long;

% Ejemplo de desplazamiento nodal pequeño calculado (en metros)
u_nodo = 0.000124857391845;

% Mostrar desplazamiento en pantalla
u_nodo`,
          lineByLine: [
            { code: "clear;", desc: "Borra completamente la memoria activa, evitando que datos de modelos anteriores contaminen el análisis actual." },
            { code: "clc;", desc: "Limpia la ventana de comandos para facilitar la lectura del nuevo cálculo." },
            { code: "close all;", desc: "Cierra cualquier gráfico anterior de armaduras o pórticos." },
            { code: "format long;", desc: "Indica a MATLAB que muestre 15 cifras significativas, vital para verificar desplazamientos nodales del orden de milímetros o fracciones de milímetro." },
            { code: "u_nodo", desc: "Muestra el valor con la precisión expandida." }
          ],
          output: `u_nodo =
     0.000124857391845`,
          interpretation: "Al usar 'format long', podemos visualizar con exactitud desplazamientos milimétricos (0.1248 mm) sin que MATLAB los redondee prematuramente a cero en pantalla (como haría format short con valores muy pequeños). La precisión interna siempre se conserva exacta.",
          frequentError: {
            title: "Confundir 'clc' con 'clear'",
            desc: "Ejecutar 'clc' solo limpia la pantalla; las variables continúan vivas en el Workspace. Si confías en que 'clc' reinició tu modelo, estarás trabajando con datos residuales. Usa siempre 'clear; clc;'."
          },
          guidedExercise: {
            title: "Ejercicio Guiado: Configuración de cabecera de proyecto",
            prompt: "Escribe las 3 líneas obligatorias que deben colocarse al inicio de un script de análisis estructural para garantizar un entorno limpio.",
            solutionCode: `clear;\nclc;\nclose all;`
          },
          interactiveExercise: {
            id: "ex-1-2",
            type: "prediction",
            badge: "Predicción de Estado",
            prompt: "Si en el Workspace existe la variable K = [100 20; 20 50] y ejecutas únicamente el comando 'clc', ¿cuál será el valor de K en memoria?",
            options: [
              "K será eliminada y el Workspace quedará vacío.",
              "K mantendrá exactamente su matriz [100 20; 20 50] en memoria.",
              "K se convertirá en una matriz de ceros.",
              "MATLAB arrojará un error de comando no reconocido."
            ],
            correctIndex: 1,
            hint: "Recuerda que 'clc' solo afecta a la vista de la consola, no a la memoria RAM.",
            solution: "La opción correcta es la 2: K permanece intacta en el Workspace porque 'clc' solo limpia la pantalla visual."
          },
          quiz: {
            question: "¿Por qué el comando 'format long' es especialmente útil en Análisis Matricial de Estructuras?",
            options: [
              "Porque acelera el cálculo del producto de matrices.",
              "Porque permite inspeccionar desplazamientos nodales muy pequeños (del orden de 10⁻⁴ m) sin redondeos visuales excesivos.",
              "Porque aumenta la memoria RAM disponible.",
              "Porque convierte automáticamente las unidades de metros a milímetros."
            ],
            correctIndex: 1,
            explanation: "En estructuras civiles los desplazamientos suelen ser fracciones de milímetro. 'format long' permite visualizar todas las cifras decimales calculadas."
          }
        }
      ]
    },
    {
      id: "mod-2",
      number: 2,
      title: "Escalares, vectores y matrices",
      summary: "Creación de vectores fila y columna, matrices, modificación de componentes, zeros, ones, eye, size y length en contexto de fuerzas y coordenadas.",
      status: "ready",
      lessons: [
        {
          id: "les-2-1",
          number: "2.1",
          title: "Vectores de fuerzas y desplazamientos: vectores fila vs columna",
          objective: "Diferenciar con precisión conceptual y sintáctica entre vectores fila y columna en MATLAB, comprendiendo su correspondencia con vectores de fuerzas nodales F y desplazamientos U.",
          theory: `En el Análisis Matricial de Estructuras, el álgebra lineal exige estricta coherencia dimensional. La ecuación fundamental de equilibrio estático:
$$\\mathbf{K} \\cdot \\mathbf{U} = \\mathbf{F}$$
requiere que, si la matriz global de rigidez $\\mathbf{K}$ tiene dimensiones $n \\times n$, el vector de desplazamientos $\\mathbf{U}$ y el vector de fuerzas aplicadas $\\mathbf{F}$ deben ser rigurosamente <strong>vectores columna</strong> de dimensiones $n \\times 1$.

En MATLAB:
- Los elementos de un <strong>vector fila</strong> se separan por espacios o comas: <code>[10, 20, -50]</code> o <code>[10 20 -50]</code> (dimensión $1 \\times 3$).
- Los elementos de un <strong>vector columna</strong> se separan por punto y coma: <code>[10; 20; -50]</code> (dimensión $3 \\times 1$).
- El operador apóstrofe <code>'</code> calcula la <strong>transpuesta</strong>, convirtiendo un vector fila en columna o viceversa.`,
          math: `\\mathbf{F}_{\\text{columna}} = \\begin{Bmatrix} F_{x1} \\\\ F_{y1} \\\\ F_{x2} \\\\ F_{y2} \\end{Bmatrix}_{4 \\times 1} \\quad \\Longleftrightarrow \\quad \\mathbf{F} = [F_{x1}; \\; F_{y1}; \\; F_{x2}; \\; F_{y2}]`,
          glossary: [
            { var: "F", desc: "Vector global de fuerzas aplicadas en los grados de libertad de la estructura (n × 1)." },
            { var: "U", desc: "Vector global de desplazamientos nodales incógnita (n × 1)." },
            { var: "size(A)", desc: "Función que devuelve el número de filas y columnas de una matriz o vector: [filas, columnas]." },
            { var: "length(v)", desc: "Función que devuelve la dimensión máxima o número total de componentes de un vector." }
          ],
          code: `% =========================================================================
% DEFINICIÓN DE VECTORES DE FUERZAS Y DESPLAZAMIENTOS
% =========================================================================
clear; clc;

% Vector de fuerzas en 4 grados de libertad (2 nodos en 2D)
% Grado 1 (Fx1 = 0), Grado 2 (Fy1 = -50 kN), Grado 3 (Fx2 = 20 kN), Grado 4 (Fy2 = 0)
F = [0; -50; 20; 0];

% Verificar dimensiones del vector de fuerzas
[filas_F, cols_F] = size(F);

% Vector de desplazamientos nodales conocidos (en metros)
U = [0.000; 0.000; 0.0015; -0.0032];

% Número total de grados de libertad del modelo
num_gdl = length(F);

% Mostrar resultados
F
fprintf('Dimensiones del vector F: %d filas x %d columna\\n', filas_F, cols_F);
fprintf('Total de grados de libertad: %d\\n', num_gdl);`,
          lineByLine: [
            { code: "F = [0; -50; 20; 0];", desc: "Construye un vector columna de 4 filas y 1 columna. Cada punto y coma ';' cambia a la siguiente fila (siguiente grado de libertad)." },
            { code: "[filas_F, cols_F] = size(F);", desc: "Extrae el tamaño exacto: filas_F = 4, cols_F = 1. Confirma que es un vector columna listo para multiplicarse por la matriz K." },
            { code: "U = [0.000; 0.000; 0.0015; -0.0032];", desc: "Define el vector de desplazamientos (nodos 1 restringido, nodo 2 con desplazamiento)." },
            { code: "num_gdl = length(F);", desc: "Obtiene la cantidad total de grados de libertad (4 componentes)." },
            { code: "fprintf(...)", desc: "Imprime mensajes formateados con las dimensiones calculadas." }
          ],
          output: `F =
     0
   -50
    20
     0

Dimensiones del vector F: 4 filas x 1 columna
Total de grados de libertad: 4`,
          interpretation: "El vector F queda definido como una matriz de 4×1. Esto garantiza que la posterior operación de equilibrio matricial K*U = F sea dimensionalmente compatible, evitando el clásico error de incompatibilidad 'Matrix dimensions must agree'.",
          frequentError: {
            title: "Definir F como vector fila [0, -50, 20, 0]",
            desc: "Si defines F como fila (1×4) e intentas resolver K\\F (donde K es 4×4), MATLAB emitirá un error fatal de dimensiones incompatibles. Recuerda usar siempre ';' para vectores de fuerzas y desplazamientos."
          },
          guidedExercise: {
            title: "Ejercicio Guiado: Creación de vector de fuerzas a partir de transpuesta",
            prompt: "Crea un vector fila con las fuerzas nodales [10, -30, 0] y conviértelo en vector columna usando el operador transpuesta (').",
            solutionCode: `F_fila = [10, -30, 0];\nF = F_fila'`
          },
          interactiveExercise: {
            id: "ex-2-1",
            type: "code-fill",
            badge: "Construcción de Vector",
            prompt: "Define un vector columna llamado 'F' que contenga una carga horizontal de 40 kN en el GDL 1, una vertical descendente de -120 kN en el GDL 2, y cero en el GDL 3.",
            expectedAnswer: "F = [40; -120; 0];",
            placeholder: "F = [...];",
            hint: "Utiliza corchetes [] y separa cada elemento con punto y coma (;).",
            solution: "F = [40; -120; 0];"
          },
          quiz: {
            question: "Si ejecutas la instrucción size([10; 25; -40]), ¿qué vector de dimensiones devuelve MATLAB?",
            options: [
              "[1, 3] (1 fila y 3 columnas)",
              "[3, 1] (3 filas y 1 columna)",
              "[3, 3] (matriz cuadrada)",
              "3 (escalar único)"
            ],
            correctIndex: 1,
            explanation: "Al usar punto y coma (;), se define un vector columna que consta de 3 filas y 1 sola columna: [3, 1]."
          }
        },
        {
          id: "les-2-2",
          number: "2.2",
          title: "Matrices geométricas: Coordenadas nodales (Coord) y Conectividad (Con)",
          objective: "Representar la topología de una estructura en MATLAB mediante la matriz de coordenadas nodales Coord y la matriz de conectividad Con, comprendiendo su estructura y significado físico.",
          theory: `Toda estructura discreta (como una armadura o pórtico plano) se describe numéricamente mediante dos matrices geométricas fundamentales:

1. <strong>Matriz de Coordenadas Nodales (<code>Coord</code>):</strong>
Cada fila $i$ representa el nodo $i$, y las columnas contienen sus coordenadas cartesianas:
$$\\mathbf{Coord} = \\begin{bmatrix} X_1 & Y_1 \\\\ X_2 & Y_2 \\\\ \\vdots & \\vdots \\\\ X_n & Y_n \\end{bmatrix}_{n \\text{ nodos} \\times 2}$$

2. <strong>Matriz de Conectividad de Elementos (<code>Con</code>):</strong>
Cada fila $e$ representa la barra o elemento $e$, y sus columnas indican el nodo inicial ($N_i$) y el nodo final ($N_j$):
$$\\mathbf{Con} = \\begin{bmatrix} N_{i,1} & N_{j,1} \\\\ N_{i,2} & N_{j,2} \\\\ \\vdots & \\vdots \\\\ N_{i,m} & N_{j,m} \\end{bmatrix}_{m \\text{ barras} \\times 2}$$

Estas dos matrices concentran toda la información geométrica necesaria para que el código determine automáticamente longitudes, cosenos directores y matrices de rigidez elemental.`,
          math: `\\text{Nodo } i: (X_i, Y_i) = \\mathbf{Coord}(i, :) \\quad | \\quad \\text{Elemento } e: [N_i, N_j] = \\mathbf{Con}(e, :)`,
          glossary: [
            { var: "Coord", desc: "Matriz de coordenadas nodales (número de nodos × 2 o 3 dimensiones)." },
            { var: "Con", desc: "Matriz de conectividad que indica los nodos extremos [Nodo_inicial, Nodo_final] de cada barra." },
            { var: "num_nodos", desc: "Cantidad total de nudos de la estructura, obtenida como size(Coord, 1)." },
            { var: "num_barras", desc: "Cantidad total de elementos estructurales, obtenida como size(Con, 1)." }
          ],
          code: `% =========================================================================
% GEOMETRÍA DE UNA ARMADURA TRIANGULAR DE 3 NODOS Y 3 BARRAS
% =========================================================================
clear; clc;

% Matriz de Coordenadas Nodales [X, Y] en metros
% Nodo 1: (0, 0), Nodo 2: (4, 3), Nodo 3: (6, 0)
Coord = [0 0;
         4 3;
         6 0];

% Matriz de Conectividad [Nodo_Inicial, Nodo_Final]
% Barra 1: une Nodo 1 con 2
% Barra 2: une Nodo 2 con 3
% Barra 3: une Nodo 1 con 3
Con = [1 2;
       2 3;
       1 3];

% Obtener número de nodos y barras automáticamente
num_nodos  = size(Coord, 1);
num_barras = size(Con, 1);

% Mostrar información geométrica
fprintf('Estructura definida con %d nodos y %d barras\\n', num_nodos, num_barras);`,
          lineByLine: [
            { code: "Coord = [0 0; 4 3; 6 0];", desc: "Define la matriz Coord de 3 filas y 2 columnas. Cada fila corresponde a un nodo y contiene sus coordenadas (X, Y)." },
            { code: "Con = [1 2; 2 3; 1 3];", desc: "Define la matriz de conectividad Con de 3 filas y 2 columnas. Cada fila indica la topología de la barra correspondiente." },
            { code: "num_nodos = size(Coord, 1);", desc: "El segundo argumento '1' solicita específicamente el número de filas de Coord, que equivale al número de nodos." },
            { code: "num_barras = size(Con, 1);", desc: "Obtiene el número de filas de Con, correspondiente al total de barras del sistema." },
            { code: "fprintf(...)", desc: "Imprime el resumen de la topología estructural." }
          ],
          output: `Estructura definida con 3 nodos y 3 barras`,
          interpretation: "Al almacenar la estructura en matrices Coord y Con, el código queda parametrizado. Si mañana la armadura tiene 50 barras y 30 nodos, la lógica de cálculo subsecuente no necesitará modificarse.",
          frequentError: {
            title: "Índices nodales fuera de rango en Con",
            desc: "Si en una estructura de 3 nodos defines en Con una barra con [1 4], MATLAB arrojará error al intentar buscar las coordenadas del nodo 4 en la matriz Coord (Index out of bounds). Los números en Con deben ser enteros entre 1 y el número de filas de Coord."
          },
          guidedExercise: {
            title: "Ejercicio Guiado: Definición de un pórtico simple de 4 nodos",
            prompt: "Define las matrices Coord y Con para una estructura rectangular con Nodo 1 (0,0), Nodo 2 (0,3), Nodo 3 (5,3) y Nodo 4 (5,0), con barras [1 2; 2 3; 3 4].",
            solutionCode: `Coord = [0 0; 0 3; 5 3; 5 0];\nCon = [1 2; 2 3; 3 4];`
          },
          interactiveExercise: {
            id: "ex-2-2",
            type: "code-fill",
            badge: "Matriz de Conectividad",
            prompt: "Escribe la instrucción en MATLAB para definir la matriz 'Con' de una armadura con 2 barras: Barra 1 (une nodo 1 y 2) y Barra 2 (une nodo 2 y 4).",
            expectedAnswer: "Con = [1 2; 2 4];",
            placeholder: "Con = [...];",
            hint: "Separa los dos nodos de cada barra con espacio y la siguiente barra con punto y coma.",
            solution: "Con = [1 2; 2 4];"
          },
          quiz: {
            question: "¿Qué instrucción devuelve el número total de nodos a partir de la matriz Coord?",
            options: [
              "length(Coord)",
              "size(Coord, 1)",
              "size(Coord, 2)",
              "Coord(end)"
            ],
            correctIndex: 1,
            explanation: "size(Coord, 1) devuelve exactamente el número de filas de la matriz Coord, que corresponde al número de nodos del modelo."
          }
        },
        {
          id: "les-2-3",
          number: "2.3",
          title: "Matrices especiales de inicialización: zeros, ones, eye y size",
          objective: "Utilizar funciones de creación de matrices especiales para inicializar matrices de rigidez globales, vectores de resultados y matrices identidad de transformación.",
          theory: `Antes de calcular o ensamblar la rigidez de una estructura, es obligatorio en programación científica <strong>prealocar memoria</strong> (crear la matriz con ceros de su tamaño definitivo).

Si una estructura posee $n_{\\text{gdl}}$ grados de libertad:
- La matriz global de rigidez $\\mathbf{K}$ debe nacer como una matriz cuadrada de ceros de tamaño $n_{\\text{gdl}} \\times n_{\\text{gdl}}$ mediante <code>zeros(n_gdl, n_gdl)</code>.
- El vector global de fuerzas $\\mathbf{F}$ se inicializa como <code>zeros(n_gdl, 1)</code>.

Otras matrices especiales frecuentes:
- <code>ones(f, c)</code>: Matriz de unos (útil para vectores de pesos o máscaras).
- <code>eye(n)</code>: Matriz identidad $n \\times n$ (con unos en la diagonal principal y ceros en el resto), fundamental en transformaciones ortogonales y cálculo de autovalores.`,
          math: `\\mathbf{K}_{\\text{inicial}} = \\mathbf{0}_{n \\times n} = \\begin{bmatrix} 0 & 0 & \\cdots & 0 \\\\ 0 & 0 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 0 \\end{bmatrix} \\quad \\Longleftrightarrow \\quad \\mathbf{K} = \\text{zeros}(n, n)`,
          glossary: [
            { var: "zeros(m, n)", desc: "Crea una matriz de dimensiones m × n compuesta exclusivamente por ceros." },
            { var: "ones(m, n)", desc: "Crea una matriz de dimensiones m × n compuesta por unos." },
            { var: "eye(n)", desc: "Genera la matriz identidad cuadrada de tamaño n × n." },
            { var: "K", desc: "Matriz global de rigidez de la estructura." }
          ],
          code: `% =========================================================================
% INICIALIZACIÓN DE MATRICES ESTRUCTURALES GLOBALES
% =========================================================================
clear; clc;

% Supongamos una armadura 2D de 3 nodos (cada nodo tiene 2 GDL: Ux, Uy)
num_nodos = 3;
gdl_por_nodo = 2;
total_gdl = num_nodos * gdl_por_nodo; % 6 grados de libertad en total

% 1. Inicializar la matriz global de rigidez K (6x6 de ceros)
K = zeros(total_gdl, total_gdl);

% 2. Inicializar el vector global de fuerzas F (6x1 de ceros)
F = zeros(total_gdl, 1);

% 3. Matriz identidad para transformaciones locales a globales 2D
I2 = eye(2);

% Inspección de dimensiones
fprintf('Matriz K inicializada con tamaño: %d x %d\\n', size(K,1), size(K,2));
fprintf('Vector F inicializado con tamaño: %d x %d\\n', size(F,1), size(F,2));`,
          lineByLine: [
            { code: "total_gdl = num_nodos * gdl_por_nodo;", desc: "Calcula los grados de libertad totales del sistema mecánico (3 nodos × 2 GDL = 6 GDL)." },
            { code: "K = zeros(total_gdl, total_gdl);", desc: "Crea en memoria una matriz de 6×6 llena de ceros. En esta matriz se acumularán posteriormente las rigideces elementales en el paso de ensamble." },
            { code: "F = zeros(total_gdl, 1);", desc: "Crea el vector columna de 6 filas con ceros, listo para recibir las cargas nodales aplicadas." },
            { code: "I2 = eye(2);", desc: "Crea la matriz identidad 2×2: [1 0; 0 1]." }
          ],
          output: `Matriz K inicializada con tamaño: 6 x 6
Vector F inicializado con tamaño: 6 x 1`,
          interpretation: "Prealocar K con zeros garantiza que el espacio contiguo en la memoria RAM quede reservado. Esto evita que MATLAB tenga que redimensionar la matriz dinámicamente durante el ensamble de cada barra, optimizando el rendimiento computacional.",
          frequentError: {
            title: "Olvidar especificar ambas dimensiones en zeros",
            desc: "Si escribes zeros(6), MATLAB creará una matriz cuadrada de 6×6. Pero si escribes zeros(6, 1) crea un vector columna de 6×1. Para vectores, siempre especifica explícitamente filas y columnas para evitar confusiones."
          },
          guidedExercise: {
            title: "Ejercicio Guiado: Inicialización de pórtico 2D",
            prompt: "En un pórtico 2D cada nodo posee 3 GDL (Ux, Uy, Giro θ). Si la estructura tiene 4 nodos, escribe la instrucción para inicializar la matriz K con ceros.",
            solutionCode: `num_nodos = 4;\ngdl_nodo = 3;\ntotal_gdl = num_nodos * gdl_nodo; % 12\nK = zeros(total_gdl, total_gdl);`
          },
          interactiveExercise: {
            id: "ex-2-3",
            type: "code-fill",
            badge: "Inicialización de Rigidez",
            prompt: "Escribe la instrucción en MATLAB para inicializar una matriz global de rigidez 'K' de ceros para un sistema de 8 grados de libertad.",
            expectedAnswer: "K = zeros(8, 8);",
            placeholder: "K = ...;",
            hint: "Usa la función zeros con 8 filas y 8 columnas.",
            solution: "K = zeros(8, 8);"
          },
          quiz: {
            question: "¿Cuál es la principal ventaja técnica de inicializar la matriz de rigidez K con zeros antes de iniciar el ensamble?",
            options: [
              "Garantiza que el determinante de la matriz sea cero.",
              "Reserva memoria en la RAM evitando relocalizaciones lentas y asegura que las posiciones sin rigidez inicien en cero.",
              "Aplica automáticamente las condiciones de apoyo.",
              "Convierte el sistema en estáticamente determinado."
            ],
            correctIndex: 1,
            explanation: "Prealocar memoria con zeros optimiza el uso de CPU/RAM y garantiza que todas las entradas de la matriz comiencen en 0 antes de sumar la contribución de cada elemento."
          }
        }
      ]
    },
    {
      id: "mod-3",
      number: 3,
      title: "Indexación matricial y grados de libertad",
      summary: "Acceso a componentes F(3), filas Coord(2,:), columnas Coord(:,1) y submatrices K(gdl_libres, gdl_libres) vinculado a la física estructural.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-4",
      number: 4,
      title: "Operaciones matriciales y sistemas lineales",
      summary: "Suma, transpuesta, producto matricial vs elemento a elemento (.*). Solución de equilibrio K\\F vs inv(K)*F.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-5",
      number: 5,
      title: "Geometría estructural y propiedades de elementos",
      summary: "Cálculo de diferencias de coordenadas (dx, dy), longitud de barras L, cosenos directores y ángulos a partir de Coord y Con.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-6",
      number: 6,
      title: "Representación gráfica de estructuras",
      summary: "Uso de figure, plot, hold on, axis equal, grid on y text para graficar esquemas de armaduras y pórticos con numeración nodal.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-7",
      number: 7,
      title: "Introducción al método de rigidez directa",
      summary: "Matriz de rigidez elemental Ke, vector de grados de libertad gdl_e, grados libres y restringidos.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-8",
      number: 8,
      title: "Ensamble de la matriz global",
      summary: "Concepto e implementación de K(gdl_e, gdl_e) = K(gdl_e, gdl_e) + Ke antes de la automatización en bucles.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-9",
      number: 9,
      title: "Condiciones de frontera, reducción y solución",
      summary: "Partición matricial, obtención de KLL, FL, resolución de desplazamientos libres UL = KLL\\FL y cálculo de reacciones R.",
      status: "upcoming",
      lessons: []
    },
    {
      id: "mod-10",
      number: 10,
      title: "Funciones modulares y automatización",
      summary: "Modularización del código en scripts y funciones con argumentos de entrada/salida, bucles for y condicionales.",
      status: "upcoming",
      lessons: []
    }
  ],

  // Ejemplo Completo Aplicado a Ingeniería Civil (Módulo Geometría / Cálculo de Barras)
  civilEngineeringExample: {
    title: "Ejemplo Aplicado: Cálculo Automatizado de Longitudes y Cosenos Directores",
    badge: "Caso de Estudio Práctico",
    description: "A partir de la geometría nodal de una armadura plana, determinamos las proyecciones (Δx, Δy), la longitud real L y los cosenos directores (λx, λy) de una barra estructural. Este paso es el pilar para transformar rigideces locales a globales.",
    diagramSvg: `<svg viewBox="0 0 500 240" class="structural-svg" style="width:100%; max-width:500px; height:auto; background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; margin:1rem auto; display:block;">
      <!-- Grid de fondo -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      <!-- Ejes coordenados -->
      <line x1="50" y1="200" x2="450" y2="200" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
      <line x1="70" y1="220" x2="70" y2="30" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4"/>
      <text x="440" y="218" fill="#64748b" font-family="Consolas" font-size="12">X (m)</text>
      <text x="50" y="35" fill="#64748b" font-family="Consolas" font-size="12">Y (m)</text>
      
      <!-- Barra 1 (Nodo 1 a Nodo 2) -->
      <line x1="80" y1="190" x2="320" y2="70" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
      
      <!-- Triángulo de proyecciones dx, dy -->
      <line x1="80" y1="190" x2="320" y2="190" stroke="#dc2626" stroke-width="2" stroke-dasharray="3"/>
      <line x1="320" y1="190" x2="320" y2="70" stroke="#16a34a" stroke-width="2" stroke-dasharray="3"/>
      
      <text x="190" y="210" fill="#dc2626" font-family="Consolas" font-weight="bold" font-size="13">dx = X2 - X1 = 4.0 m</text>
      <text x="330" y="135" fill="#16a34a" font-family="Consolas" font-weight="bold" font-size="13">dy = Y2 - Y1 = 3.0 m</text>
      <text x="170" y="115" fill="#1e3a8a" font-family="Consolas" font-weight="bold" font-size="14">L = √(dx² + dy²) = 5.0 m</text>
      
      <!-- Nodos -->
      <circle cx="80" cy="190" r="7" fill="#c2410c" stroke="#fff" stroke-width="2"/>
      <text x="65" y="180" fill="#0f172a" font-weight="bold" font-family="sans-serif" font-size="13">Nodo 1 (0, 0)</text>
      
      <circle cx="320" cy="70" r="7" fill="#c2410c" stroke="#fff" stroke-width="2"/>
      <text x="310" y="55" fill="#0f172a" font-weight="bold" font-family="sans-serif" font-size="13">Nodo 2 (4, 3)</text>
    </svg>`,
    math: `\\begin{aligned}
    dx &= X_j - X_i, \\quad dy = Y_j - Y_i \\\\[4pt]
    L &= \\sqrt{dx^2 + dy^2} \\\\[4pt]
    \\lambda_x &= \\cos(\\theta) = \\frac{dx}{L}, \\quad \\lambda_y = \\sin(\\theta) = \\frac{dy}{L}
    \\end{aligned}`,
    code: `% =========================================================================
% EJEMPLO APLICADO: PROPIEDADES GEOMÉTRICAS DE UN ELEMENTO ESTRUCTURAL
% =========================================================================
clear; clc;

% Matriz de coordenadas de los nodos [X Y]
Coord = [0 0;   % Nodo 1
         4 3;   % Nodo 2
         6 0];  % Nodo 3

% Matriz de conectividad [Nodo_i  Nodo_j]
Con = [1 2;     % Barra 1
       2 3;     % Barra 2
       1 3];    % Barra 3

% Seleccionar la Barra 1 para análisis
elem = 1;
ni = Con(elem, 1); % Nodo inicial (1)
nj = Con(elem, 2); % Nodo final (2)

% Extraer coordenadas de ambos extremos mediante indexación
xi = Coord(ni, 1);  yi = Coord(ni, 2);
xj = Coord(nj, 1);  yj = Coord(nj, 2);

% Diferencias de coordenadas
dx = xj - xi;
dy = yj - yi;

% Longitud euclidiana de la barra
L = sqrt(dx^2 + dy^2);

% Cosenos directores (orientación en el espacio 2D)
lambda_x = dx / L; % cos(theta)
lambda_y = dy / L; % sin(theta)

% Imprimir resultados con formato de ingeniería
fprintf('--- RESULTADOS BARRA %d (Nodos %d -> %d) ---\\n', elem, ni, nj);
fprintf('Longitud de la barra (L)   : %.4f m\\n', L);
fprintf('Coseno director en X (Lx) : %.4f\\n', lambda_x);
fprintf('Coseno director en Y (Ly) : %.4f\\n', lambda_y);`,
    output: `--- RESULTADOS BARRA 1 (Nodos 1 -> 2) ---
Longitud de la barra (L)   : 5.0000 m
Coseno director en X (Lx) : 0.8000
Coseno director en Y (Ly) : 0.6000`,
    interpretation: "Para la Barra 1 (triángulo 3-4-5 clásico), la longitud calculada es de 5.00 metros exactos. Los cosenos directores son λx = 0.8 y λy = 0.6. Con estos dos números se construirá de forma unívoca la matriz de rotación del elemento T y su correspondiente matriz de rigidez global Ke."
  },

  // Glosario Completo y Unificado
  glossaryList: [
    { var: "Coord", name: "Matriz de Coordenadas Nodales", dim: "num_nodos × 2 (o 3)", desc: "Almacena la posición espacial cartesiana (X, Y, Z) de cada nudo de la estructura." },
    { var: "Con", name: "Matriz de Conectividad", dim: "num_barras × 2", desc: "Define la topología estructural indicando los nodos extremos [Nodo_i, Nodo_j] que conectan cada barra." },
    { var: "K", name: "Matriz Global de Rigidez", dim: "total_gdl × total_gdl", desc: "Matriz simétrica y definida positiva (tras apoyos) que relaciona desplazamientos globales con fuerzas nodales (K·U = F)." },
    { var: "Ke", name: "Matriz de Rigidez Elemental Global", dim: "gdl_e × gdl_e", desc: "Rigidez de una barra individual expresada en el sistema de coordenadas globales de la estructura." },
    { var: "k_local", name: "Matriz de Rigidez Elemental Local", dim: "4 × 4 (armadura 2D)", desc: "Rigidez de la barra en su propio eje axial (relaciona esfuerzos axiales con alargamientos)." },
    { var: "gdl_e", name: "Grados de Libertad del Elemento", dim: "1 × 4 (o 1 × 6)", desc: "Vector de enteros que indica los identificadores globales de los GDL que pertenecen a los nudos del elemento." },
    { var: "gdl_libres", name: "Grados de Libertad Libres", dim: "nL × 1", desc: "Conjunto de índices de GDL donde la estructura tiene libertad de desplazamiento (desplazamientos incógnita UL)." },
    { var: "gdl_restring", name: "Grados de Libertad Restringidos", dim: "nR × 1", desc: "Conjunto de índices de GDL fijados por condiciones de apoyo (desplazamientos conocidos UR = 0)." },
    { var: "F", name: "Vector Global de Fuerzas", dim: "total_gdl × 1", desc: "Vector que contiene las cargas nodales externas aplicadas en cada grado de libertad." },
    { var: "FL", name: "Vector de Fuerzas en GDL Libres", dim: "nL × 1", desc: "Subvector de cargas externas aplicadas sobre los grados de libertad libres." },
    { var: "U", name: "Vector Global de Desplazamientos", dim: "total_gdl × 1", desc: "Vector que almacena las traslaciones y giros de todos los nodos de la estructura." },
    { var: "UL", name: "Vector de Desplazamientos Libres", dim: "nL × 1", desc: "Incógnitas del sistema resueltas mediante KLL \\ FL." },
    { var: "R", name: "Vector de Reacciones en los Apoyos", dim: "nR × 1", desc: "Fuerzas reactivas ejercidas por las restricciones de apoyo sobre la estructura (R = KRL·UL - FR)." },
    { var: "KLL", name: "Matriz de Rigidez Reducida (Libre-Libre)", dim: "nL × nL", desc: "Submatriz invertible formada por la intersección de filas y columnas correspondientes a GDL libres." },
    { var: "L", name: "Longitud de la Barra", dim: "Escalar (> 0)", desc: "Distancia euclidiana entre el nodo inicial y final de un elemento: sqrt(dx^2 + dy^2)." },
    { var: "lambda_x, lambda_y", name: "Cosenos Directores", dim: "Escalares [-1, 1]", desc: "Proyecciones normalizadas dx/L y dy/L que definen la inclinación espacial de la barra." }
  ],

  // Catálogo de Errores Frecuentes
  frequentErrorsList: [
    {
      id: "err-1",
      title: "Uso de inv(K)*F en lugar del operador división izquierda K\\F",
      severity: "Critico",
      badCode: "% INADECUADO: Lento e numéricamente inestable\nU = inv(K) * F;",
      goodCode: "% CORRECTO: Eliminación gaussiana optimizada\nU = K \\ F;",
      why: "Calcular la inversa explícita inv(K) requiere el triple de operaciones aritméticas y es susceptible a errores de propagación por redondeo en matrices mal condicionadas. El operador backslash '\\' utiliza descomposición de Cholesky o LU, siendo infinitamente más robusto y rápido."
    },
    {
      id: "err-2",
      title: "Confusión entre producto matricial (*) y producto elemento a elemento (.*)",
      severity: "Grave",
      badCode: "% ERROR: Si EA y L son vectores, esto no calcula rigidez\nk = EA / L;",
      goodCode: "% CORRECTO: División elemento a elemento para vectores\nk = EA ./ L;",
      why: "El operador '/' intenta resolver un sistema matricial. Si tienes un vector con las rigideces axiales de 10 barras y un vector con sus 10 longitudes, debes usar './' o '.*' para operar miembro a miembro."
    },
    {
      id: "err-3",
      title: "Indexación basada en cero (error común si vienes de Python o C)",
      severity: "Sintaxis",
      badCode: "% ERROR EN MATLAB:\nprimer_nodo = Coord(0, :); % MATLAB inicia en 1",
      goodCode: "% CORRECTO EN MATLAB:\nprimer_nodo = Coord(1, :);",
      why: "En MATLAB todos los índices de matrices y vectores comienzan estrictamente en 1. Intentar acceder al índice 0 genera un error inmediato: 'Array indices must be positive integers'."
    },
    {
      id: "err-4",
      title: "Acumulación en K sin haber inicializado la matriz con zeros",
      severity: "Lógica",
      badCode: "% ERROR: Si K no existe, no se puede indexar ni sumar\nK(gdl_e, gdl_e) = K(gdl_e, gdl_e) + Ke;",
      goodCode: "% CORRECTO: Prealocar K antes del bucle de ensamble\nK = zeros(total_gdl, total_gdl);\nK(gdl_e, gdl_e) = K(gdl_e, gdl_e) + Ke;",
      why: "Si K no ha sido inicializada previamente con el tamaño total, MATLAB intentará crearla sobre la marcha con dimensiones incompletas, provocando errores en barras posteriores."
    }
  ]
};
