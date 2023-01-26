# Multimedia
All modules related to coverting overlaying and filtering media, powered by ffmpeg.

## Notes
The following media characteristics need to be maintained for an audio stream to be accepted by a browser
- bitrate
- mpeg version (mp3/m4a)

## FFMPEG hacks
### Cut Audio
[Stack Overflow: using-ffmpeg-to-cut-audio-from-to-position](https://stackoverflow.com/questions/46508055/using-ffmpeg-to-cut-audio-from-to-position)
```bash
ffmpeg -ss start_second -to end_second -i input.mp3 output.mp3
```
### Merge Audio with delay
[Stack Overflow: ffmpeg-mix-audio-at-specific-time](https://stackoverflow.com/questions/32949824/ffmpeg-mix-audio-at-specific-time)
```bash
ffmpeg -y -i earth.mp4 -i 1.wav -i 2.wav -i 3.wav -filter_complex "[1]adelay=delays=5s:all=1[r1]; [2]adelay=delays=8000S:all=1[r2]; [3]adelay=delays=15s:all=1[r3]; [r1][r2][r3]amix=inputs=3[a]"  -map 0:v -map "[a]" -codec:v copy output.mp4
```
or simpler, this scales too
[Stack Overflow: merge audio with delay](https://stackoverflow.com/questions/65488904/merge-both-audio-with-delay-use-ffmpeg)
```bash
ffmpeg -i base.mp3 -i 1.mp3 -i 2.mp3 -filter_complex "[1:a]adelay=12s:all=1[delay1]; [2:a]adelay=12s:all=1[delay2]; [0:a][delay1][delay2]amix=inputs=3[out]" -map "[out]" output.mp3
```
### Merge Cut Audio
This scales too
```bash
ffmpeg -y -ss 20 -to 25 -i a.mp3 -ss 20 -to 25 -i b.mp3 -filter_complex "[0][1]amix=inputs=2[out]" -map "[out]" -codec:v copy output.mp3
```
### Get input from std in
[Stack Overflow: ffmpeg input from stdin](https://stackoverflow.com/questions/45899585/pipe-input-in-to-ffmpeg-stdin)
```bash
ffmpeg -i pipe:0 somefile.mp3
```
### Put output in std out
[Super User: ffmpeg output to stdout](https://superuser.com/questions/322216/how-can-i-pipe-output-of-ffmpeg-to-ffplay)
```bash
ffmpeg -i somefile.mp3 -f avi pipe:1
```

## maybes
### mix
https://stackoverflow.com/questions/14498539/how-to-overlay-downmix-two-audio-files-using-ffmpeg
### mix at position