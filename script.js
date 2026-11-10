/* =====================================================
   STUDYBOT - ADMINISTRADOR DE TAREAS

   En este archivo se utilizan cuatro estructuras:
   1. Arreglo (Array)
   2. Lista enlazada
   3. Pila
   4. Cola
   ===================================================== */


/* =====================================================
   ESTRUCTURA 1: ARREGLO (ARRAY)

   Guarda las materias escolares.
   Se refleja en la página "Mis materias".
   push() agrega materias.
   splice() elimina materias.
   ===================================================== */

let materias = [
    "Estructura de Datos",
    "Estadística",
    "Programación",
    "Inglés",
    "Contabilidad"
];


/* =====================================================
   ESTRUCTURA 2: LISTA ENLAZADA

   Cada nodo guarda una tarea y una referencia
   al siguiente nodo.

   Permite agregar, buscar, modificar y eliminar tareas.
   Se refleja en la tabla "Mis tareas".
   ===================================================== */

class Nodo {

    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
    }

}

class ListaEnlazada {

    constructor() {
        this.cabeza = null;
        this.tamano = 0;
    }

    // Agrega una nueva tarea al final de la lista.
    agregar(dato) {

        const nuevo = new Nodo(dato);

        if (this.cabeza === null) {

            this.cabeza = nuevo;

        } else {

            let actual = this.cabeza;

            while (actual.siguiente !== null) {
                actual = actual.siguiente;
            }

            actual.siguiente = nuevo;
        }

        this.tamano++;
    }

    // Obtiene todas las tareas almacenadas.
    obtenerTodos() {

        const resultado = [];
        let actual = this.cabeza;

        while (actual !== null) {

            resultado.push(actual.dato);
            actual = actual.siguiente;

        }

        return resultado;
    }

    // Busca una tarea mediante su identificador.
    buscar(id) {

        let actual = this.cabeza;

        while (actual !== null) {

            if (String(actual.dato.id) === String(id)) {
                return actual.dato;
            }

            actual = actual.siguiente;
        }

        return null;
    }

    // Elimina una tarea de la lista.
    eliminar(id) {

        if (this.cabeza === null) {
            return null;
        }

        if (String(this.cabeza.dato.id) === String(id)) {

            const eliminado = this.cabeza.dato;

            this.cabeza = this.cabeza.siguiente;

            this.tamano--;

            return eliminado;
        }

        let actual = this.cabeza;

        while (actual.siguiente !== null) {

            if (String(actual.siguiente.dato.id) === String(id)) {

                const eliminado = actual.siguiente.dato;

                actual.siguiente = actual.siguiente.siguiente;

                this.tamano--;

                return eliminado;
            }

            actual = actual.siguiente;
        }

        return null;
    }

    // Modifica los datos de una tarea existente.
    modificar(id, cambios) {

        const tarea = this.buscar(id);

        if (!tarea) {
            return false;
        }

        Object.assign(tarea, cambios);

        return true;
    }

}


/* =====================================================
   ESTRUCTURA 3: PILA

   Guarda copias de las tareas eliminadas.

   push() coloca una tarea en la pila.
   pop() recupera la última tarea eliminada.

   Se refleja en el botón:
   "Recuperar última tarea eliminada".
   ===================================================== */

class Pila {

    constructor() {
        this.elementos = [];
    }

    // Agrega una tarea a la pila.
    push(elemento) {
        this.elementos.push(elemento);
    }

    // Recupera la última tarea agregada a la pila.
    pop() {
        return this.elementos.pop();
    }

    // Comprueba si la pila está vacía.
    estaVacia() {
        return this.elementos.length === 0;
    }

}


/* =====================================================
   ESTRUCTURA 4: COLA

   Organiza las tareas pendientes en orden de llegada.

   enqueue() agrega una tarea al final.
   dequeue() retira la primera tarea.

   Se refleja en el contador "Pendientes" y en el estado
   de las tareas de la tabla.
   ===================================================== */

class Cola {

    constructor() {
        this.elementos = [];
    }

    // Agrega una tarea al final de la cola.
    enqueue(elemento) {

        if (!this.elementos.some(
            t => String(t.id) === String(elemento.id)
        )) {

            this.elementos.push(elemento);
        }

    }

    // Retira la primera tarea de la cola.
    dequeue() {
        return this.elementos.shift();
    }

    // Comprueba si la cola está vacía.
    estaVacia() {
        return this.elementos.length === 0;
    }

    // Elimina una tarea específica de la cola.
    eliminar(id) {

        this.elementos = this.elementos.filter(
            elemento => String(elemento.id) !== String(id)
        );

    }

