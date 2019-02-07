import {
    runScript
} from '../helpers/jsx.js'

const fs = require('fs-extra')
const {
    copy,
    pathExists,
} = fs

const {
    parse
} = require('path')

const regexDate = /^(\d{6})/g
// const regexVersion = /([vV]\d)[ _–-]+(\d{2})$/g
// (([a-zA-Z0-9]+)[ _–-]+)+

const formatDate = date => (date.getFullYear().toString()).slice(-2) + ("0"+(date.getMonth()+1)).slice(-2) + ("0" + date.getDate()).slice(-2)

export const bumpLinkDate = link => async (state, actions) => {
    const {
        dir,
        name,
        ext,
    } = parse(link.path)
    
    const currentDate = (regexDate.exec(name) || [])[1]

    const newDate = formatDate(new Date())
    if (currentDate === newDate)
        return false

    const nameWithoutDate = !!currentDate ? name.slice(currentDate.length) : name
    const newName = `${newDate} ${nameWithoutDate}`
    const newPath = `${dir}/${newName}${ext}`
    
    const exists = await pathExists(newPath)
    
    if (!exists) {
        await copy(link.path, newPath)
    } else {
        console.log('Aborting copy: file exists');
    }

    try {
        // Rename for better legibility
        const linkSource = state.links[link.link].source
        const updatedLink = await runScript(csInterface, 'relink.jsx', [linkSource, newPath])
        actions.getLinks()
        return updatedLink
    } catch (error) {
        console.error(error)
    }

}

// let filepath = item.link.path.split(':').join('/')

// if (item.type === 'file') {
//   let {
//     dir,
//     name,
//     ext,
//   } = path.parse(filepath)

//   let newPath = `${dir}/${name} copy${ext}`

//   fs.copy(filepath, newPath, (err) => {
//     if (!err)
//       runScript(csInterface, 'relink.jsx', [item.link.source, newPath])
//         .then((res) => {
//           console.log(res)
//         })
//   })
// }