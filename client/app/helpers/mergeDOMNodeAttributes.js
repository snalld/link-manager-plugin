import cc from 'classcat'
import { evolve, mergeDeepRight } from 'ramda'

export const mergeDOMNodeAttributes = (defaults, attributes) => evolve({ class: cc }, mergeDeepRight(defaults, attributes))