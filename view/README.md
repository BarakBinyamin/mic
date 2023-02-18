## References
- [Stack overflow: Visaulize aduio stream with html and javascript](https://stackoverflow.com/questions/44479560/creating-an-audio-visualizer-using-html5)
- [Visualize audio](https://blog.logrocket.com/audio-visualizer-from-scratch-javascript/)

## How to make a gif using ffmpeg
```
ffmpeg -i /Users/mbinyamin/Downloads/mic.mp4 -vf "fps=10,scale=1000:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 /Users/mbinyamin/Downloads/mic.gif
```