var str2ab=function(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 800,
      'height': 500
    }
  });
});



// listening for an event / one-time requests
// coming from the popup
var connHeader='';
var msgHeader='';
var closeConn='';
var thisSocketId;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type=='text') {
	sendMessage(request.msg);
    }
    else if (request.type=='close') {
	closeConnection();
    }
    else if (request.type=='open') {
	// connect
	//console.log('Connect');
	connHeader=request.conn_header;
	connHeader=connHeader.replace(/\\n/g, '\n');
	msgHeader=request.msg_header;
	msgHeader=msgHeader.replace(/\\n/g, '\n');
	closeConn=request.close_conn;
	closeConn=closeConn.replace(/\\n/g, '\n');
	
	port_int=parseInt(request.port_str);
	if (isNaN(port_int)) {
	    // alert: insert a valid port number
	    ConnFlag=-2;
	    sendResponse({conn_result: 'wrong_port'});
	}
	else {
	    //console.log(port_int);
	    chrome.sockets.tcp.create({}, function(createInfo) {
		chrome.sockets.tcp.connect(createInfo.socketId, request.address, port_int, function(result) {
		    //console.log\('chrome.socket.tcp.connect: result = ' + result.toString());
		    if (result<0) {
			// alert: connection failed
			console.log('Connection failed: ');
			console.log('   address: '+request.address);
			console.log('   port: '+port_int);
			console.log('   result: '+result.toString());
			sendResponse({conn_result: 'failed'});
		    }
		    else {
			thisSocketId=createInfo.socketId;
			chrome.sockets.tcp.send(thisSocketId, str2ab(connHeader), function(writeInfo) {
			    //console.log('writeInfo: ' + writeInfo.bytesWritten + 'byte(s) written.');
			    sendResponse({conn_result: 'success'});
			});
		    }
		});
	    });
	}
    }

    return true;
});
    


var sendMessage = function(msg) {
    //msg = msg.replace(/"/g, 'x');
    //console.log(msg);
    chrome.sockets.tcp.send(thisSocketId, str2ab(msgHeader), function(info) {});
    chrome.sockets.tcp.send(thisSocketId, str2ab(msg), function(info) {});
    
}

var closeConnection = function() {
    chrome.sockets.tcp.send(thisSocketId, str2ab(closeConn), function(info) {});
    chrome.sockets.tcp.disconnect(thisSocketId, function(result) {});
}

