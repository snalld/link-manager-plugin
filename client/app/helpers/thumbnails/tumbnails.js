import { createThumbnailSync } from './quicklook-thumbnail.js'

const path = require('path')
const {
    pathExists
} = require('fs-extra')

const EXTENSION_LOCATION = csInterface.getSystemPath(SystemPath.EXTENSION)
const THUMBNAIL_DIR = `${EXTENSION_LOCATION}/client/thumbs`
const THUMBNAIL_EXT = '.png'
const SEPARATOR = '$'

// Modifiy to create thumbnails in appsupport folder or similar
export const createThumbnail = path => new Promise(resolve => createThumbnailSync(path, { size: 256, folder: THUMBNAIL_DIR }, (err, result) => {
    if (err) throw (err);
    resolve(result)
}))

export const ensureThumbnail = async filePath => {
    const fileName = path.parse(filePath).name
    const thumbPath = `${THUMBNAIL_DIR}/${filePath.split('/').join(SEPARATOR)}${THUMBNAIL_EXT}`
    const thumbExists = await pathExists()

    return (!thumbExists)
        ? createThumbnail(filePath)
        : new Promise(resolve => resolve(thumbPath))
}