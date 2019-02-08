//@include "vendor/json2.js"

function readFileContent(path) {
    var f = new File(path); 
    f.open("r") 
    var s = f.read()
    f.close()
    return s
}

function run(name, path, args) {
    var script = readFileContent(path)
    var argString = JSON.stringify(args)

    var res = app.doScript("(function () { var exports;" + script + "\nreturn exports.apply(null," + argString + ");})()", ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, name);

    return res
}