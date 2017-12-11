var exec = require('child_process').execFile;
var os = require('os');
var fs = require('fs');
var request = require('request');
var progress = require('request-progress');
var ipfsAPI = require('ipfs-api')

var config = require('./config.json');
var args = process.argv.slice(2);
var ipfs = ipfsAPI();


if (os.platform() === "win32") {
    var cmd = config.ytdlpath + "/youtube-dl.exe";
} else {
    var cmd = config.ytdlpath + "/youtube-dl";
}

if (!fs.existsSync(config.output)) {
    mkdirp(destination, function (err) {
        throw new Error(err);
    });
}

exec(cmd, ["-g",args[0]], [], function (error, dlLink, stderr) {

    wa = dlLink.split("https://");

    dlLink = "https://" + wa[wa.length - 1];
    console.log(dlLink);
    console.info("Start Download...");

    progress(
        request(dlLink), {})
        .on('progress', function (state) {

            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write((state.percent).toFixed(2) + '%');
        })
        .on('error', function (err) {
            throw new Error(err)
        })
        .on('end', function () {
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write('100%');
            console.info("\nDownload finishes!\nStart IPFS Upload...");

            var files = [
                {
                    path: config.output + "/last.mp4", // The file path
                    content: fs.readFileSync(config.output + "/last.mp4")
                }
            ];

            ipfs.files.add(files, [], function (err, response) {
                if (err) {
                    throw new Error(err);
                }

                for (i = 0; i < response.length; i++) {
                    if (response[i].path == config.output + "/last.mp4") {
                        console.log("\nYour filehash: " + response[i].hash)
                    }
                }
            })
        })
        .pipe(fs.createWriteStream(config.output + "/last.mp4"));
});