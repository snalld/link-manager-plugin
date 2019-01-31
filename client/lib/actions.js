const merge = (...args) => Object.assign({}, ...args)

import { runScript } from './helpers/jsx.js'

export const actions = {

    setList: list => state => {
      return merge(state, { list })
    },
  
    setTree: tree => state => {
      return merge(state, { tree })
    },
  
    setSelectedTreeItem: selectedTreeItem => state => {
      return merge(state, { selectedTreeItem })
    },
  
    setEditingTreeItem: editingTreeItem => state => {
      return merge(state, { editingTreeItem })
    },
  
    updateLinks: _ => (state, actions) => {
      runScript(csInterface, 'getLinks.jsx')
        .then(res => {
          try {
            const links = JSON.parse(res).links
            actions.setList(links)
            actions.updateTree(links)
          } catch (error) {
            console.log(res)
          }
        })
    },
  
    updateTree: links => (state, actions) => {
      let tree = []
  
      links.forEach(link  => {
        
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
            branch = merge(branch, { 
              link 
            })
          
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
          return - 1
  
      })

      console.log(state);
      
  
      actions.setTree(tree)
    },
  
  }