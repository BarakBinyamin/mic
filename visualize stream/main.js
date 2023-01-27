window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');
    // loop
    // function renderFrame() {
    //     var array = new Uint8Array(analyser.frequencyBinCount);
    //     analyser.getByteFrequencyData(array);
    //     var step = Math.round(array.length / meterNum); //sample limited data from the total array
    //     ctx.clearRect(0, 0, cwidth, cheight);
    //     for (var i = 0; i < meterNum; i++) {
    //         var value = array[i * step];
    //         if (capYPositionArray.length < Math.round(meterNum)) {
    //             capYPositionArray.push(value);
    //         };
    //         ctx.fillStyle = capStyle;
    //         //draw the cap, with transition effect
    //         if (value < capYPositionArray[i]) {
    //             ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
    //         } else {
    //             ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
    //             capYPositionArray[i] = value;
    //         };
    //         ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
    //         ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
    //     }
    //     requestAnimationFrame(renderFrame);
    // }
    analyser.fftSize = 2048;
    const WIDTH = 100;
    const HEIGHT = 100;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    function draw() {
        const drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.beginPath();
        const sliceWidth = WIDTH / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (HEIGHT / 2);
        
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        
            x += sliceWidth;
        }
        ctx.lineTo(WIDTH, HEIGHT / 2);
        ctx.stroke();
    }
    draw()
    //renderFrame();
    audio.play();
};