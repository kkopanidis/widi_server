var express = require('express'),
    router = express.Router(),
    request = require('request'),
    fs = require('fs');


function retrieveFromWeb(url, callback) {

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFile(url.replace("/", "_"), response, function (err) {
                if (err) {
                    callback(null);

                } else {

                    callback(new Buffer(body));
                }
            })

        }
        else {
            callback(null);
        }
    });
}

function getFile(url, callback) {

    fs.readFile(url.replace(/\//g, "_"), function (err, data) {
        if (err || !data) {
            retrieveFromWeb(url, callback);

        } else {
            var buffer = new Buffer(data);

            if (buffer.length == 0) {

                retrieveFromWeb(url, callback)

            } else {
                callback(buffer)

            }
        }
    });


}

/* GET file. */
router.get('/', function (req, res, next) {

    var part = req.get("part"),
        url = req.get("url"),
        total = req.get("total");

    getFile(url, function (data) {

        if (data) {
            var length = data.length / total;

            data = data.slice(part * length, (part * length) + length);

            res.status(200).send(data);
        } else {
            res.status(500).send("Error");
        }

    })
});

module.exports = router;
