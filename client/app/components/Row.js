import cc from 'classcat'
import { evolve, mergeDeepRight } from 'ramda'

export const Row = (attrs, children) => 
  [ 'div', 
    evolve({ class: cc }, mergeDeepRight({
      class: { 'flex items-center h-10': true }
    }, attrs))
  , children ]