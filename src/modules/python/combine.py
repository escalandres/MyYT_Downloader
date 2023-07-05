from moviepy.editor import VideoFileClip, AudioFileClip
import os

# Obtener la ruta actual del archivo
# ruta_actual = os.path.abspath(__file__)
# print("ruta_actual: " + ruta_actual)
# Obtener la ruta subiendo tres niveles en la jerarquía de carpetas
# ruta_superior = os.path.abspath(os.path.join(ruta_actual, "../../../../"))

# print("ruta_superior: " + ruta_superior)
# print("Ruta actual:", ruta_actual)
# print("Ruta superior:", ruta_superior)

# Obtener la ruta de la carpeta actual
# ruta_actual = os.getcwd()

# # Imprimir el contenido de la carpeta actual
# contenido = os.listdir(ruta_actual)

# for archivo in contenido:
#     print(archivo)

rutaCarpetaDocuments = os.path.join(os.path.expanduser('~'), 'Documents')
rutaCarpetaDownloader = os.path.join(rutaCarpetaDocuments, 'MyYT_Downloader')

video_file = os.path.join(rutaCarpetaDownloader,"video.mp4")
print(video_file)
audio_file = os.path.join(rutaCarpetaDownloader,"audio.mp3")
output_file = os.path.join(rutaCarpetaDownloader,"output.mp4")

# video_file = ruta = os.path.join(ruta_superior, "temp", "video.mp4")
# audio_file = ruta = os.path.join(ruta_superior, "temp", "audio.mp3")
# output_file = ruta = os.path.join(ruta_superior, "temp", "output.mp4")

video = VideoFileClip(video_file)
audio = AudioFileClip(audio_file)

final_clip = video.set_audio(audio)
final_clip.write_videofile(output_file, codec='libx264')