    // Actualiza los datos de una tarea que está en la cola.
    actualizar(tarea) {

        const posicion = this.elementos.findIndex(
            elemento => String(elemento.id) === String(tarea.id)
        );

        if (posicion !== -1) {
            this.elementos[posicion] = tarea;
        }

    }

}


/* =====================================================
   CREACIÓN DE LAS ESTRUCTURAS

   listaTareas: almacena todas las tareas.
   pilaEliminadas: guarda las tareas eliminadas.
   colaPendientes: organiza las tareas pendientes.

   El arreglo materias está declarado al inicio.
   ===================================================== */

const listaTareas = new ListaEnlazada();

const pilaEliminadas = new Pila();

const colaPendientes = new Cola();


/* =====================================================
   ALMACENAMIENTO DE INFORMACIÓN

   Se utiliza localStorage para guardar los registros.
   Así se conservan al cerrar y volver a abrir la página,
   siempre que se use el mismo navegador y no se borren
   los datos del sitio.
   ===================================================== */

const CLAVES = {

    materias: "studybot_materias",
    tareas: "studybot_tareas",
    pila: "studybot_pila",
    cola: "studybot_cola"

};

let temporizadorMensaje;


// GUARDAR LOS DATOS DEL ADMINISTRADOR.
function guardarDatos() {

    try {

        localStorage.setItem(
            CLAVES.materias,
            JSON.stringify(materias)
        );

        localStorage.setItem(
            CLAVES.tareas,
            JSON.stringify(listaTareas.obtenerTodos())
        );

        localStorage.setItem(
            CLAVES.pila,
            JSON.stringify(pilaEliminadas.elementos)
        );

        localStorage.setItem(
            CLAVES.cola,
            JSON.stringify(
                colaPendientes.elementos.map(tarea => tarea.id)
            )
        );

        return true;

    } catch (error) {

        console.error("No fue posible guardar los datos:", error);

        mostrarMensaje(
            "No se pudieron guardar los cambios en este navegador."
        );

        return false;
    }

}


// RECUPERAR LOS DATOS AL ABRIR LA PÁGINA.
function cargarDatos() {

    try {

        const materiasGuardadas = JSON.parse(
            localStorage.getItem(CLAVES.materias) || "null"
        );

        const tareasGuardadas = JSON.parse(
            localStorage.getItem(CLAVES.tareas) || "null"
        );

        const pilaGuardada = JSON.parse(
            localStorage.getItem(CLAVES.pila) || "null"
        );

        const colaGuardada = JSON.parse(
            localStorage.getItem(CLAVES.cola) || "null"
        );


        // Recuperar las materias del arreglo.
        if (Array.isArray(materiasGuardadas)) {
            materias = materiasGuardadas;
        }


        // Recuperar las tareas de la lista enlazada.
        if (Array.isArray(tareasGuardadas)) {

            tareasGuardadas.forEach(tarea => {
                listaTareas.agregar(tarea);
            });

        }


        // Recuperar las tareas guardadas en la pila.
        if (Array.isArray(pilaGuardada)) {
            pilaEliminadas.elementos = pilaGuardada;
        }


        // Reconstruir la cola de tareas pendientes.
        const tareas = listaTareas.obtenerTodos();

        if (Array.isArray(colaGuardada)) {

            colaGuardada.forEach(id => {

                const tarea = listaTareas.buscar(id);

                if (tarea && tarea.estado === "Pendiente") {
                    colaPendientes.enqueue(tarea);
                }

            });

        }

        // Agregar cualquier pendiente que no se haya recuperado.
        tareas.forEach(tarea => {

            if (tarea.estado === "Pendiente") {
                colaPendientes.enqueue(tarea);
            }

        });

    } catch (error) {

        console.error("Error al recuperar los datos:", error);

        mostrarMensaje(
            "No se pudieron recuperar algunos datos guardados."
        );

    }

}


/* =====================================================
   NAVEGACIÓN ENTRE LAS SECCIONES
   ===================================================== */

function showSection(id) {

    document.querySelectorAll(".section").forEach(seccion => {

        seccion.classList.toggle(
            "active",
            seccion.id === id
        );

    });


    document.querySelectorAll(".nav-btn").forEach(boton => {

        boton.classList.toggle(
            "active",
            boton.dataset.section === id
        );

    });


    const nombres = {

        inicio: "Inicio",
        tareas: "Mis tareas",
        materias: "Mis materias"

    };

    const titulo = document.getElementById("pageTitle");

    if (titulo) {
        titulo.textContent = nombres[id] || "StudyBot";
    }

    document.getElementById("sidebar").classList.remove("open");

    actualizarTodo();

}


