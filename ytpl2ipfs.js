const youtube = require("./playlistHelper");
const ipfs = require("./ipfsHelper");
const config = require("./config.json");
const forEach = require('async-foreach').forEach;

var items = youtube.getPlayListItems("PLgM8CVahh79-V4mDweVRplpLbGVuX1qs6", config.google.youtube);

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




