var themeToggle = document.getElementById('theme-toggle');
var body = document.body;
var navbar = document.getElementById('navbar-id');

themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    navbar.classList.toggle('dark-theme');
});