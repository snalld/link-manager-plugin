var npm = require("rollup-plugin-node-resolve")
var nodent = require("rollup-plugin-nodent")
var buble = require("rollup-plugin-buble")

module.exports = {
    "plugins": [
        npm(),
        // nodent({
        //     "promises": true,
        //     "es6target": true,
        //     "noRuntime": true
        // }),
        // buble({
        //     "arrows": false
        // })
    ],
    "output": {
        "format": "cjs"
    }
}