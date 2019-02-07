import { app } from "hyperapp"
import { h } from "ijk"
import cc from 'classcat'

import { state } from './state.js'
import { actions } from './actions.js'



function isAChildOfB(itemB, itemA) {
  return !(itemB.type === itemA.type === 'file') 
    && (itemA.parent + itemA.name).length > (itemB.parent + itemB.name).length 
    && (itemA.parent + itemA.name).indexOf(itemB.parent + itemB.name) === 0
}

function isSameItem(itemB, itemA) {
  return itemB.type === 'file' && itemA.type === 'file' ?
    itemB.link === itemA.link :
    itemB.parent + itemB.name === itemA.parent + itemA.name
}


import { Row } from './components/Row.js'
import { TreeItem } from './components/TreeItem.js'

const TreeItemInput = ({ item, isSelected, isChildOfSelected, isEditing, setEditing, setSelected, editingItemValue }) => 
  Row({
    class: {
      'whitespace-no-wrap': true,
      'bg-grey-darker': isSelected || isChildOfSelected,
    },
    onclick: () => {
      setSelected()
    },
  }, [
    console.log(editingItemValue),
    ['input',
      {
        class: cc({
          'text-black': true,
        }),
        value: editingItemValue,
        oninput: e => actions.setNameInput(),
      },
      []
    ]
  ])
  
const Tree = ({ tree, selectedItem, editingItem, editingItemValue }, actions) =>
  ['div', {
      class: ''
    },
    tree.map((item, idx) => 
      (!isSameItem(editingItem, item))
        ? TreeItem({ 
          item, 
          isSelected: isSameItem(selectedItem, item), 
          isChildOfSelected: isAChildOfB(selectedItem, item), 
          isEditing: isSameItem(editingItem, item), 
          setSelected: () => actions.setSelectedTreeItem(item),
          setEditing: () => actions.setEditingTreeItem(item),
          bumpDate: () => actions.bumpLinkDate(item)
        })
        : TreeItemInput({
          item, 
          editingItemValue,
          isEditing: isSameItem(editingItem, item), 
          setSelected: () => actions.setSelectedTreeItem(item),
          setEditing: () => actions.setEditingTreeItem(item),
        })
      )
  ]

const view = (state, actions) => h('nodeName', 'attributes', 'children')(
  ['main', { 
      class: 'flex flex-col w-full h-screen p-1 bg-grey-dark',
      oncreate: _ => {}
    }, [
      console.log(state),
      ['div', { 
          class: 'flex-none w-full p-1'
        }, [
          Row({}, [
            ['button', {
                onclick: event => actions.getLinks()
              }, 'Refresh Links'
            ],
          ]),

      ]],
      ['div', { 
          class: 'flex-1 w-full p-1 max-h-full overflow-y-auto'
        }, [
          Tree({ tree: state.tree, selectedItem: state.selectedTreeItem, editingItem: state.editingTreeItem, editingItemValue: state.editingTreeItemValue, }, actions),
      ]],
  ]]
)

const main = app(state, actions, view, document.body)

main.getLinks()

module.exports = main;
