import { createThumbnailSync } from './quicklook-thumbnail.js'

const path = require('path')
const {
    pathExists
} = require('fs-extra')


const THUMBNAIL_DIR = 'Users⁩/daniel⁩/Library⁩/Application Support⁩/Adobe⁩/com.linkmanager⁩'
const THUMBNAIL_EXT = '.png'

// Modifiy to create thumbnails in appsupport folder or similar
const createThumbnail = path => new Promise(resolve => createThumbnailSync(path, { size: 256, folder: THUMBNAIL_DIR }, (err, result) => {
    if (err) throw (err);
    resolve(result)
}))

const ensureThumbnail = async filePath => {
    const fileName = path.parse(filePath).name
    const thumbPath = `${THUMBNAIL_DIR}/${fileName}${THUMBNAIL_EXT}`
    const thumbExists = await pathExists()

    return (!thumbExists)
        ? createThumbnail(filePath)
        : new Promise(resolve => resolve(thumbPath))
}