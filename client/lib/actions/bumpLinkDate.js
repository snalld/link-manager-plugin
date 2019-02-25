import {
    runJSX
} from '../helpers/jsx.js'

const fs = require('fs-extra')
const {
    copy,
    pathExists,
} = fs

const {
    parse
} = require('path')

const regexDate = /(^\d{6}(?!\d))/g
// const regexVersion = /([vV]\d)[ _–-]+(\d{2})$/g
// (([a-zA-Z0-9]+)[ _–-]+)+

const formatDate = date => (date.getFullYear().toString()).slice(-2) + ("0"+(date.getMonth()+1)).slice(-2) + ("0" + date.getDate()).slice(-2)

export const bumpLinkDate = link => async (state, actions) => {
    const {
        dir,
        name,
        ext,
    } = parse(link.path)
    
    const date = name.match(regexDate)
    const hasDate = !!date
    const newDate = formatDate(new Date())

    let nameWithoutDate = ''
    let newName = ''
    let newPath = ''

    if (!hasDate || date[0] !== newDate) {

        nameWithoutDate = (!!hasDate) ? name.slice(6) : ` ${name}`
        newName = `${newDate}${nameWithoutDate}`
        newPath = `${dir}/${newName}${ext}`

        const exists = await pathExists(newPath)
        
        if (!exists) {
            await copy(link.path, newPath)
        } else {
            console.log('Aborting copy: file exists');
        }
    
        try {
            // Rename `link` for better legibility
            const linkSource = state.links[link.link].source
            const updatedLink = await runJSX('relink', [linkSource, newPath], true)
            actions.getLinks()
            return updatedLink
        } catch (error) {
            console.error(error)
        }
    }

}
