import { evolve, mergeDeepRight, repeat } from 'ramda'

import { app } from "hyperapp"
import { h } from "ijk"
import cc from 'classcat'

import { runScript } from './helpers/jsx'

const fs = require('fs')
const path = require('path')

const state = {
  list: [],
  tree: [],
  activeTreeItem: {},
}

import { actions } from './actions.js'

const mergeNodeAttributes = (defaults, attributes) => evolve({ class: cc }, mergeDeepRight(defaults, attributes))

const Row = (attrs, children) => 
  [ 'div', 
    mergeNodeAttributes({
      class: { 'flex items-center h-10': true }
    }, attrs)
  , children ]

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

const TreeItem = ({ item, isActive, isChildOfActive, setSelected }) => 
  Row({
    class: {
      'whitespace-no-wrap': true,
      'bg-grey-darker': isActive || isChildOfActive,
    },
    onclick: () => {
      setSelected()
    },
    ondblclick: () => {
      // let filepath = item.link.path.split(':').join('/')

      // if (item.type === 'file') {
      //   let {
      //     dir,
      //     name,
      //     ext,
      //   } = path.parse(filepath)

      //   let newPath = `${dir}/${name} copy${ext}`

      //   fs.copyFile(filepath, newPath, (err) => {
      //     if (!err)
      //       runScript(csInterface, 'relink.jsx', [item.link.source, newPath])
      //         .then((res) => {
      //           console.log(res)
      //         })
      //   })
      // }
    }
  }, [
    repeat("  ", item.indent)
      .map(el => ['span', { class: 'pr-8' }]),
    ['span', { 
        class: cc({
          'whitespace-no-wrap': true,
          'font-bold': isActive,
        }),
      }, 
      item.name
    ],
  ])

  
const Tree = ({ tree, activeItem }, actions) =>
  ['div', {
      class: ''
    },
    tree.map((item, idx) => 
      TreeItem({ 
        item, 
        isActive: isSameItem(activeItem, item), 
        isChildOfActive: isAChildOfB(activeItem, item), 
        setSelected: () => actions.setActiveTreeItem(item) 
      })
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
