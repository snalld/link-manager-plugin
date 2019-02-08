
const EXTENSION_LOCATION = csInterface.getSystemPath(SystemPath.EXTENSION)

const fs = require('fs-extra')
const {
    pathExists,
} = fs

export const runScriptSync = async (csInterface, name, argumentList, onDone) => {
    const filepath = `${EXTENSION_LOCATION}/jsx/${name}.jsx`
    const exists = await pathExists(filepath)
    if (!!exists) {
        return csInterface.evalScript(`run('${name}', '${filepath}', ${JSON.stringify(argumentList)})`, onDone)
    } else {
        throw new Error('Cannot find: ' + filepath)
    }
}

export const runScript = async (csInterface, name, argumentList) => new Promise((resolve, reject) => runScriptSync(csInterface, name, argumentList, resolve));