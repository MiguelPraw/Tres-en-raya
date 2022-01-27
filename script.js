'use strict'

let nodoJuego = document.querySelector("#juego");

const WIN_CONDITION = 3;
const TAMAÑO_TABLERO_DEFECTO = 4;

class Juego {
    tablero;
    jugador1;
    jugador2;
    jugadorActivo;
    constructor(dimension, nombre1, nombre2){
        this.tablero = new Tablero(dimension);
        this.jugador1 = new Jugador(nombre1);
        this.jugador2 = new Jugador(nombre2);
        this.jugadorActivo = this.jugador1;
    }

    cambiaJugadorActivo() {
        if (this.jugadorActivo === this.jugador1) {
            this.jugadorActivo = this.jugador2;
        } else {
            this.jugadorActivo = this.jugador1;
        }
    }

    reiniciaTablero(dimension) {
        this.tablero = new Tablero(dimension);
    }
}

class Tablero {
    dimension;
    tablero;
    constructor(dimension){
        this.dimension = dimension;
        this.tablero = [];
        for (let i = 0; i < this.dimension; i++) {
            this.tablero[i] = [];
            for (let j = 0; j < this.dimension; j++) {
                this.tablero[i][j] = 0;
            }
        }
    }

    pintaTablero(){
        let nodoTablero = document.createElement('div');
        nodoTablero.classList.add('tablero');
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                let nodoCasilla = document.createElement('div');
                nodoCasilla.classList.add('casilla');
                nodoTablero.append(nodoCasilla);
            }
        }
        return nodoTablero;
    }
}

class Jugador {
    nombre;
    ganadas;
    constructor(nombre){
        this.nombre = nombre;
        this.ganadas = 0;
    }

    ganaPartida() {
        this.ganadas++;
    }

    pintaJugador (){
        let nodoH1 = document.createElement('h1');
        nodoH1.classList.add('jugador');
        nodoH1.innerHTML = "Turno de " + this.nombre;
        nodoH1.classList.add('jugador1');
        return nodoH1;
    }
}

/**
 * Le paso la posicion del array de casillas en la que he clickado
 * y me devuelve la fila del array bidimensional
 * @param {*} juego 
 * @param {*} posicion 
 * @returns 
 */
function calculoFila(juego, posicion){
    let dimension = juego.tablero.dimension;
    let fila = posicion / dimension;
    return Math.trunc(fila);
}

/**
 * Le paso la posicion del array de casillas en la que he clickado
 * y me devuelve la columna del array bidimensional
 * @param {*} juego 
 * @param {*} posicion 
 * @returns 
 */
function calculoColumna (juego, posicion) {
    let dimension = juego.tablero.dimension;
    let columna = posicion % dimension;
    return columna;
}

/**
 * Construye el nodo de la consola y lo devuelve
 * @returns 
 */
function añadeConsola () {
    let nodoConsola = document.createElement('div');
    nodoConsola.classList.add('consola');
    let nodoH2 = document.createElement('h2');
    nodoConsola.append(nodoH2);
    nodoH2.innerHTML = "Tres en raya";
    return nodoConsola;
}

/**
 * Actualiza las estadisticas de los jugadores y sus partidas ganadas
 * @param {*} juego 
 */
function actualizaEstadisticas (juego) {
    let nodoEstadisticas = document.querySelectorAll('.estadisticas');
    nodoEstadisticas[0].querySelector('.estadisticas__jugador').innerHTML = juego.jugador1.nombre;
    nodoEstadisticas[0].querySelector('.ganadas').innerHTML = juego.jugador1.ganadas;
    nodoEstadisticas[1].querySelector('.estadisticas__jugador').innerHTML = juego.jugador2.nombre;
    nodoEstadisticas[1].querySelector('.ganadas').innerHTML = juego.jugador2.ganadas;
}

/**
 * Centraliza la comprobacion de filas y columnas,
 * devuelve true si encuentra una combinacion ganadora de alguna de las dos
 * @param {*} juego 
 * @param {*} fila 
 * @param {*} columna 
 * @param {*} variableAComparar 
 * @returns 
 */
function compruebaTresEnRaya (juego, fila, columna, variableAComparar) {
    return compruebaFilas(juego, fila, variableAComparar) ||
            compruebaColumnas(juego, columna, variableAComparar) ||
            compruebaDiagonal(juego, variableAComparar);
}

function compruebaDiagonal (juego, variableAComparar) {
    let encontrado = false;
    let i = 0;
    let j = 0;
    while (!encontrado && i < juego.tablero.dimension) {
        while (!encontrado && j < juego.tablero.dimension) {
            if (juego.tablero.tablero[i][j] === variableAComparar) {
                encontrado = compruebaDiagonalDerecha(juego, variableAComparar, i, j) ||
                            compruebaDiagonalIzquierda(juego, variableAComparar, i, j);
            }
            j++;
        }
        j = 0;
        i++;
    }
    return encontrado;
}

function compruebaDiagonalIzquierda (juego, variableAComparar, fila, columna) {
    let encontrado = false;
    let nCasillas = 0;
    while (!encontrado && fila < juego.tablero.dimension && columna >= 0) {
        if (juego.tablero.tablero[fila][columna] === variableAComparar) {
            nCasillas++;
        } else {
            nCasillas = 0;
        } 
        if (nCasillas === WIN_CONDITION) {
            encontrado = true;
        } else {
            fila++;
            columna--;
        }
    }
    return encontrado;
}

