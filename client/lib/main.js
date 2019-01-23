import { app } from "hyperapp"
import { h } from "ijk"
import cc from 'classcat'

const merge = require('merge-deep')

const state = {
  list: [],
  tree: [],
  activeTreeItem: {},
}

import { actions } from './actions.js'

const Row = (attrs, children) => [ 'div', merge({ class: 'flex items-center h-10' }, attrs), children ]

const List = (list) => 
  ['div', {
    }, 
    list.map(link => 
      ['div', {
        class: 'whitespace-no-wrap'
      }, 
      link.path.split(":").map(part => [
        ['span', ['/']],
        ['span', { class: 'whitespace-no-wrap' }, [part]],
      ]) 
    ])
  ]


function isAChildOfB(itemB, itemA) {
  return !(itemB.type === 'file' && itemA.type === 'file') && (itemA.parent + itemA.name).length > (itemB.parent + itemB.name).length && (itemA.parent + itemA.name).indexOf(itemB.parent + itemB.name) === 0
}

function isSameItem(itemB, itemA) {
  return itemB.type === 'file' && itemA.type === 'file' ?
    itemB.link.id === itemA.link.id :
    itemB.parent + itemB.name === itemA.parent + itemA.name
}

  
const Tree = ({ tree, activeItem }, actions) =>
  ['div', {
      class: ''
    },
    tree.map((item, idx) => 
      ['div', {
        class: cc({
          'whitespace-no-wrap': true,
          'bg-grey-darker': isAChildOfB(activeItem, item) || isSameItem(activeItem, item),
        }),
        }, [
          Row({
            onclick: () => {
              actions.setActiveTreeItem(item)
            }
          }, [
            Array(item.indent)
              .fill("  ")
              .map(el => ['span', { class: 'pr-8' }]),
            ['span', { 
                class: cc({
                  'whitespace-no-wrap': true,
                  'font-bold': isSameItem(activeItem, item),
                }),
              }, 
              item.name
            ],
          ])
        ]
      ]
    )
  ]

const view = (state, actions) => h('nodeName', 'attributes', 'children')(
  ['main', { 
      class: 'flex flex-col w-full h-screen p-1 bg-grey-dark',
      oncreate: _ => {
        
      }

    }, [
      ['div', { 
          class: 'flex-none w-full p-1'
        }, [
          Row({}, [
            ['button', {
                onclick: event => actions.updateLinks()
              }, 'Refresh Links'
            ],
          ]),

      ]],
      ['div', { 
          class: 'flex-1 w-full p-1 max-h-full overflow-y-auto'
        }, [
          Tree({ tree: state.tree, activeItem: state.activeTreeItem }, actions),
      ]],
  ]]
)

const main = app(state, actions, view, document.body)

main.updateLinks()

module.exports = main;
