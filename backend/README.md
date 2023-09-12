# Backend 
Traditionally programs like icecast are used to to mix and stream audio. This project uses nodejs express to rate limit audio so the feed can be altered before its sent out, but in the future will use websockets and prefetching to control flow improve quality of service

### Directory
| Name                        | Purpose                              | 
| :--                         | :--                                  |
|[api](api)                   | Exposes controls for the application |
|[data-schemas](data-schemas) | Templates and setup scripts for data schemas       |
|[multimedia](multimedia)     | Tools for coverting overlaying and filtering media |
|[player](player)             | Abstract version of a record player                |  
|[scrapers](scrapers)         | Scripts to pull song stuff from the internet       |
|[index.js](index.js)         | Main script, serves the whole app    |

## What adding a song looks like
1. Look up if a song is on genius.com (imfeelinglucky)
2. Scrape the data from genius, usually comes with a youtube link
3. Download the song in m4a format from youtube using a youtube link
4. Convert to mp3 and wav file for any other purposes (like streaming to browsers or embedded devices)
5. Add all the metadata to the m4a with atomicParsley

## TODO: Accept voice over
1. Recieve and record new channel of voice
    1. Instead of mixing second per second send a websockets signal to pickup a new stream and start playing it  
    2. The other way would be realtime mixing with ffmpeg
2. Handle missing song data, currently setnowplaying just errors out server never responds
3. Handle long add song time, timeout client

## TODO: Skip/Play Next & Fix Buffering 
Audio needs to be buffered because theres so much data.
- To get the effect of an instant skip we can prefetch our next song, and use websockets to notify the webpage to switch streams, like we do for the UI and the album art.
- At that point the next next song needs to be prefetched


## Resources
- [Stack Overflow: stream audio in javascript](https://stackoverflow.com/questions/74751390/what-is-the-best-way-to-stream-audio-to-the-browser-chunk-by-chunk-with-javacr)
