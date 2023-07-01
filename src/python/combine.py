from moviepy.editor import VideoFileClip, AudioFileClip

video_file = "video.mp4"
audio_file = "audio.mp3"
output_file = "output.mp4"

video = VideoFileClip(video_file)
audio = AudioFileClip(audio_file)

final_clip = video.set_audio(audio)
final_clip.write_videofile(output_file, codec='libx264')
