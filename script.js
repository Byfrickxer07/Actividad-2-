const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
    "Octubre", "Noviembre", "Diciembre"];
const datesContainer = document.getElementById("dates");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


const feriadosNacionales = {
    2025: [
        { mes: 1, dia: 1, tipo: "Feriado Nacional", nombre: "Año Nuevo", descripcion: "¡Feliz Año Nuevo!", imagen: "año_nuevo.jpg" },
        { mes: 3, dia: 3, tipo: "Feriado Nacional", nombre: "Carnaval", descripcion: "Celebración de Carnaval.", imagen: "carnaval.jpg" },
        { mes: 3, dia: 4, tipo: "Feriado Nacional", nombre: "Carnaval", descripcion: "Último día de Carnaval.", imagen: "carnaval.jpg" },
        { mes: 3, dia: 24, tipo: "Feriado Nacional", nombre: "Día de la Memoria", descripcion: "Día Nacional de la Memoria por la Verdad y la Justicia.", imagen: "memoria.jpg" },
        { mes: 4, dia: 17, tipo: "Feriado Nacional", nombre: "Jueves Santo", descripcion: "Jueves de la Semana Santa.", imagen: "semana_santa.jpg" },
        { mes: 4, dia: 18, tipo: "Feriado Nacional", nombre: "Viernes Santo", descripcion: "Viernes Santo, conmemoración de la crucifixión.", imagen: "semana_santa.jpg" },
        { mes: 4, dia: 2, tipo: "Feriado Nacional", nombre: "Día del Veterano", descripcion: "Día del Veterano y de los Caídos en la Guerra de Malvinas.", imagen: "malvinas.jpg" },
        { mes: 5, dia: 1, tipo: "Feriado Nacional", nombre: "Día del Trabajador", descripcion: "Conmemoración del Día Internacional del Trabajador.", imagen: "trabajador.jpg" },
        { mes: 5, dia: 25, tipo: "Feriado Nacional", nombre: "Día de la Revolución de Mayo", descripcion: "Celebración de la Revolución de Mayo de 1810.", imagen: "revolucion_mayo.jpg" },
        { mes: 6, dia: 17, tipo: "Feriado Nacional", nombre: "Paso a la Inmortalidad de Güemes", descripcion: "Homenaje al General Martín Miguel de Güemes.", imagen: "guemes.jpg" },
        { mes: 6, dia: 20, tipo: "Feriado Nacional", nombre: "Día de la Bandera", descripcion: "Celebración del Día de la Bandera Argentina.", imagen: "bandera.jpg" },
        { mes: 7, dia: 9, tipo: "Feriado Nacional", nombre: "Día de la Independencia", descripcion: "Conmemoración de la Declaración de la Independencia.", imagen: "independencia.jpg" },
        { mes: 8, dia: 17, tipo: "Feriado Nacional", nombre: "Paso a la Inmortalidad de San Martín", descripcion: "Homenaje al General José de San Martín.", imagen: "san_martin.jpg" },
        { mes: 10, dia: 13, tipo: "Feriado Nacional", nombre: "Día del Respeto a la Diversidad Cultural", descripcion: "Celebración de la diversidad cultural.", imagen: "diversidad.jpg" },
        { mes: 11, dia: 20, tipo: "Feriado Nacional", nombre: "Día de la Soberanía Nacional", descripcion: "Conmemoración del Día de la Soberanía Nacional.", imagen: "soberania.jpg" },
        { mes: 12, dia: 8, tipo: "Feriado Nacional", nombre: "Inmaculada Concepción", descripcion: "Celebración de la Inmaculada Concepción de María.", imagen: "inmaculada.jpg" },
        { mes: 12, dia: 25, tipo: "Feriado Nacional", nombre: "Navidad", descripcion: "Celebración del nacimiento de Jesús.", imagen: "navidad.jpg" },
        
        { mes: 3, dia: 21, tipo: "Puente Turístico", nombre: "Puente Turístico", descripcion: "Día no laborable con fines turísticos.", imagen: "turismo.jpg" },
        { mes: 10, dia: 10, tipo: "Puente Turístico", nombre: "Puente Turístico", descripcion: "Día no laborable con fines turísticos.", imagen: "turismo.jpg" },
    ],
};

