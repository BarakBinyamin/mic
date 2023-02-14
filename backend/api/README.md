# API 
Exposes controls for the application 

- `/nowPlaying`, mp3 stream of whats playing
- `/play?song=whatever`, replace current song
- `/queuelist`, shows the queue
- `/skip`, skip the current song
- `/add?song=whatever`, trys to find the song on youtube and download it to your library
- `/img?id=songid`, returns the image associated with the song
- `/search?song=whatever`, searches through library for a song
- `/songinfo?id=songid`, gives info for one song by id

ffmpeg -i /Users/mbinyamin/Downloads/mic.mp4 -vf "fps=10,scale=1000:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 /Users/mbinyamin/Downloads/mic.gif

    ffmpeg -i /Users/mbinyamin/Downloads/mic.mp4 /Users/mbinyamin/Downloads/mic.gif