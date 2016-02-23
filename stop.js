window.onload = function() {
    document.getElementById("stopId").onclick = function() {
	var form = window.opener.document.getElementById("formId");
	var elements = form.elements;
	for (var i = 0, len = elements.length; i < len; ++i) {
	    elements[i].readOnly = false;
	}
        chrome.runtime.sendMessage({
	    type: 'close'
	});
	window.close();
    }
}
