# mic
A cool web radio station with a siri accessible command api to add, enque, and skip songs

## Quickstart
```bash
# Get this project
git clone https://github.com/BarakBinyamin/mic.git
cd mic

# Launch an elastic search database, also exposes a debugging website @ http://localhost:7700
docker network create test-network
docker run --name meili --network test-network -p 7700:7700 -v $PWD/library/meili:/meili_data -d -it getmeili/meilisearch

# Build and run the radio, for a ctrl-c'able mode, switch the -d with -it --init
docker build --tag radio .
docker run -d -p 3000:3000 -v ${PWD}/library:/usr/src/library --network test-network radio

# Expose to the internet with localhost.run
ssh -R 80:localhost:3000 nokey@localhost.run
```

Goto the [localhost:3000](http://localhost:3000) or the link provided by localhost.run to see the main page of the radio

## Directory
| Name                         | Purpose                              | 
| :--                          | :--                                  |
|[backend](backend)           | Most of the functionality behind this project|
|[view](view)                 | Where the UI is developed            |
|[library](library)           | Where media lives                    |
|[dockerfile](dockerfile)     | Docker environment setup file        |

## API
Testing api routes
- `/api/add?song=whatever`, trys to find the song and download it to your library from youtube
- `/api/play?song=whatever`, skips whatever the current song is and plays yours
- `/api/queue?song=whatever`, adds song to the queue
- `/api/skip`, skips the current song
- `/api/listqueue`, shows the queue in json format

## Technologies
- docker
- nodejs
- meilisearch
- ffmpeg
- vue

## Coming soon
- synchronized library and meilisearch on startup
- siri shortcuts & shortcut setup
- seperate concerns where possible
- more api docs
- radio controls UI
- audio visual

