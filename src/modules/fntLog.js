const fs = require('fs');
const path = require('path');

function getDate(){
    const fechaActual = new Date();

    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();

    console.log(`Fecha actual: ${dia}/${mes}/${anio}`);
    return `${dia}_${mes}_${anio}`
}

function guardarEnLog(archivo,metodo,mensaje) {
    const fechaHoraActual = new Date();
    const fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES', {
        timeZone: 'America/Mexico_City', // Ajusta la zona horaria según tu ubicación
        hour12: false,
    });

    const logMensaje = `[${fechaHoraFormateada}] - "Archivo: ${archivo}. Metodo: ${metodo}. Mensaje: ${mensaje}"\n`;
    const file = path.join(__dirname, '../../log','log_' + getDate() + '.txt')
    fs.appendFile(file, logMensaje, (error) => {
        if (error) {
            console.error('Error al guardar en el archivo log.txt:', error);
        } else {
            console.log('Mensaje guardado en log.txt correctamente.');
        }
    });
}

// Ejemplo de uso:
// const mensajeError = 'Mensaje de Error...';
// guardarEnLog('fntLog.js', 'guardarEnLog', mensajeError);

module.exports = {
    guardarEnLog
}