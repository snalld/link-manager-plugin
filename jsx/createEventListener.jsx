
function createEventListener(type, name) {
  var eventListeners = app.activeDocument.eventListeners;
  
  var eventListener = eventListeners.add(type, function (event) {
    if (new ExternalObject("lib:PlugPlugExternalObject")) {
      var eventObj = new CSXSEvent();
      eventObj.type = name;
      eventObj.data = "";
      eventObj.dispatch();
    }
  }
  );

  return "" + eventListener
}

exports = createEventListener;
