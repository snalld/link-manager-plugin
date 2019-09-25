
const fs = eval('require("fs")');
import { promisify } from "util";
const access = promisify(fs.access);

const EXTENSION_LOCATION = csInterface.getSystemPath(SystemPath.EXTENSION)
const HOST_APPLICATION = csInterface.getHostEnvironment().appId

export const runJSX = async (name, args, useIndesignHistory = false) => {
    try {
        const filepath = `${EXTENSION_LOCATION}/jsx/${name}.jsx`
        await access(filepath, fs.constants.F_OK)

        const fileContents = await window.cep.fs.readFile(filepath).data
        const script = `function(){\nvar exports;\n${fileContents}\nreturn exports.apply(null, ${JSON.stringify(await Promise.all(args || []))})\n}`
        
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