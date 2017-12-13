const qs = require('querystring');
const request = require('sync-request');
const videoRequest = require('request');
const exec = require('child_process').execFile;
const fs = require('fs');
const os = require('os');
const config = require("./config.json");

var exports = module.exports = {
    "getPlayListItems": function (playlist, key) {
        var api_url = "https://www.googleapis.com/youtube/v3/playlistItems";
        var parameters = {
            "playlistId": playlist,
            "maxResults": "50",
            "part": "contentDetails",
            "key": key,
            "pageToken": null
        };

        var items = [];

        var apiRequest = api_url + "?" + qs.stringify(parameters)

        var res = JSON.parse(request("GET", apiRequest).getBody().toString());

        console.log("Playlist has " + res.pageInfo.totalResults + " videos.");

        if (res.hasOwnProperty("nextPageToken")) {
            parameters.pageToken = res.nextPageToken;
        }

        for (i = 0; i < res.items.length; i++) {
            items.push({
                "id": res.items[i].contentDetails.videoId
            })
        }

        while (parameters.pageToken !== null) {

            apiRequest = api_url + "?" + qs.stringify(parameters)

            res = JSON.parse(request("GET", apiRequest).getBody().toString());

            if (res.hasOwnProperty("nextPageToken")) {
                parameters.pageToken = res.nextPageToken;
            } else {
                parameters.pageToken = null;
            }

            for (i = 0; i < res.items.length; i++) {
                items.push({
                    "id": res.items[i].contentDetails.videoId
                })
            }
        }

        return items;
    },
    "downloadVideos": function (videos) {
        var cur = Promise.resolve();
        videos.forEach(function (video) {
            cur = cur.then(function () {
                return saveFile(video.id);
            });
        });
        return cur;
    }
};

function saveFile(video) {

    return new Promise(function (resolve, reject) {
        var cmd = "";

        if (os.platform() === "win32") {
            cmd = config.ytdlpath + "/youtube-dl.exe";
        } else {
            cmd = config.ytdlpath + "/youtube-dl";
        }

        exec(cmd, ["-g", video, "-f 22/137/135"], [], function (error, dlLink, stderr) {

            wa = dlLink.split("https://");

            dlLink = "https://" + wa[wa.length - 1];

            videoRequest(dlLink).pipe(fs.createWriteStream(config.output + "/" + video + ".mp4")).on("finish",function(s) {
                resolve(s)
            })


        });
    }).catch(function(e) {
        console.log("something went wrong: " + e);
    });

}
