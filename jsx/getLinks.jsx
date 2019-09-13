function getLinks(data) {
  var doc = app.activeDocument;

  var list = [];

  var links = doc.links;

  for (var i = 0; i < links.length; i++) {
    var srcLink = links[i];
    var link = {
      path: srcLink.filePath,
      name: srcLink.name,
      id: srcLink.id,
      location: (
        srcLink.parent.parentPage || srcLink.parent.parent.parent.pages[0]
      ).name,
      source: srcLink.toSource(),
      status: (function(status) {
        if (status === LinkStatus.LINK_MISSING) return "MISSING"
        else if (status === LinkStatus.LINK_INACCESSIBLE) return "INACCESSIBLE"
        else if (status === LinkStatus.LINK_EMBEDDED) return "EMBEDDED"
        else if (status === LinkStatus.LINK_OUT_OF_DATE) return "UPDATED"
        else return "NORMAL"
      })(srcLink.status)
    };

    if (srcLink.parent.imageTypeName.indexOf("PDF") > -1) {
      link["page"] = srcLink.parent.pdfAttributes.pageNumber;
    }

    list.push(link);
  }

  return JSON.stringify({
    links: list
  });
}

exports = getLinks;
