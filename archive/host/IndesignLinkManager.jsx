#target InDesign;    

#include "vendor/json2.js"

function readFileContent(path) {
    var f = new File(path); 
    f.open("r") 
    var s = f.read()
    f.close()
    return s
}
    
function getLinks() {
    var script = readFileContent("/Users/yellow/Documents/Code Experiments/CEP Extensions/IndesignLinkManager/host/lib/getLinks.jsx")
    var data = null
    
    var res = app.doScript("(function () { var exports;" + script + "\nreturn exports("+JSON.stringify(data)+");})()", ScriptLanguage.JAVASCRIPT);

    return res
}