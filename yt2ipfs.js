var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('./config.json');
var args = process.argv.slice(2);
const youtube = require("./playlistHelper");
const ipfs = require("./ipfsHelper");

if (!fs.existsSync(config.output)) {
    mkdirp(config.output, function (err,made) {
        if (err) {
            throw new Error(err);
        }
        if (made) {
            console.log("Directory " + made + " has been created!\n")
        }
    });
}

var items = [{"id":args[0]}];

console.log("Start downloading the video\n");

youtube.downloadVideos(items).then(function () {
    console.log("The video was downlaoded\n");
}).then(function () {
    ipfs.uploadFiles(items).then(function(files) {
        for(i = 0; i<files.length;i++) {
            console.log("Video: " + files[i].id + " Hash: " + files[i].hash + "\n");
        }
    })
}).catch(function (e) {
    console.log("something went wrong: " + e);
});


