function getLinks(data) {
    var doc = app.activeDocument
    if (!doc) alert("You must have an active document to run this script!")

    var list = []
    
    var links = doc.links

    for (var i = 0; i < links.length ; i++) {
        var link = links[i]

        list.push(link.filePath)
    };

    return JSON.stringify({ links: list })
}

exports = getLinks