//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Eventos
EventListeners();

function EventListeners () {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuestoNumber = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    agregarGasto(gastoOBJ) {
        this.gastos = [...this.gastos, gastoOBJ];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastadoTotal = this.gastos.reduce((total, gasto) => total + gasto.cantidad,0);
        this.restante = this.presupuestoNumber - gastadoTotal;
    //otra forma, eliminado el proceso de reduce
    //this.restante -= gastoOBJ.cantidad;
    }

    BorrarGasto(id) {
        presupuesto.gastos = presupuesto.gastos.filter(e => e.id !== id);
        this.calcularRestante();
        const {gastos, restante, presupuestoNumber} = presupuesto;
        ui.insertarPresupuesto(presupuesto);
        ui.ImprimirGastos(gastos);
        ui.Mensaje("Se eliminó correctamente");
        ui.colorRestante(presupuestoNumber, restante);
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
    //extrayendo los valores de presupuesto
        const {presupuestoNumber, restante} = cantidad;
        document.querySelector("#total").textContent = presupuestoNumber;
        document.querySelector("#restante").textContent = restante;
    }
    ImprimirGastos( gastosArray ) {
        limpiarHTML();
        gastosArray.forEach((gastoObjeto) => {
            let {gasto, cantidad, id} = gastoObjeto;

            //Crear li
            const li = document.createElement("li");
            li.className =  "list-group-item d-flex justify-content-between align-items-center";
            li.dataset.id = id;

            //agregarle el HTML
            li.innerHTML = `${gasto} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

            //Btn para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "&times";
            btnBorrar.onclick = () => {
                presupuesto.BorrarGasto(id);
            };
            li.appendChild(btnBorrar);

            //insertar HTML
            gastoListado.appendChild(li);
        });
    }

    //Imprime mensaje verde y rojo
    Mensaje(mensaje, tipo) {
        const msj = document.querySelectorAll(".msj");
        const p = document.createElement("P");
        if (msj.length === 0) {
            if (tipo === "error") {
                p.classList.add("alert", "alert-danger", "mt-4" , "msj");
            } else {
                p.classList.add("alert", "alert-success", "mt-4");
            }
            p.textContent = mensaje ;
            document.querySelector(".contenido").insertBefore(p, formulario);
            setTimeout(() => {
                p.remove();
            }, 2000);
        }
    }

    colorRestante(presupuesto, restante) {
        const restanteCuadro = document.querySelector(".restante");

        if(restante > (presupuesto * 0.75)) {
            restanteCuadro.className = "restante alert alert-success";
        }else if (restante > (presupuesto * 0.25)) {
            restanteCuadro.className = "restante alert alert-warning";
        } else {
            restanteCuadro.className = "restante alert alert-danger";
        }

        const button = document.querySelector('.btn.btn-primary');
        if (restante < 0) {
            button.disabled = true;
            this.Mensaje("El presupuesto se ha agotado", "error");
        } else {
            button.disabled = false;
        }
    }
}
//_________________________________________________________________________________________;

//Instancia
const ui = new UI();
let presupuesto;


//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = Number(prompt("¿Cual es tu presupuesto?"));
    if ( presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto (e) {
    e.preventDefault();
    let gasto = document.querySelector("#gasto").value.toString();
    let cantidad = document.querySelector("#cantidad").value;

    if(gasto === "" ||  cantidad === "") {
        ui.Mensaje("Debe rellenar ambos cambos", "error");
        return;
    }
    else if (isNaN(cantidad) || cantidad <=0) {
        ui.Mensaje("La cantidad ingresada no es un número", "error");
        return;
    }

    ui.Mensaje("Gasto añadido al listado");
    formulario.reset();

    //Crear Gasto
    const gastoObjeto = {gasto, cantidad: Number(cantidad), id: Date.now()};

    //Calcula el restante en base a los gastos del array Gastos
    presupuesto.agregarGasto(gastoObjeto);

    //Inserta el presupuesto actualizado
    let {gastos, restante, presupuestoNumber} = presupuesto;
    ui.insertarPresupuesto(presupuesto);
    ui.colorRestante(presupuestoNumber, restante );
    //Imprime HTML de los gastos
    ui.ImprimirGastos(gastos);
}

function limpiarHTML() {
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
}

//con Spread Operator generas un nuevo arreglo, sin modificar el arreglo original.

