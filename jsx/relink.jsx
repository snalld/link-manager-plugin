function relink(source, path) {

    var link = eval(source)
    alert(link.filePath)
    var doc = app.activeDocument

    try {
        var f = new File(path)
        link.relink(f)
        return JSON.stringify(data)
    } catch (e) {
        return 'Error: Could not relink ' + link.filePath.split(':').join('/') + ' to ' + path
    }
}

exports = relink