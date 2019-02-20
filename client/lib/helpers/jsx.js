
const EXTENSION_LOCATION = csInterface.getSystemPath(SystemPath.EXTENSION)
const HOST_APPLICATION = csInterface.getHostEnvironment().appId

const fs = require('fs-extra')
const {
    readFile,
} = fs

export const runJSX = async (name, args, useIndesignHistory = false) => {
    try {
        const filepath = `${EXTENSION_LOCATION}/jsx/${name}.jsx`
        const fileContents = await readFile(filepath, 'utf8')
        const script = `function(){\nvar exports;\n${fileContents}\nreturn exports.apply(null, ${JSON.stringify(args || [])})\n}`
        
        let result
        
        if (HOST_APPLICATION === 'IDSN' && !!useIndesignHistory) {
            result = await new Promise((resolve, reject) => csInterface.evalScript(`app.doScript(${script}, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.FAST_ENTIRE_SCRIPT, "${name}")` , resolve))
        } else {
            result = await new Promise((resolve, reject) => csInterface.evalScript(`(${script})()`, resolve))
        }
        
        return result
    } catch (error) {
        console.error(error);
        return error
    }
}