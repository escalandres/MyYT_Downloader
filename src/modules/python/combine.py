from moviepy.editor import VideoFileClip, AudioFileClip

video_file = "./temp/video.mp4"
audio_file = "./temp/audio.mp3"
output_file = "./temp/output.mp4"

video = VideoFileClip(video_file)
audio = AudioFileClip(audio_file)

final_clip = video.set_audio(audio)
final_clip.write_videofile(output_file, codec='libx264')
