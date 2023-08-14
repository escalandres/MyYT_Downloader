const fs = require('fs');
const path = require('path');

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  const envValueInput = document.getElementById('envValue');

  saveButton.addEventListener('click', () => {
    const newValue = envValueInput.value;
    if (newValue) {
      const envFilePath = path.join(__dirname, '.env'); // Cambia la ruta a donde esté tu archivo .env

      fs.writeFile(envFilePath, `MY_ENV_VAR=${newValue}\n`, (err) => {
        if (err) {
          console.error('Error al guardar en el archivo .env:', err);
        } else {
          console.log('Archivo .env actualizado correctamente.');
        }
      });
    }
  });
});
