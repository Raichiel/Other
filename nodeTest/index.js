/**
 * Created by samsung np on 24.01.2016.
 */
var server = require ("./server");
var router = require ("./router");
var requestHandlers = require ("./requestHandlers");



var handle={}
handle["/"]=requestHandlers.start;
handle["/start"]=requestHandlers.start;
handle["/upload"]=requestHandlers.upload;

server.start(router.route, handle);