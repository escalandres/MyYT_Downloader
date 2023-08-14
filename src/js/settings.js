document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const envValueInput = document.getElementById('envValue');
  
    saveButton.addEventListener('click', () => {
      const newValue = envValueInput.value;
      if (newValue) {
        fetch('http://localhost:52345/path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta:', data);
            // Hacer algo con la respuesta recibida
            hideLoading();
            toast(data.message);
            notification('MyYT_Downloader', 'Descarga completada')
            cleanInputs();
        })
        .catch(error => {
            hideLoading()
            console.error('Error al hacer la solicitud POST:', error);
            // Manejar el error
            toast(data.message);
            
        });
      }
    });
  });
  