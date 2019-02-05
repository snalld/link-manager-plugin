import {
  map,
  mergeAll,
  zipObj
} from 'ramda'

import {
  runScript
} from './helpers/jsx.js'

import {
  renameFile
} from './actions/renameFile.js'

export const actions = {

  setEditingItemValue: editingItemValue => state => mergeAll([state, {
    editingItemValue
  }]),

  setLinks: links => state => mergeAll([state, {
    links: zipObj(map(l => l.id, links), links)
  }]),

  setTree: tree => state => mergeAll([state, {
    tree
  }]),

  setSelectedTreeItem: selectedTreeItem => state => mergeAll([state, {
    selectedTreeItem
  }]),

  setEditingTreeItem: editingTreeItem => state => mergeAll([state, {
    editingTreeItem
  }]),

  getLinks: () => (state, actions) => {
    runScript(csInterface, 'getLinks.jsx').then(res => {
      try {
        const links = JSON.parse(res).links
        actions.setLinks(links)
        actions.updateTree(links)
      } catch (error) {
        console.log(res)
      }
    })
  },

  updateTree: links => (state, actions) => {
    let tree = []

    links.forEach(link => {

      const parts = `${link.path}${link.page ? '###' + link.page : ''}`.split(':')
      parts.reduce((a, val, idx) => {
        if (idx !== 0)
          a = a + '/'

        tree = tree.filter(el => !(el.parent === a && el.name === val && idx < parts.length - 1))

        let branch = {
          parent: a,
          name: val,
          indent: idx,
          type: idx === parts.length - 1 ? 'file' : 'folder',
        }

        if (branch.type === 'file')
          branch = mergeAll([branch, {
            link: link.id
          }])

        tree = [...tree, branch]

        return a + val
      }, '')

    })

    tree = tree.sort((a, b) => {
      let sa = `${a.parent}${a.name}`
      let sb = `${b.parent}${b.name}`

      if (sa === sb)
        return 0
      if (sa > sb)
        return 1
      else
        return -1

    })


    actions.setTree(tree)
  },

}