const fs = require("fs");
const request = require("request");
const lpcm16 = require("node-record-lpcm16");
const randomstring = require("randomstring");
const config = require("./config.json");

//request.debug = true;

let pair = randomstring.generate({length: 16, charset: "hex", capitalization: "uppercase"});

//Start the microphone
const mic = lpcm16.start({
  sampleRateHertz: 16000,
  threshold: 0,
  verbose: false,
  silence: '10.0',
  device: 'plughw:2,0'
});

//Start the uploading (speech) stream:
let upOptions = {
  url: `https://www.google.com/speech-api/full-duplex/v1/up?key=${config.key}&pair=${pair}&output=pb&lang=en-US&app=chromium&interim&continuous`,
  headers: {
    "Content-Type": "audio/l16; rate=16000",
    "Referer": "https://docs.google.com"
  }
}
mic.pipe(request.post(upOptions));
//fs.createReadStream('test.wav').pipe(request.post(upOptions));

//Start the downloading (text) stream:
request.get(`https://www.google.com/speech-api/full-duplex/v1/down?key=${config.key}&pair=${pair}&output=pb`).pipe(process.stdout);


