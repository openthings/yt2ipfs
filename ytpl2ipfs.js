const youtube = require("./playlistHelper");
const ipfs = require("./ipfsHelper");
const config = require("./config.json");
var args = process.argv.slice(2);

if (!args[0]) {
    throw new Error("Usage: node ytpl2ipfs playlistID");
}

var items = youtube.getPlayListItems(args[0], config.google.youtube);

youtube.downloadVideos(items).then(function () {
    console.log("All videos were downlaoded");
}).then(function () {
    ipfs.uploadFiles(items).then(function(files) {
        for(i = 0; i<files.length;i++) {
            console.log("Video: " + files[i].id + " Hash: " + files[i].hash + "\n");
        }
    })
}).catch(function (e) {
    console.log("something went wrong: " + e);
});




