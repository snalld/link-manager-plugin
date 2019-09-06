import { runJSX } from "../helpers/jsx.js";
// const JSX = (fx => (action, { script, args, useIndesignHistory }) => [fx, { action, script, args, useIndesignHistory }])(
//   ({ action, script, args, useIndesignHistory }, dispatch) => runJSX(script, args, useIndesignHistory).then(res => dispatch([action[0], res]))
// )
const fxJSX = ({ action, script, args, useIndesignHistory }, dispatch) => runJSX(script, args, useIndesignHistory).then((res) => dispatch(action, res));
export const JSX = (props) => [fxJSX, props];
