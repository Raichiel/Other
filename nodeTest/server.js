/**
 * Created by samsung np on 23.01.2016.
 */
var http = require("http");
var url = require ("url");
var fs = require ("fs");
fs.createReadBuffer('test.file').pipe(fs.createWriteBuffer('newFile.file'));

function start (route,handle){
    var i=0;
    function onRequest (request, response) {
        var pathname=url.parse(request.url).pathname;
        route(handle,pathname);
        i++;
        console.log("Request " + pathname + " received. " + i);
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World " + i);
        response.end();
    }

    http.createServer(onRequest).listen(8888);

    console.log("Server has started!");

}

exports.start=start;

