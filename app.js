var http = require('http');

var reqRespMap = {};

function init(req, resp){
	console.log("SessionId : " + req.session.session_key)
	// if(!reqRespMap.req){
	// 	reqRespMap.req = resp;
	// }
	resp.end("Hello " + req.session.session_key);
}
http.createServer(init).listen(3333);