const fs = eval('require("fs")');

import { h, app } from "hyperapp";

import { transposeLinks } from "./transposeLinks";

import { runJSX } from "./helpers/jsx";
import { dispatchEvent } from "./helpers/dispatchEvent";

import { view } from "./view";
import { JSX } from "./effects/JSX";

const SetLinks = (state, links) => ({ ...state, links });

const SetBrowserItems = (state, browserItems) => ({ ...state, browserItems });

const SetEditingIndex = (state, editingItem) => ({
  ...state,
  editingItem
});

const SetEditingValue = (state, editingValue) => ({
  ...state,
  editingValue
});

const SetSelectedLinkIDs = (state, selectedLinkIDs) => ({
  ...state,
  selectedLinkIDs
});

var createEventSubscription = function(name) {
  return (function(fx) {
    return function(action) {
      return [fx, { action: action }];
    };
  })(function(dispatch, props) {
    var listener = function(event) {
      dispatch(props.action, event.data);
    };
    csInterface.addEventListener(name, listener);
    return function() {
      csInterface.removeEventListener(name, listener);
    };
  });
};

runJSX("listenToSelectionChange");
const onUpdatedSelectedLinks = createEventSubscription("com.linkmanager.updatedSelectedLinks");

runJSX("createEventListener", [
  "afterSelectionChanged",
  "com.linkmanager.afterSelectionChange"
]);
const onSelectionChange = createEventSubscription("com.linkmanager.afterSelectionChange");

const onReplaceFolderLocation = createEventSubscription(
  "com.linkmanager.replaceFolderLocation"
);
const onRelink = createEventSubscription("com.linkmanager.relink");

const Populate = (state, data) => {
  const links = JSON.parse(data).links;
  return {
    ...state,
    links,
    browserItems: transposeLinks(links)
  };
};

app({
  init: [
    {
      links: [],
      browserItems: [],
      selectedLinkIDs: []
    },
    JSX({
      action: Populate,
      filename: "getLinks",
      args: []
    })
  ],
  view,
  subscriptions: state => [
    onUpdatedSelectedLinks(SetSelectedLinkIDs),
    onSelectionChange(state => {
      return state;
    }),
    onRelink((state, { source, filepath }) => [
      state,
      JSX({
        action: (state, payload) => {console.log(payload); return state},
        filename: "relink",
        args: [source, filepath]
      })
    ]),
    onReplaceFolderLocation((state, { newLocation, oldLocation }) => [
      state,
      (() => {
        oldLocation = oldLocation.replace(/\//g, ":");
        newLocation = newLocation;
        var linksToUpdate = state.links
          .filter(l => l.path.indexOf(oldLocation) === 0)
          .forEach(l => {
            const newFilepath = l.path
              .replace(oldLocation, newLocation)
              .replace(/:/g, "/");
            if (fs.existsSync(newFilepath)) {
              dispatchEvent("com.linkmanager.relink", {
                source: l.source,
                filepath: newFilepath
              });
            }
          });
      })()
    ])
  ],

  node: document.body
});
