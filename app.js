new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        ataqueEspecialUsado: false
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.turnos = [];
            this.hayUnaPartidaEnJuego=true;
            this.saludJugador=100;
            this.saludMonstruo=100;
            this.ataqueEspecialUsado=false;
        },
        atacar: function () {
            let damage = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                text: "El jugador golpea al monstruo por " + damage
            });
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            if (this.ataqueEspecialUsado) {
                this.registrarEvento({
                    esJugador: true,
                    text: "NO HAY NAFTA"
                })
                return;
            }
            this.ataqueEspecialUsado=true;
            let damage = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                text: "El jugador hace un kamehameha por " + damage
            })            
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if (this.saludJugador <= 90) {
                this.saludJugador += 10;
            } else {
                this.saludJugador = 100;
            }
            this.registrarEvento({
                esJugador: true,
                text: "El jugador recibe la Sputnik V"
            })            
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego=false;
            this.registrarEvento({
                esJugador: true,
                text: "GAME OVER!"
            })
        },

        ataqueDelMonstruo: function () {
            let damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= damage;
            this.registrarEvento({
                esJugador: false,
                text: "El monstruo lastima al jugador en " + damage
            })
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            let [min, max] = rango;            
            return Math.max(Math.floor(Math.random()*max)+1,min)
        },
        verificarGanador: function () {
            if (this.saludMonstruo<=0) {
                if (confirm('Ganaste! Jugar denuevo?')) {
                    this.empezarPartida();
                } else {
                    this.terminarPartida();
                }
                return true;
            } else if (this.saludJugador <= 0) {
                if (confirm("Perdiste! jugar denuevo?")) {
                    this.empezarPartida();
                } else {
                    this.terminarPartida();
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});