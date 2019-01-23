/**
 * 
 * @param {PageItems} selection
 */ 
function getSelectionBounds(selection) {
    var top = Infinity;
    var left = Infinity;
    var bottom = -Infinity;
    var right = -Infinity;
    for (var i = 0; i < selection.length; i++) {
        var frameBounds = selection[i].visibleBounds;
        var fT = frameBounds[0];
        var fL = frameBounds[1];
        var fB = frameBounds[2];
        var fR = frameBounds[3];
        if (fT < top)
            top = fT;
        if (fL < left)
            left = fL;
        if (fB > bottom)
            bottom = fB;
        if (fR > right)
            right = fR;
    }
    return [top, left, bottom, right];
}