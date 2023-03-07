# mic
A voice controllable internet radio station.  [Follow the quickstart](#Developers) to run this project with docker

- [Developers info](#developers)
    - [Quickstart](#quickstart)
    - [Project Directory](#project-directory)
    - [API](#api)
- [Motivation](#motivation)
- [Technologies](#technologies)
- [Features and Bugs](#features-and-bugs)
- [References](#references)

# Developers

## Requirements
- 🐳 [docker](https://www.docker.com/)

## Quickstart
```bash
# Get this project
git clone https://github.com/BarakBinyamin/mic.git
cd mic

# Launch the radio and database on ports 80 & 7700
docker compose up -d 

# Add and play "The Plan" by waveshaper
bash demo.sh
```
```bash
# Test exposing to the internet with localhost.run
ssh -R 80:localhost:80 nokey@localhost.run
```

Goto the [localhost:80](http://localhost:80) or the link provided by localhost.run to see the main page of the radio

## Project Directory
| Name                        | Purpose                              | 
| :--                         | :--                                  |
|[backend](backend)           | Most of the functionality behind this project|
|[library](library)           | Where media lives                    |
|[shortcuts](shortcuts)       | Siri shortcuts for the radio         |
|[view](view)                 | Where the UI is developed            |
|[dockerfile](dockerfile)     | Docker environment setup file        |

## API 
- `/api/add?song=whatever`, trys to find the song and download it to your library from youtube
- `/api/play?song=whatever`, skips whatever the current song is and plays yours
- `/api/queue?song=whatever`, adds song to the queue
- `/api/skip`, skips the current song
- `/api/queuelist`, shows the queue in json format

## Docker
If you want to use docker instead of docker compose...
```bash
# Launch an elastic search database, also exposes a debugging website @ http://localhost:7700
docker network create test-network
docker run --name meili --network test-network -p 7700:7700 -v $PWD/library/meili:/meili_data -d -it getmeili/meilisearch

# Build and run the radio, for a ctrl-c'able mode, switch the -d with -it --init
docker build --tag radio .
docker run -p 80:80 -v ${PWD}/library:/usr/src/library --network test-network -d radio --port 80
```

# Technologies
- 🐳 [Docker](https://www.docker.com/)
- 🚀 [Nodejs](https://nodejs.org/en/)
- 🔍 [Meilisearch](https://www.meilisearch.com/)
- 🎵 [FFmpeg](https://ffmpeg.org/)
- ✨ [Vue](https://vuejs.org/)

# Features and Bugs
### Coming soon
- Synchronized library and meilisearch on startup
- Seperate concerns where possible
- More api docs
- Radio controls UI, with voice over
- Visuals for the aduio 
- Message to let poeple know when song is buffering
- **Up next** on the bottom of the main page
- [Click here](https://raw.githubusercontent.com/Barakvinyamin/mic/main/Demo.mp4) to see a video demo

### Known bugs
- Fix the ratio of mp3 bytes to seconds to prevent stalls
- Handle unlisted youtube videos when auto adding songs
- Colorize text based on background

# Motivation
I enjoy listenting to music, and I wanted to share what I was listening to with my freinds and family.

This project was a also great opportunity to develop an application that was:
- 🐳**Containerized**
- ▼ **Muti-Paradigm**
- ⚡**Blazing Fast**
- 🥪**Full Stack**

# References
- [Streaming music using express js](https://stackoverflow.com/questions/74751390/what-is-the-best-way-to-stream-audio-to-the-browser-chunk-by-chunk-with-javacr)
- [Fireship](https://www.youtube.com/@Fireship) - Learn the basics to many enabling technologies with addicting 100 second clips