// Activar los botones del menú.
document.querySelectorAll(".nav-btn").forEach(boton => {

    boton.addEventListener("click", () => {

        showSection(boton.dataset.section);

    });

});


// Abrir y cerrar el menú en celulares.
document.getElementById("menuToggle").addEventListener("click", () => {

    document.getElementById("sidebar").classList.toggle("open");

});


/* =====================================================
   MENSAJES DE CONFIRMACIÓN
   ===================================================== */

function mostrarMensaje(texto) {

    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = texto;

    toast.classList.add("show");

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);

}


/* =====================================================
   REGISTRAR TAREAS

   Cuando se registra una tarea:
   1. Se agrega a la LISTA ENLAZADA.
   2. Se agrega a la COLA de tareas pendientes.
   3. Se guardan los cambios.
   ===================================================== */

document.getElementById("taskForm").addEventListener(
    "submit",
    function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("taskName").value.trim();

        const materia = document.getElementById("taskSubject").value;

        const fecha = document.getElementById("taskDate").value;

        const prioridad = document.getElementById("taskPriority").value;


        if (!nombre || !materia) {

            mostrarMensaje("Completa el nombre y la materia.");

            return;
        }


        const tarea = {

            id: (window.crypto && crypto.randomUUID)
                ? crypto.randomUUID()
                : String(Date.now()) + String(Math.random()).slice(2),

            nombre: nombre,

            materia: materia,

            fecha: fecha,

            prioridad: prioridad,

            estado: "Pendiente"

        };


        // La tarea entra en la lista enlazada.
        listaTareas.agregar(tarea);

        // La tarea también entra al final de la cola.
        colaPendientes.enqueue(tarea);


        guardarDatos();

        actualizarTodo();

        this.reset();

        mostrarMensaje("¡Tarea registrada correctamente!");

    }
);


/* =====================================================
   MOSTRAR LAS TAREAS EN LA TABLA

   La información se obtiene de la LISTA ENLAZADA.
   ===================================================== */