function loadCalendar(month = currentMonth, year = currentYear) {
    datesContainer.innerHTML = "";
    document.getElementById("month").textContent = monthNames[month];
    document.getElementById("year").textContent = year;

    let firstDay = new Date(year, month, 1).getDay();
    let totalDays = new Date(year, month + 1, 0).getDate();

    const notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};

    for (let i = 1; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("day", "empty");
        datesContainer.appendChild(emptyDiv);
    }

    for (let i = 1; i <= totalDays; i++) {
        const dayButton = document.createElement("button");
        dayButton.classList.add("day");
        dayButton.textContent = i;

        let today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayButton.classList.add("today");
        }

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (notes[dateString] && notes[dateString].length > 0) {
            dayButton.classList.add("has-note");
        }

        const feriadosDelMes = feriadosNacionales[year] || [];
        const diaEsFeriado = feriadosDelMes.find(feriado => feriado.mes === month + 1 && feriado.dia === i);

        if (diaEsFeriado) {
            dayButton.classList.add(diaEsFeriado.tipo.toLowerCase().replace(/\s/g, '-'));
            const tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.textContent = diaEsFeriado.nombre;
            dayButton.appendChild(tooltip);

            dayButton.addEventListener("click", () => {
                openModalInfo(diaEsFeriado);
            });
        } else {
            dayButton.addEventListener("click", () => {
                openNoteModal(dateString);
            });
        }

        datesContainer.appendChild(dayButton);
    }
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar(currentMonth, currentYear);
});

document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentMonth, currentYear);
});


const noteModal = document.getElementById("noteModal");
const noteDateDisplay = document.getElementById("noteDate");
const noteTextArea = document.getElementById("noteText");
const saveNoteButton = document.getElementById("saveNote");
const deleteNoteButton = document.getElementById("deleteNote");
const closeNoteModalButton = document.getElementById("closeNoteModal");

let currentNoteDate = null;

function openNoteModal(dateString) {
    currentNoteDate = dateString;
    noteDateDisplay.textContent = `Notas para el ${dateString}`;
    const notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
    noteTextArea.value = notes[dateString] ? notes[dateString].join('\n') : '';
    deleteNoteButton.style.display = notes[dateString] ? 'inline-block' : 'none';
    noteModal.style.display = "block";
}

closeNoteModalButton.addEventListener("click", () => {
    noteModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == noteModal) {
        noteModal.style.display = "none";
    }
});

saveNoteButton.addEventListener("click", () => {
    const noteText = noteTextArea.value.trim();
    const notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
    if (noteText) {
        notes[currentNoteDate] = [noteText];
    } else {
        delete notes[currentNoteDate];
    }
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
    loadCalendar(currentMonth, currentYear);
    noteModal.style.display = "none";
});

deleteNoteButton.addEventListener("click", () => {
    const notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
    delete notes[currentNoteDate];
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
    noteTextArea.value = '';
    deleteNoteButton.style.display = 'none';
    loadCalendar(currentMonth, currentYear);
});


function openModalInfo(feriado) {
    const modal = document.getElementById("eventModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalImage = document.getElementById("modalImage");

    modalTitle.textContent = feriado.nombre;
    modalDescription.textContent = feriado.descripcion;
    modalImage.src = feriado.imagen ? feriado.imagen : "";
    modal.style.display = "block";
}


function closeModalInfo() {
    const modal = document.getElementById("eventModal");
    modal.style.display = "none";
}


window.onclick = function(event) {
    const modal = document.getElementById("eventModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function openAddEventModal(dateString) {
    currentNoteDate = dateString;
    noteDateDisplay.textContent = `Agregar evento para el ${dateString}`;
    noteTextArea.value = ''; 
    deleteNoteButton.style.display = 'none'; 
    saveNoteButton.textContent = 'Guardar Evento';
    noteModal.style.display = "block";
}


for (const day of document.querySelectorAll('.day:not(.empty)')) {
    day.addEventListener('click', function() {
        const year = parseInt(document.getElementById('year').textContent);
        const month = monthNames.indexOf(document.getElementById('month').textContent);
        const dayOfMonth = parseInt(this.textContent);
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
        openAddEventModal(dateString);
    });
}


document.getElementById("prev-month").addEventListener("click", () => {
   
    setTimeout(() => { 
        attachDayClickListeners();
    }, 0);
});

document.getElementById("next-month").addEventListener("click", () => {
  
    setTimeout(() => { 
        attachDayClickListeners();
    }, 0);
});

function attachDayClickListeners() {
    for (const day of document.querySelectorAll('.day:not(.empty)')) {
        day.removeEventListener('click', function() { });
        day.addEventListener('click', function() {
            const year = parseInt(document.getElementById('year').textContent);
            const month = monthNames.indexOf(document.getElementById('month').textContent);
            const dayOfMonth = parseInt(this.textContent);
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
            openAddEventModal(dateString);
        });
    }
}


setTimeout(attachDayClickListeners, 0);

loadCalendar();