window.onload = function() {
    document.getElementById('startId').onclick = function() {
	if(document.getElementById('optionsRadios1').checked) {
	    //YARP radio button is checked
	    conn_header_val='CONNECT anonymous\n';
	    msg_header_val='d\n';
	    close_conn_val='q\n';
	} else {
	    conn_header_val=document.getElementById('ConnHId').value;
	    msg_header_val=document.getElementById('MsgHId').value;
	    close_conn_val=document.getElementById('CloseConnId').value;
	}
        chrome.runtime.sendMessage({
	    type: 'open',
	    port_str: document.getElementById('portId').value,
	    address: document.getElementById('addressId').value,
	    conn_header: conn_header_val,
	    msg_header: msg_header_val,
	    close_conn: close_conn_val
        }, function(response) {
	    if (response.conn_result=='success') {
		chrome.app.window.create('speech.html', {
		    'outerBounds': {
			'width': 800,
			'height': 500
		    }
		});
		var form = document.getElementById('formId');
		var elements = form.elements;
		for (var i = 0, len = elements.length; i < len; ++i) {
		    elements[i].readOnly = true;
		}
	    }
	    else if (response.conn_result=='wrong_port') {
		chrome.app.window.create('wrong_port.html', {
		    'outerBounds': {
			'width': 400,
			'height': 100
		    }
		});
	    }
	    else {
		chrome.app.window.create('connection_failed.html', {
		    'outerBounds': {
			'width': 400,
			'height': 100
		    }
		});

	    }
	});
    }
    document.getElementById('aboutId').onclick = function() {
	chrome.app.window.create('about.html', {
	    'outerBounds': {
		'width': 800,
		'height': 500
	    }
	});
    }
}
