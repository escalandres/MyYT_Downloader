# Descripcion

La aplicación puede descargar videos de Youtube en formato *.mp4* y - .mp3 -, solamente se necesita la URL del video a descargar.
Primero se comprueba si el video existe; y en caso de que exista, se habilitan el boton de descarga y el selector de opciones de la descarga.

## Ruta de los archivos

Los archivos se guardan en el directorio `C:Users\{user}\Documents\MyYT_Downloader`. La aplicación crea el directorio si ésta no existe.

# Especificaciones

La aplicación está desarrollada con NodeJS, y empaquetada con Electron JS. Y, está basada en una aplicación web creada con NodeJS.

Las calidades de video que se manejan son:

1. 720p o 1080p como calidad alta
2. 480p como calidad media
3. 360p como calidad baja

Los archivos descargados se guardan con el mismo nombre del video de YouTube.

Al descargar un video con audio, tome en cuenta que la descarga demora un tiempo mayor en comparación con la descarga de solo video o solo audio.
Espere hasta que la animación de carga concluya.

# Version 1.3.0 Release

La aplicación cuenta con un sistema de alertas interno y externo. Utiliza un toast para las alertas dentro de la aplicación, y envía alertas al
sistema de notificaciones de Windows al terminar una descarga.

Solamente se pueden descargar archivos en formato .mp4 y .mp3; tampoco se puede modificar la ruta de las descargas.
