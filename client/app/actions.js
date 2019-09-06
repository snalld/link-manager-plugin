import {
  findLast,
  map,
  mergeAll,
  propEq,
  zipObj
} from 'ramda'

import { pad } from "./helpers/strings.js";
import { runJSX } from './helpers/jsx.js'

import { renameLink } from './actions/renameLink.js'
import { bumpLinkDate } from './actions/bumpLinkDate.js'

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

  setBrowserItems: browserItems => state => mergeAll([state, {
    browserItems
  }]),

  setSelectedTreeItem: selectedTreeItem => state => mergeAll([state, {
    selectedTreeItem
  }]),

  setEditingTreeItem: editingTreeItem => state => mergeAll([state, {
    editingTreeItem
  }]),

  getLinks: () => (state, actions) => {
    runJSX('getLinks').then(res => {
      try {
        const rawLinks = JSON.parse(res).links
        const links = rawLinks

        actions.setLinks(links)
        actions.updateTree(links)
      } catch (error) {
        console.log(error)
      }
    })
  },

  updateTree: links => (state, actions) => {
    let tree = []
    let browserItems = new Map()

    links.forEach(link => {

      const parts = `${link.path}`.split(':')
      parts.forEach((val, idx) => {

        const path = [...parts.slice(0, idx), val]
        const itemType = (idx !== parts.length - 1) 
        ? 'folder'
        : 'file' 
        
        let key = null
        let id = null
        let name = path[path.length - 1]
        let indent = idx
        let location = null

        if (itemType === 'file') {
          name = val
          location = pad(0, 3, link.location)
          id = link.id

          // Add level for multiple instances
          const groupKey = [...path].join('/')

          if (!browserItems.has(groupKey) && groupKey.indexOf(Array.from(browserItems.values()).reverse()[0].key)) {
            browserItems.set(groupKey, {
              key: groupKey,
              name,
              indent,
              type: 'group', 
            })
          }

        }

        key = [...path, location, id].filter(e => !!e).join('/')
        
        browserItems.set(key, {
          key,
          name,
          indent: !findLast(propEq('indent', indent), Array.from(browserItems.values())) 
            ? indent 
            : indent + 1,
          type: itemType,
          location,
        })

      })

    })

    const sortedBrowserItems = Array
      .from(browserItems.values())
      .sort((a, b) => {
        const aKey = a.key
        const bKey = b.key

        return (aKey === bKey)
          ? 0
          : (aKey < bKey)
            ? -1
            : 1
      })

    actions.setBrowserItems(sortedBrowserItems)
  },

  bumpLinkDate,

}