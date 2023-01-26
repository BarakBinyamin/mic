# mic
A cool web radio station with a siri accessible command api to enque and skip songs

## Quickstart
```bash
# Launch elastic search database
docker network create test-network
docker run --name meili --network test-network -p 7700:7700 -d -it getmeili/meilisearch

# Build and run the radio 
docker build --tag radio .
docker run -it --init -p 3000:3000 -v ${PWD}/library:/usr/src/library --network test-network radio

# Expose to the internet with localhost.run
ssh -R 80:localhost:8080 nokey@localhost.run
```

## Technologies
- docker
- nodejs
- meilisearch
- ffmpeg
- vue

## Resources
- [Desgin Explained](READMORE.md)