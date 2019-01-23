function dispatchDocActivate() {

    
    var event = new CSEvent("indesign.docActivate", "APPLICATION");
    event.data = "Hello world!";
    new CSInterface().dispatchEvent(event);

}

exports = dispatchDocActivate