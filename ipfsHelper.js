var ipfsAPI = require('ipfs-api');
var config = require('./config.json');
const fs = require('fs');
var ipfs = ipfsAPI();

var exports = module.exports = {
    "uploadFiles": function (files) {
        var cur = Promise.resolve();
        files.forEach(function (file) {
            cur = cur.then(function () {
                return uploadFile("output/" + file.id + ".mp4").then(function(hash){file.hash = hash; return file;}).then(
                    function(file) {
                        fs.unlink("output/" + file.id + ".mp4");
                    }
                );

            });
        });
        cur = cur.then(function() {
            return files;
        });
        return cur;
    }
};

function uploadFile(path) {

    return new Promise(function (resolve, reject) {
        var file = [
            {
                path: path,
                content: fs.readFileSync(path)
            }
        ];

        ipfs.files.add(file, [], function (err, response) {
            if (err) {
                reject(err);
            }

            for (i = 0; i < response.length; i++) {
                if (response[i].path === path) {
                    resolve(response[i].hash)
                }
            }
        })
    })

}