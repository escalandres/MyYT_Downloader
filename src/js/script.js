var themeToggle = document.getElementById('theme-toggle');
var body = document.body;
var navbar = document.getElementById('navbar-id');
var darkTheme = false;
function showNotification(title,message){
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

            // Cerrar la notificación después de 3 segundos
            setTimeout(function() {
                notification.close();
            }, 2000);
        }
        });
    }
}

function showToast(){
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}

// Obtén referencia al elemento panel
var panel = document.getElementById("panel");

// Función para mostrar el panel
function mostrarPanel() {
  panel.style.display = "block";
}

// Función para ocultar el panel
function ocultarPanel() {
  panel.style.display = "none";
}

// Ejemplo de uso
//mostrarPanel();


//--------------------- Eventos-----------------------
document.addEventListener("DOMContentLoaded", function() {
    // Código a ejecutar cuando el DOM ha sido cargado completamente
    // mostrarPanel();
  });
themeToggle.addEventListener('click', function() {
    darkTheme = !darkTheme;
    body.classList.toggle('dark-theme');
    navbar.classList.toggle('dark-theme');
    if(darkTheme) showNotification("Tema", "Se activó el tema oscuro")
    else showNotification("Tema", "Se activó el tema claro")

    showToast()
});

window.addEventListener("online", function(){
    alert("¡Estás conectado a Internet!");
});
window.addEventListener("offline", function(){
    alert("¡Se perdió la conexión a Internet!");
});

var btn = document.getElementById('btn-id')

btn.addEventListener('click', function(){
    mostrarPanel();
})
