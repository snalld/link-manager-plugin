import { h, app } from "hyperapp"

import { transposeLinks } from "./transposeLinks"

import { view } from "./view"
import { JSX } from "./effects/JSX"

const SetLinks = (state, links) => ({ ...state, links })

const SetBrowserItems = (state, browserItems) => ({ ...state, browserItems })

const SetEditingIndex = (state, editingItem) => ({
  ...state,
  editingItem
})

const SetEditingValue = (state, editingValue) => ({
  ...state,
  editingValue
})

const Populate = (state, data) => {
  const links = JSON.parse(data).links
  return {
    ...state,
    links,
    browserItems: transposeLinks(links)
  }
}

app({
  init: [
    {
      links: [],
      browserItems: []
    },
    JSX({
      action: Populate,
      script: "getLinks",
      args: []
    })
  ],
  view,
  node: document.body
})
