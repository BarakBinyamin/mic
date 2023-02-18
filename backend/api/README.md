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