function compruebaDiagonalDerecha (juego, variableAComparar, fila, columna) {
    let encontrado = false;
    let nCasillas = 0;
    while (!encontrado && fila < juego.tablero.dimension && columna < juego.tablero.dimension) {
        if (juego.tablero.tablero[fila][columna] === variableAComparar) {
            nCasillas++;
        } else {
            nCasillas = 0;
        } 
        if (nCasillas === WIN_CONDITION) {
            encontrado = true;
        } else {
            fila++;
            columna++;
        }
    }
    return encontrado;
}

/**
 * Comprueba si existe una combinacion ganadora en la fila en la que he hecho click
 * @param {*} juego 
 * @param {*} fila 
 * @param {*} variableAComparar 
 * @returns 
 */
function compruebaFilas (juego, fila, variableAComparar) {
    let encontrado = false;
    let columna = 0;
    let nCasillas = 0;
    while (!encontrado && columna < juego.tablero.dimension) {
        if (juego.tablero.tablero[fila][columna] === variableAComparar) {
            nCasillas++;
        } else {
            nCasillas = 0;
        }
        if (nCasillas === WIN_CONDITION) {
            encontrado = true;
        } else {
            columna++;
        }
    }
    return encontrado;
}

/**
 * Comprueba si existe una combinacion ganadora en la columna en la que he hecho click
 * @param {*} juego 
 * @param {*} columna 
 * @param {*} variableAComparar 
 * @returns 
 */
function compruebaColumnas (juego, columna, variableAComparar) {
    let encontrado = false;
    let fila = 0;
    let nCasillas = 0;
    while (!encontrado && fila < juego.tablero.dimension) {
        if (juego.tablero.tablero[fila][columna] === variableAComparar) {
            nCasillas++;
        } else {
            nCasillas = 0;
        }
        if (nCasillas === WIN_CONDITION) {
            encontrado = true;
        } else {
            fila++;
        }
    }
    return encontrado;
}

/**
 * Reinicio las clases del CSS que se han puesto durante el juego
 */
function reiniciaClases() {
    let nodoCasillas = nodoJuego.querySelectorAll('.casilla');
    for(let i = 0; i < nodoCasillas.length; i++) {
        nodoCasillas[i].classList.remove('activo1');
        nodoCasillas[i].classList.remove('activo2');
    }
}

function reiniciaJuego (juego) {
    juego.reiniciaTablero(TAMAÑO_TABLERO_DEFECTO);
    juego.jugadorActivo = juego.jugador1;
    reiniciaClases();
    actualizaEstadisticas(juego);
}

function inicializaJuego (juego) {
    let nodoJugador = juego.jugadorActivo.pintaJugador();
    let nodoTablero = juego.tablero.pintaTablero();
    let nodoConsola = añadeConsola();
    actualizaEstadisticas(juego);
    nodoTablero.style.setProperty('grid-template-columns', `repeat(${juego.tablero.dimension}, 1fr)`);
    nodoJuego.append(nodoJugador);
    nodoJuego.append(nodoTablero);
    nodoJuego.append(nodoConsola);
}

function actualizaGanadorJuego (juego) {
    if (juego.jugadorActivo === juego.jugador1) {
        juego.jugador1.ganaPartida();
    } else {
        juego.jugador2.ganaPartida();
    }
}

function gestionaColores (nodoJugador, juego) {
    nodoJugador.innerHTML = "Turno de " + juego.jugadorActivo.nombre;
    if (juego.jugadorActivo === juego.jugador1) {
        nodoJugador.classList.remove('jugador2');
        nodoJugador.classList.add('jugador1');
    } else {
        nodoJugador.classList.add('jugador1');
        nodoJugador.classList.add('jugador2');
    }
}

function logicaJuego(juego, fila, columna, variableAComparar, nodoH2){
    juego.tablero.tablero[fila][columna] = variableAComparar;
    if (compruebaTresEnRaya(juego, fila, columna, variableAComparar)) {
        nodoH2.innerHTML = "Ganaste " + juego.jugadorActivo.nombre;
        actualizaGanadorJuego(juego);
        reiniciaJuego(juego);
    } else {
        nodoH2.innerHTML = "Tres en raya";
        juego.cambiaJugadorActivo();
    }
}

function juego () {

    let juego = new Juego (TAMAÑO_TABLERO_DEFECTO, "Jugador 1", "Jugador 2");
    inicializaJuego(juego);

    let nodoConsola = nodoJuego.querySelector('.consola');
    let nodoJugador = nodoJuego.querySelector('.jugador');
    let nodoH2 = nodoConsola.querySelector('h2');

    let nodoCasillas = nodoJuego.querySelectorAll('.casilla');
    for (let i = 0; i < nodoCasillas.length; i++) {
    
        nodoCasillas[i].addEventListener('click', function (){
            let fila = calculoFila(juego, i);
            let columna = calculoColumna(juego, i);
            if (juego.tablero.tablero[fila][columna] !== 0) {
                nodoH2.innerHTML = "Ya está seleccionada";
            } else {
                if (juego.jugadorActivo === juego.jugador1) {
                    nodoCasillas[i].classList.add('activo1');
                    logicaJuego(juego, fila, columna, 1, nodoH2);
                } else {
                    nodoCasillas[i].classList.add('activo2');
                    logicaJuego(juego, fila, columna, 2, nodoH2);
                }
            }
            gestionaColores (nodoJugador, juego);
        });
    }
}

juego();