function mostrarTareas(filtro = "") {

    const tabla = document.getElementById("taskTable");

    const textoFiltro = filtro.toLocaleLowerCase("es");


    const filtradas = listaTareas.obtenerTodos().filter(tarea =>

        (tarea.nombre || "").toLocaleLowerCase("es").includes(textoFiltro) ||

        (tarea.materia || "").toLocaleLowerCase("es").includes(textoFiltro)

    );


    tabla.innerHTML = "";


    if (filtradas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No se encontraron tareas.
                </td>
            </tr>
        `;

        return;
    }


    filtradas.forEach(tarea => {

        const fila = document.createElement("tr");


        // Nombre de la tarea.
        const celdaNombre = document.createElement("td");

        celdaNombre.textContent = tarea.nombre;


        // Materia.
        const celdaMateria = document.createElement("td");

        celdaMateria.textContent = tarea.materia;


        // Fecha de entrega.
        const celdaFecha = document.createElement("td");

        celdaFecha.textContent = tarea.fecha || "Sin fecha";


        // Prioridad.
        const celdaPrioridad = document.createElement("td");

        const prioridad = document.createElement("span");

        prioridad.className = "priority " + tarea.prioridad;

        prioridad.textContent = tarea.prioridad;

        celdaPrioridad.appendChild(prioridad);


        // Estado de la tarea.
        const celdaEstado = document.createElement("td");

        const estado = document.createElement("span");

        estado.className = tarea.estado === "Completada"
            ? "status done"
            : "status";

        estado.textContent = tarea.estado;

        celdaEstado.appendChild(estado);


        // Botones de acciones.
        const acciones = document.createElement("td");


        // Botón para completar.
        if (tarea.estado === "Pendiente") {

            const completar = document.createElement("button");

            completar.className = "action-btn complete-btn";

            completar.textContent = "✓ Completar";

            completar.addEventListener("click", () => {

                completarTarea(tarea.id);

            });

            acciones.appendChild(completar);

        }


        // Botón para editar.
        const editar = document.createElement("button");

        editar.className = "action-btn edit-btn";

        editar.textContent = "✎ Editar";

        editar.addEventListener("click", () => {

            editarTarea(tarea.id);

        });


        // Botón para eliminar.
        const eliminar = document.createElement("button");

        eliminar.className = "action-btn delete-btn";

        eliminar.textContent = "✕ Eliminar";

        eliminar.addEventListener("click", () => {

            eliminarTarea(tarea.id);

        });


        acciones.append(editar, eliminar);


        fila.append(
            celdaNombre,
            celdaMateria,
            celdaFecha,
            celdaPrioridad,
            celdaEstado,
            acciones
        );

        tabla.appendChild(fila);

    });

}


// BUSCAR TAREAS.
document.getElementById("searchTask").addEventListener(
    "input",
    function() {

        mostrarTareas(this.value);

    }
);


/* =====================================================
   BOTÓN PARA RECUPERAR TAREAS

   Este botón utiliza la PILA.
   Recupera la última tarea que se eliminó.
   ===================================================== */

document.getElementById("undoTaskButton").addEventListener(
    "click",
    undoDelete
);


/* =====================================================
   COMPLETAR TAREA

   Cuando una tarea se completa:
   cambia su estado y se retira de la COLA.
   ===================================================== */

function completarTarea(id) {

    const tarea = listaTareas.buscar(id);

    if (!tarea || tarea.estado === "Completada") {
        return;
    }

    tarea.estado = "Completada";

    // Retirar la tarea de la cola de pendientes.
    colaPendientes.eliminar(id);

    guardarDatos();

    actualizarTodo();

    mostrarMensaje("¡Tarea completada!");

}


/* =====================================================
   MODIFICAR TAREA

   Busca la tarea en la LISTA ENLAZADA y modifica
   su nombre sin crear un registro duplicado.
   ===================================================== */

function editarTarea(id) {

    const tarea = listaTareas.buscar(id);

    if (!tarea) {
        return;
    }

    const nuevoNombre = prompt(
        "Escribe el nuevo nombre de la tarea:",
        tarea.nombre
    );

    if (nuevoNombre === null) {
        return;
    }

    const nombreLimpio = nuevoNombre.trim();

    if (!nombreLimpio) {

        mostrarMensaje("El nombre no puede estar vacío.");

        return;
    }


    listaTareas.modificar(id, {
        nombre: nombreLimpio
    });


    const tareaActualizada = listaTareas.buscar(id);

    // Actualizar también la tarea dentro de la cola.
    colaPendientes.actualizar(tareaActualizada);


    guardarDatos();

    actualizarTodo();

    mostrarMensaje("Tarea modificada correctamente.");

}


/* =====================================================
   ELIMINAR TAREA

   La tarea se guarda primero en la PILA.
   Después se elimina de la LISTA ENLAZADA y de la COLA.
   ===================================================== */

function eliminarTarea(id) {

    const tarea = listaTareas.buscar(id);

    if (!tarea) {
        return;
    }

    if (!confirm(
        "¿Deseas eliminar la tarea \"" + tarea.nombre + "\"?"
    )) {

        return;
    }


    // Guardar una copia de la tarea en la pila.
    pilaEliminadas.push({ ...tarea });


    // Eliminarla de la lista enlazada.
    listaTareas.eliminar(id);


    // Retirarla de la cola de pendientes.
    colaPendientes.eliminar(id);


    guardarDatos();

    actualizarTodo();

    mostrarMensaje(
        "Tarea eliminada. Puedes recuperarla con el botón de recuperar."
    );

}


/* =====================================================
   RECUPERAR LA ÚLTIMA TAREA ELIMINADA

   La función pop() obtiene la última tarea guardada
   en la PILA y la devuelve a la LISTA ENLAZADA.

   Si todavía estaba pendiente, también vuelve a la COLA.
   ===================================================== */

function undoDelete() {

    if (pilaEliminadas.estaVacia()) {

        mostrarMensaje("No hay tareas eliminadas para recuperar.");

        return;
    }


    // Recuperar la última tarea de la pila.
    const tarea = pilaEliminadas.pop();


    // Evitar duplicar una tarea.
    if (listaTareas.buscar(tarea.id)) {

        mostrarMensaje("Esta tarea ya se encuentra registrada.");

        return;
    }


    // Regresar la tarea a la lista enlazada.
    listaTareas.agregar(tarea);


    // Si estaba pendiente, regresarla a la cola.
    if (tarea.estado === "Pendiente") {

        colaPendientes.enqueue(tarea);

    }


    guardarDatos();

    actualizarTodo();

    mostrarMensaje("¡Tarea recuperada correctamente!");

}


/* =====================================================
   MATERIAS

   Las materias se administran mediante el ARREGLO.

   push() agrega una materia.
   splice() elimina una materia.
   ===================================================== */

// Cargar las materias dentro del selector de tareas.
function agregarMateriaAlSelect() {

    const select = document.getElementById("taskSubject");

    const valorAnterior = select.value;


    select.innerHTML = `
        <option value="">Selecciona una materia</option>
    `;


    materias.forEach(materia => {

        const opcion = document.createElement("option");

        opcion.value = materia;

        opcion.textContent = materia;

        select.appendChild(opcion);

    });


    if (materias.includes(valorAnterior)) {

        select.value = valorAnterior;

    }

}


// AGREGAR MATERIA AL ARREGLO.
function addSubject() {

    const campo = document.getElementById("subjectName");

    const nombre = campo.value.trim();


    if (!nombre) {

        mostrarMensaje("Escribe el nombre de la materia.");

        return;
    }


    // Evitar materias repetidas.
    if (materias.some(
        m => m.toLocaleLowerCase("es") === nombre.toLocaleLowerCase("es")
    )) {

        mostrarMensaje("Esta materia ya está registrada.");

        return;
    }


    // Agregar la materia al arreglo.
    materias.push(nombre);

    campo.value = "";


    guardarDatos();

    actualizarTodo();

    mostrarMensaje("Materia agregada correctamente.");

}


// MOSTRAR LAS MATERIAS REGISTRADAS.
function mostrarMaterias() {

    const contenedor = document.getElementById("subjectList");

    contenedor.innerHTML = "";


    materias.forEach((materia, indice) => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "subject-card";


        const titulo = document.createElement("strong");

        titulo.textContent = materia;


        const detalle = document.createElement("small");

        detalle.textContent = "Materia registrada";


        const eliminar = document.createElement("button");

        eliminar.className = "action-btn delete-btn";

        eliminar.textContent = "Eliminar materia";


        eliminar.addEventListener("click", () => {

            // No permitir eliminar una materia que tenga tareas.
            const utilizada = listaTareas.obtenerTodos().some(
                t => t.materia === materia
            );


            if (utilizada) {

                mostrarMensaje(
                    "No puedes eliminar una materia que tiene tareas registradas."
                );

                return;
            }


            if (!confirm("¿Eliminar la materia " + materia + "?")) {
                return;
            }


            // Eliminar la materia del arreglo.
            materias.splice(indice, 1);


            guardarDatos();

            actualizarTodo();

            mostrarMensaje("Materia eliminada.");

        });


        tarjeta.append(titulo, detalle, eliminar);

        contenedor.appendChild(tarjeta);

    });


    if (materias.length === 0) {

        contenedor.innerHTML = `
            <p class="empty">No hay materias registradas.</p>
        `;

    }

}


/* =====================================================
   ACTIVIDADES RECIENTES
   Muestra las últimas cinco tareas registradas.
   ===================================================== */

function mostrarRecientes() {

    const contenedor = document.getElementById("recentTasks");

    contenedor.innerHTML = "";


    const tareas = listaTareas.obtenerTodos().slice(-5).reverse();


    if (tareas.length === 0) {

        contenedor.innerHTML = `
            <p class="empty">
                Todavía no tienes actividades registradas.
            </p>
        `;

        return;
    }


    tareas.forEach(tarea => {

        const elemento = document.createElement("div");

        elemento.className = "recent-item";


        const nombre = document.createElement("strong");

        nombre.textContent = tarea.nombre;


        const estado = document.createElement("small");

        estado.textContent = tarea.estado;


        elemento.append(nombre, estado);

        contenedor.appendChild(elemento);

    });

}


/* =====================================================
   ESTADÍSTICAS

   Actualiza los contadores de tareas y materias.
   ===================================================== */

function actualizarEstadisticas() {

    const tareas = listaTareas.obtenerTodos();


    const pendientes = tareas.filter(
        t => t.estado === "Pendiente"
    ).length;


    const completadas = tareas.filter(
        t => t.estado === "Completada"
    ).length;


    document.getElementById("totalTasks").textContent =
        tareas.length;

    document.getElementById("pendingTasks").textContent =
        pendientes;

    document.getElementById("completedTasks").textContent =
        completadas;

    document.getElementById("totalSubjects").textContent =
        materias.length;

}


/* =====================================================
   ACTUALIZAR TODA LA INTERFAZ
   ===================================================== */

function actualizarTodo() {

    actualizarEstadisticas();

    agregarMateriaAlSelect();

    mostrarMaterias();


    const buscador = document.getElementById("searchTask");

    mostrarTareas(buscador ? buscador.value : "");

    mostrarRecientes();

}


/* =====================================================
   INICIAR STUDYBOT

   Primero recupera los datos guardados.
   Después actualiza la información que aparece en pantalla.
   ===================================================== */

cargarDatos();

actualizarTodo();

console.log("StudyBot iniciado correctamente.");
