var express = require('express'),
    router = express.Router(),
    request = require('request'),
    fs = require('fs');


function retrieveFromWeb(url, callback) {

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFile(url.replace("/", "_"), response, function (err) {
                if (err) {
                    res.status(500).send("Error");
                } else {

                    callback(new Buffer(body));
                }
            })

        }
    });
}

function getFile(url, callback) {

    var buffer = new Buffer(fs.readFileSync(url.replace("/", "_")));

    if (buffer.length == 0) {

        retrieveFromWeb(url, callback)

    } else {
        callback(buffer)

    }

}

/* GET file. */
router.get('/', function (req, res, next) {

    var part = res.getHeader("part"),
        url = res.getHeader("url"),
        total = res.getHeader("total");

    getFile(url, function (data) {

        var length = data.length / total;

        data = data.slice(part * length, (part * length) + length);

        res.status(200).send(data);

    })
});

module.exports = router;
