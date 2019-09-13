import { h, app } from "hyperapp"

import { transposeLinks } from "./transposeLinks"

import { runJSX } from "./helpers/jsx"

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

const SetSelectedLinkIDs = (state, selectedLinkIDs) => ({
  ...state,
  selectedLinkIDs
});

runJSX('listenToSelectionChange')

var rawEvent = function(name) {
  return (function(fx) {
    return function(action) {
      return [fx, { action: action }]
    }
  })(function(dispatch, props) {
    var listener = function(event) {
      dispatch(props.action, event.data)
    }
    csInterface.addEventListener(name, listener)
    return function() {
      csInterface.removeEventListener(name, listener)
    }
  })
}

const onUpdatedSelectedLinks = rawEvent("com.linkmanager.updatedSelectedLinks")

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
      browserItems: [],
      selectedLinkIDs: [],
    },
    JSX({
      action: Populate,
      filename: "getLinks",
      args: []
    })
  ],
  view,
  subscriptions: state => onUpdatedSelectedLinks(SetSelectedLinkIDs),
  node: document.body,
})
