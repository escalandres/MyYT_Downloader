var themeToggle = document.getElementById('theme-toggle');
var body = document.body;
var navbar = document.getElementById('navbar-id');
var darkTheme = false;
// Obtén referencia al elemento panel
var panel = document.getElementById("panel");


function notification(title,message){
    // Verificar si el navegador admite la API de notificaciones
    if ("Notification" in window) {
        // Solicitar permiso al usuario para mostrar notificaciones
        Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            // Crear una nueva notificación
            var notification = new Notification(title, {
                body: message
            });
    
            // Manejar el evento de clic en la notificación
            notification.onclick = function () {
                console.log("La notificación fue clicada.");
            };

            // Cerrar la notificación después de 2 segundos
            setTimeout(function() {
                notification.close();
            }, 3000);
        }
        });
    }
}

function toast(message){
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    const toastBody = document.getElementById('toast-body')
    toastBody.innerText = message;
    toast.show()
}

// Función para mostrar el panel
function showLoading() {
    panel.style.display = "";
}

// Función para ocultar el panel
function hideLoading() {
    panel.style.display = "none";
}

// Ejemplo de uso
//mostrarPanel();

function cleanInputs(){
    document.getElementById('videoUrl').value = '';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('options-container').style.display = 'none';
}

//--------------------- Eventos-----------------------
document.addEventListener("DOMContentLoaded", function() {
    // Código a ejecutar cuando el DOM ha sido cargado completamente
    // mostrarPanel();
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});

themeToggle.addEventListener('click', function() {
    darkTheme = !darkTheme;
    body.classList.toggle('dark-theme');
    navbar.classList.toggle('dark-theme');
});

window.addEventListener("online", function(){
    // alert("¡Estás conectado a Internet!");
    toast("¡Estás conectado a Internet!")
    document.getElementById('searchBtn').disabled = false;
});

window.addEventListener("offline", function(){
    // alert("¡Se perdió la conexión a Internet!");
    toast("¡Se perdió la conexión a Internet!")
    document.getElementById('searchBtn').disabled = true;
});

// btn.addEventListener('click', function(){
//     showLoading();
// })

document.getElementById('search-video__form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    showLoading();
    // Obtener los datos del formulario
    const form = event.target;
    const url = form.elements.videoUrl.value;
    toast(url)
    // Realizar la solicitud POST
    fetch('http://localhost:52345/search-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        hideLoading()
        if(data.estatus){
            // Hacer algo con la respuesta recibida
            document.getElementById('downloadBtn').disabled = false;
            document.getElementById('options-container').style.display = '';
        }
        toast(data.message);
    })
    .catch(error => {
        hideLoading()
        console.log(error)
        console.error('Error al hacer la solicitud POST: ' + error);
        // Manejar el error
        toast(error);
    });
});

document.getElementById('downloadBtn').addEventListener('click', function(e){
    e.preventDefault();
    showLoading()
    try{
        const data = {
            url: document.getElementById('videoUrl').value,
            option: document.querySelector('input[name="downloadOptions"]:checked').value
        }
        fetch('http://localhost:52345/download-video', {
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
    catch(error){
        toast('Ocurrió un error: ' + error);
    }
    
})


function test(){
    showLoading();

    fetch('http://localhost:52345/test')
    .then(response => response.json())
    .then(data => {
        hideLoading();
        console.log(data); // Aquí puedes hacer algo con los datos recibidos del servidor
        hideLoading()
        toast(data.message)
    })
    .catch(error => {
        hideLoading();
        console.error('Error al realizar la solicitud:', error);
        toast(error)
    });
    
}