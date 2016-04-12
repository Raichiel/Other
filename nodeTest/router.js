/**
 * Created by samsung np on 07.02.2016.
 */
function route (handle, pathname){
    console.log("About to route a request for " + pathname);
    if(typeof handle[pathname]==='function'){
        handle[pathname]();
    } else {
        console.log("No request handler found for " + pathname);
    }
}
exports.route=route;