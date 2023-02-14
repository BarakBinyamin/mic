# Backend 
Traditionally programs like icecast are used to to mix and stream audio, but this project takes a new approach

### Directory
| Name                         | Purpose                              | 
| :--                          | :--                                  |
|[api](api)                   | Exposes controls for the application |
|[data-schemas](data-schemas) | Templates and setup scripts for data schemas|
|[multimedia](multimedia)     | Tools for coverting overlaying and filtering media |
|[player](player)             | Abstract version of a record player|           
|[scrapers](scrapers)         | Scripts to pull song data from the internet |
|[index.js](index.js)         | Main script, serves the whole app  |

## Resources
- [Stack Overflow: stream audio in javascript](https://stackoverflow.com/questions/74751390/what-is-the-best-way-to-stream-audio-to-the-browser-chunk-by-chunk-with-javacr)