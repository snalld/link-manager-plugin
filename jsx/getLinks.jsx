function getLinks(data) {

    var doc = app.activeDocument

    var list = []

    var links = doc.links

    for (var i = 0; i < links.length; i++) {
        var srcLink = links[i]
        var link = {
            'path': srcLink.filePath,
            'name': srcLink.name,
            'id': srcLink.id,
            'source': srcLink.toSource(),
        }

        if (srcLink.parent.imageTypeName.indexOf("PDF") > -1) {
            link['page'] = srcLink.parent.pdfAttributes.pageNumber
        }

        list.push(link)
    };

    return JSON.stringify({
        links: list
    })
}

exports = getLinks;