function $( selector ) {
  return document.querySelector( selector )
}

var SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition

function Recognizer() {
  
  if( !(this instanceof Recognizer) )
    return new Recognizer()
  
  this.recog = new SpeechRecognition()
  this.recog.lang = 'en'
  this.recog.continuous = true
  this.recog.interimResults = true
  this.recog.serviceURI = 'wami.csail.mit.edu'
  
  this.confidence = $( '.speech .confidence' )
  this.transcript = $( '.speech .transcript' )
  
  this.attachEvents()
  
}

Recognizer.prototype = {
  
  constructor: Recognizer,
  
  attachEvents: function() {
    this.recog.addEventListener( 'audiostart', this )
    this.recog.addEventListener( 'soundstart', this )
    this.recog.addEventListener( 'speechstart', this )
    this.recog.addEventListener( 'speechend', this )
    this.recog.addEventListener( 'soundend', this )
    this.recog.addEventListener( 'audioend', this )
    this.recog.addEventListener( 'result', this )
    this.recog.addEventListener( 'nomatch', this )
    this.recog.addEventListener( 'error', this )
    this.recog.addEventListener( 'start', this )
    this.recog.addEventListener( 'end', this )
  },
  
  handleEvent: function( event ) {
    switch( event && event.type ) {
      case 'result': this.displayResult( event ); break
      case 'end': this.listen(); break
      default: console.log( 'Unhandled event:', event )
    }
  },
  
  listen: function() {
    this.recog.start()
  },

  displayResult: function( event ) {
    window.requestAnimationFrame( function() {
      
      var result = event.results[ event.resultIndex ]
      var item = result[0]
      
      result.isFinal === true ?
        this.transcript.classList.add( 'final' ) :
        this.transcript.classList.remove( 'final' )
      
      this.confidence.textContent = parseFloat( item.confidence ).toPrecision( 2 )
      this.transcript.value = item.transcript
	if (result.isFinal === true &&
	    document.getElementById('sendRadios1').checked) {
            mystr=item.transcript+"\n";
            chrome.runtime.sendMessage({
		type: "text",
		msg: mystr
            });
	}
    }.bind( this ))
  },
  
}

window.addEventListener( 'DOMContentLoaded', function() {
  this.recognizer = new Recognizer()
  this.recognizer.listen()
})

var sendButton=document.getElementById('sendId');

//sendButton.onclick = function sendC() {

function sendClicked() {
    this.transcript = $( '.speech .transcript' )
    mystr=this.transcript.value+"\n";
    chrome.runtime.sendMessage({
	type: "text",
	msg: mystr
    });
    this.transcript.value="";

};

sendButton.addEventListener("click", sendClicked, false);
