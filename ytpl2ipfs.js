const youtube = require("./playlistHelper");
const config = require("./config.json");
const forEach = require('async-foreach').forEach;

var items = youtube.getPlayListItems("PLgM8CVahh79-V4mDweVRplpLbGVuX1qs6", config.google.youtube);

youtube.downloadVideos(items).then(function() {
    console.log("all files downloaded");
}).catch(function(e) {
    console.log("something went wrong: " + e);
});




