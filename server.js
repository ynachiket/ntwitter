var http = require("http");


http.createServer(function (req, res) {
    client.get("awesome", function (error, awesomeCount) {
        if (error !== null) {
            //handle error here
            console.log("error: " + error);
        } else {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("The awesome count is " + awesomeCount);
        }
    });
}).listen(3000);
