import { runJSX } from "../helpers/jsx.js";

const effect = (dispatch, {action, filename, args, useIndesignHistory}) => {
    return runJSX(filename, args, useIndesignHistory).then(data => dispatch(action, data))
}

export const JSX = props => {
    return [effect, props]
}