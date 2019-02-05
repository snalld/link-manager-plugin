import {
    runScript
} from '../helpers/jsx.js'

const promisify = require('util').promisify

const fs = require('fs')
const {
    COPYFILE_EXCL
} = fs.constants

const path = require('path')

const copyFile = promisify(fs.copyFile)

export const renameFile = () => (state, actions) => {


}