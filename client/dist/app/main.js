// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/hyperapp/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = exports.h = exports.Lazy = void 0;
var RECYCLED_NODE = 1;
var LAZY_NODE = 2;
var TEXT_NODE = 3;
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var map = EMPTY_ARR.map;
var isArray = Array.isArray;
var defer = requestAnimationFrame || setTimeout;

var createClass = function (obj) {
  var out = "";
  if (typeof obj === "string") return obj;

  if (isArray(obj) && obj.length > 0) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = createClass(obj[k])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) {
        out += (out && " ") + i;
      }
    }
  }

  return out;
};

var merge = function (a, b) {
  var out = {};

  for (var k in a) out[k] = a[k];

  for (var k in b) out[k] = b[k];

  return out;
};

var batch = function (list) {
  return list.reduce(function (out, item) {
    return out.concat(!item || item === true ? false : typeof item[0] === "function" ? [item] : batch(item));
  }, EMPTY_ARR);
};

var isSameAction = function (a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function";
};

var shouldRestart = function (a, b) {
  for (var k in merge(a, b)) {
    if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true;
    b[k] = a[k];
  }
};

var patchSubs = function (oldSubs, newSubs, dispatch) {
  for (var i = 0, oldSub, newSub, subs = []; i < oldSubs.length || i < newSubs.length; i++) {
    oldSub = oldSubs[i];
    newSub = newSubs[i];
    subs.push(newSub ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1]) ? [newSub[0], newSub[1], newSub[0](newSub[1], dispatch), oldSub && oldSub[2]()] : oldSub : oldSub && oldSub[2]());
  }

  return subs;
};

var patchProperty = function (node, key, oldValue, newValue, listener, isSvg) {
  if (key === "key") {} else if (key === "style") {
    for (var k in merge(oldValue, newValue)) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k];

      if (k[0] === "-") {
        node[key].setProperty(k, oldValue);
      } else {
        node[key][k] = oldValue;
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (!((node.actions || (node.actions = {}))[key = key.slice(2)] = newValue)) {
      node.removeEventListener(key, listener);
    } else if (!oldValue) {
      node.addEventListener(key, listener, newValue.passive ? newValue : false);
    }
  } else if (!isSvg && key !== "list" && key in node) {
    node[key] = newValue == null ? "" : newValue;
  } else if (newValue == null || newValue === false || key === "class" && !(newValue = createClass(newValue))) {
    node.removeAttribute(key);
  } else {
    node.setAttribute(key, newValue);
  }
};

var createNode = function (vnode, listener, isSvg) {
  var node = vnode.type === TEXT_NODE ? document.createTextNode(vnode.name) : (isSvg = isSvg || vnode.name === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", vnode.name) : document.createElement(vnode.name);
  var props = vnode.props;

  for (var k in props) {
    patchProperty(node, k, null, props[k], listener, isSvg);
  }

  for (var i = 0, len = vnode.children.length; i < len; i++) {
    node.appendChild(createNode(vnode.children[i] = getVNode(vnode.children[i]), listener, isSvg));
  }

  return vnode.node = node;
};

var getKey = function (vnode) {
  return vnode == null ? null : vnode.key;
};

var patch = function (parent, node, oldVNode, newVNode, listener, isSvg) {
  if (oldVNode === newVNode) {} else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
    node = parent.insertBefore(createNode(newVNode = getVNode(newVNode), listener, isSvg), node);
    if (oldVNode != null) parent.removeChild(oldVNode.node);
  } else {
    var tmpVKid;
    var oldVKid;
    var oldKey;
    var newKey;
    var oldVProps = oldVNode.props;
    var newVProps = newVNode.props;
    var oldVKids = oldVNode.children;
    var newVKids = newVNode.children;
    var oldHead = 0;
    var newHead = 0;
    var oldTail = oldVKids.length - 1;
    var newTail = newVKids.length - 1;
    isSvg = isSvg || newVNode.name === "svg";

    for (var i in merge(oldVProps, newVProps)) {
      if ((i === "value" || i === "selected" || i === "checked" ? node[i] : oldVProps[i]) !== newVProps[i]) {
        patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg);
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
        break;
      }

      patch(node, oldVKids[oldHead].node, oldVKids[oldHead], newVKids[newHead] = getVNode(newVKids[newHead++], oldVKids[oldHead++]), listener, isSvg);
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
        break;
      }

      patch(node, oldVKids[oldTail].node, oldVKids[oldTail], newVKids[newTail] = getVNode(newVKids[newTail--], oldVKids[oldTail--]), listener, isSvg);
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(createNode(newVKids[newHead] = getVNode(newVKids[newHead++]), listener, isSvg), (oldVKid = oldVKids[oldHead]) && oldVKid.node);
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node);
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(newVKids[newHead] = getVNode(newVKids[newHead], oldVKid));

        if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node);
          }

          oldHead++;
          continue;
        }

        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patch(node, oldVKid && oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
            newHead++;
          }

          oldHead++;
        } else {
          if (oldKey === newKey) {
            patch(node, oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patch(node, node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node), tmpVKid, newVKids[newHead], listener, isSvg);
              newKeyed[newKey] = true;
            } else {
              patch(node, oldVKid && oldVKid.node, null, newVKids[newHead], listener, isSvg);
            }
          }

          newHead++;
        }
      }

      while (oldHead <= oldTail) {
        if (getKey(oldVKid = oldVKids[oldHead++]) == null) {
          node.removeChild(oldVKid.node);
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node);
        }
      }
    }
  }

  return newVNode.node = node;
};

var propsChanged = function (a, b) {
  for (var k in a) if (a[k] !== b[k]) return true;

  for (var k in b) if (a[k] !== b[k]) return true;
};

var getVNode = function (newVNode, oldVNode) {
  return newVNode.type === LAZY_NODE ? ((!oldVNode || propsChanged(oldVNode.lazy, newVNode.lazy)) && ((oldVNode = newVNode.lazy.view(newVNode.lazy)).lazy = newVNode.lazy), oldVNode) : newVNode;
};

var createVNode = function (name, props, children, node, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    node: node,
    type: type,
    key: key
  };
};

var createTextVNode = function (value, node) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, null, TEXT_NODE);
};

var recycleNode = function (node) {
  return node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(node.nodeName.toLowerCase(), EMPTY_OBJ, map.call(node.childNodes, recycleNode), node, null, RECYCLED_NODE);
};

var Lazy = function (props) {
  return {
    lazy: props,
    type: LAZY_NODE
  };
};

exports.Lazy = Lazy;

var h = function (name, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i]);
  }

  while (rest.length > 0) {
    if (isArray(vnode = rest.pop())) {
      for (var i = vnode.length; i-- > 0;) {
        rest.push(vnode[i]);
      }
    } else if (vnode === false || vnode === true || vnode == null) {} else {
      children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode));
    }
  }

  props = props || EMPTY_OBJ;
  return typeof name === "function" ? name(props, children) : createVNode(name, props, children, null, props.key);
};

exports.h = h;

var app = function (props, enhance) {
  var state = {};
  var lock = false;
  var view = props.view;
  var node = props.node;
  var vdom = node && recycleNode(node);
  var subscriptions = props.subscriptions;
  var subs = [];

  var listener = function (event) {
    var action = this.actions[event.type];
    if (action.preventDefault) event.preventDefault();
    if (action.stopPropagation) event.stopPropagation();
    dispatch(action.action || action, event);
  };

  var setState = function (newState) {
    return state === newState || lock || defer(render, lock = true), state = newState;
  };

  var dispatch = (enhance || function (a) {
    return a;
  })(function (action, props) {
    return typeof action === "function" ? dispatch(action(state, props)) : isArray(action) ? typeof action[0] === "function" ? dispatch(action[0], typeof action[1] === "function" ? action[1](props) : action[1]) : (batch(action.slice(1)).map(function (fx) {
      fx && fx[0](fx[1], dispatch);
    }, setState(action[0])), state) : setState(action);
  });

  var render = function () {
    lock = false;

    if (subscriptions) {
      subs = patchSubs(subs, batch(subscriptions(state)), dispatch);
    }

    if (view) {
      node = patch(node.parentNode, node, vdom, typeof (vdom = view(state)) === "string" ? createTextVNode(vdom) : vdom, listener);
    }
  };

  dispatch(props.init);
};

exports.app = app;
},{}],"app/transposeLinks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transposeLinks = transposeLinks;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function transposeLinks(links) {
  let browserItems = new Map();
  let counter = 0;
  links.forEach(link => {
    const parts = `${link.path}`.split(":");
    parts.forEach((val, idx) => {
      const path = [...parts.slice(0, idx), val];
      const itemType = idx !== parts.length - 1 ? "directory" : "file";
      let key = null;
      let id = null;
      let content = path[path.length - 1];
      let indent = idx;
      let location = null;

      if (itemType === "file") {
        content = val;
        location = link.location.padStart(3, "0");
        id = `${counter}`.padStart(3, "0");
        counter++; // Add file group

        const groupKey = [...path].join("/");

        if (!browserItems.has(groupKey)) {
          browserItems.set(groupKey, {
            key: groupKey,
            content,
            indent,
            type: "group",
            isCollapsed: true
          });
        } else {
          // Default state expanded
          browserItems.set(groupKey, _objectSpread({}, browserItems.get(groupKey), {
            isCollapsed: false
          }));
        }

        indent++;
      }

      key = [...path, location, id].filter(e => !!e).join("/");
      browserItems.set(key, {
        key,
        content,
        indent,
        type: itemType,
        location
      });
    });
  });
  const sortedBrowserItems = [...browserItems.values()].sort((a, b) => {
    const aKey = a.key;
    const bKey = b.key;
    return aKey === bKey ? 0 : aKey < bKey ? -1 : 1;
  });
  return sortedBrowserItems;
}
},{}],"app/helpers/browser/walkParentTreeUntil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkParentTreeUntil = void 0;

const walkParentTreeUntil = (condition, index, browserItems) => {
  let lastParent = browserItems[index];
  let result = false;

  do {
    index--;
    let parent = browserItems[index];
    if (!parent) return false;
    if (parent.indent >= lastParent.indent) continue;
    lastParent = parent;
    result = condition(parent);
    if (!!result) break;
  } while (index > 0);

  return result;
};

exports.walkParentTreeUntil = walkParentTreeUntil;
},{}],"app/helpers/browser/getDescendentsByIndex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDescendentsByIndex = void 0;

const getDescendentsByIndex = (index, items) => {
  let descendents = [];
  let originalItem = items[index]; // TODO: convert to `do while`

  let idx = index + 1;
  let currentItem = items[idx];

  while (idx < items.length && currentItem.indent > originalItem.indent) {
    descendents.push(currentItem);
    idx++;
    currentItem = items[idx];
  }

  return descendents;
};

exports.getDescendentsByIndex = getDescendentsByIndex;
},{}],"app/helpers/browser/setCollapsedByIndex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCollapsedByIndex = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setCollapsedByIndex = (state, index, value) => {
  let browserItems = state.browserItems;
  return _objectSpread({}, state, {
    browserItems: [...browserItems.slice(0, index), _objectSpread({}, browserItems[index], {
      isCollapsed: value
    }), ...browserItems.slice(index + 1)]
  });
};

exports.setCollapsedByIndex = setCollapsedByIndex;
},{}],"node_modules/classcat/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cc;
var isArray = Array.isArray;

function cc(names) {
  var i,
      len,
      tmp,
      out = "",
      type = typeof names;
  if (type === "string" || type === "number") return names || "";

  if (isArray(names) && names.length > 0) {
    for (i = 0, len = names.length; i < len; i++) {
      if ((tmp = cc(names[i])) !== "") out += (out && " ") + tmp;
    }
  } else {
    for (i in names) {
      if (names.hasOwnProperty(i) && names[i]) out += (out && " ") + i;
    }
  }

  return out;
}
},{}],"app/components/BrowserItemIndent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserItemIndent = void 0;

var _hyperapp = require("hyperapp");

const BrowserItemIndent = ({
  level
}) => (0, _hyperapp.h)("div", null, Array(level).fill(true).map(() => (0, _hyperapp.h)("span", {
  class: "item__indent"
}, "\xA0")));

exports.BrowserItemIndent = BrowserItemIndent;
},{"hyperapp":"node_modules/hyperapp/src/index.js"}],"app/components/BrowserItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserItem = void 0;

var _hyperapp = require("hyperapp");

var _classcat = _interopRequireDefault(require("classcat"));

var _BrowserItemIndent = require("./BrowserItemIndent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BrowserItem = ({
  content,
  indent,
  collapsable = true,
  isCollapsed,
  isHidden,
  isEditing,
  setCollapsed = () => {},
  setEditing = () => {}
}, children) => (0, _hyperapp.h)("div", {
  class: (0, _classcat.default)(["item", {
    hidden: isHidden
  }])
}, !!collapsable && (0, _hyperapp.h)("div", null, !isCollapsed ? (0, _hyperapp.h)("p", {
  onclick: () => setCollapsed(true)
}, "-") : (0, _hyperapp.h)("p", {
  onclick: () => setCollapsed(false)
}, "+")), (0, _hyperapp.h)(_BrowserItemIndent.BrowserItemIndent, {
  level: indent
}), !isEditing ? (0, _hyperapp.h)("div", {
  class: "item__content",
  ondblclick: setEditing
}, (0, _hyperapp.h)("p", null, content)) : (0, _hyperapp.h)("div", null, (0, _hyperapp.h)("input", {
  type: "text",
  value: content
})));

exports.BrowserItem = BrowserItem;
},{"hyperapp":"node_modules/hyperapp/src/index.js","classcat":"node_modules/classcat/src/index.js","./BrowserItemIndent":"app/components/BrowserItemIndent.js"}],"app/helpers/browser/hasManyChildrenByIndex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasManyChildrenByIndex = void 0;

const hasManyChildrenByIndex = (index, items) => {
  let item = items[index];
  let nextItem;
  let childCount = 0;
  let idx = index;

  while (idx < items.length - 1 && childCount < 2) {
    idx++;
    nextItem = items[idx];
    if (nextItem.indent <= item.indent) break;
    if (nextItem.indent === item.indent + 1) childCount++;
  }

  return !!childCount;
};

exports.hasManyChildrenByIndex = hasManyChildrenByIndex;
},{}],"app/view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = void 0;

var _hyperapp = require("hyperapp");

var _walkParentTreeUntil = require("./helpers/browser/walkParentTreeUntil");

var _getDescendentsByIndex = require("./helpers/browser/getDescendentsByIndex");

var _setCollapsedByIndex = require("./helpers/browser/setCollapsedByIndex");

var _BrowserItem = require("./components/BrowserItem");

var _hasManyChildrenByIndex = require("./helpers/browser/hasManyChildrenByIndex");

const view = state => (0, _hyperapp.h)("main", {
  class: ""
}, console.log(state), (0, _hyperapp.h)("article", {
  class: "browser"
}, state.browserItems.map((item, idx, browserItems) => (0, _hyperapp.h)(_BrowserItem.BrowserItem, {
  content: item.content,
  indent: item.indent,
  collapsable: item.type === "directory" || (0, _hasManyChildrenByIndex.hasManyChildrenByIndex)(idx, browserItems),
  isCollapsed: item.isCollapsed,
  isHidden: item.isHidden || (0, _walkParentTreeUntil.walkParentTreeUntil)(parent => !!parent.isCollapsed, idx, browserItems),
  setCollapsed: value => (0, _setCollapsedByIndex.setCollapsedByIndex)(state, idx, value)
})))); // const Directory = ({
//   content,
//   indent,
//   isCollapsed,
//   isHidden,
//   setCollapsed
// }) => (
//   <div class={cc(["item", { hidden: isHidden }])}>
//     <div>
//       {!isCollapsed ? (
//         <p onclick={() => setCollapsed(true)}>-</p>
//       ) : (
//         <p onclick={() => setCollapsed(false)}>+</p>
//       )}
//     </div>
//     <ItemIndent level={indent} />
//     <div class="item__content">
//       <p>{content}</p>
//     </div>
//   </div>
// )
// const FileGroup = ({
//   content,
//   indent,
//   isCollapsed,
//   isHidden,
//   isEditing,
//   setCollapsed
// }) => (
//   <div class={cc(["item", { hidden: isHidden }])}>
//     <div>
//       {!isCollapsed ? (
//         <p onclick={() => setCollapsed(true)}>-</p>
//       ) : (
//         <p onclick={() => setCollapsed(false)}>+</p>
//       )}
//     </div>
//     <ItemIndent level={indent} />
//     <div class="item__content">
//       <p>{content}</p>
//     </div>
//     <Button>Update All</Button>
//     <Button>V+</Button>
//   </div>
// )
// const File = ({ content, indent, isHidden }) => (
//   <div class={cc(["item", { hidden: isHidden }])}>
//     <div>&nbsp;</div>
//     <ItemIndent level={indent} />
//     <div class="item__content">
//       <p>{content}</p>
//     </div>
//     <Button>Update</Button>
//     <Button>V+</Button>
//   </div>
// )


exports.view = view;
},{"hyperapp":"node_modules/hyperapp/src/index.js","./helpers/browser/walkParentTreeUntil":"app/helpers/browser/walkParentTreeUntil.js","./helpers/browser/getDescendentsByIndex":"app/helpers/browser/getDescendentsByIndex.js","./helpers/browser/setCollapsedByIndex":"app/helpers/browser/setCollapsedByIndex.js","./components/BrowserItem":"app/components/BrowserItem.js","./helpers/browser/hasManyChildrenByIndex":"app/helpers/browser/hasManyChildrenByIndex.js"}],"node_modules/universalify/index.js":[function(require,module,exports) {
'use strict';

exports.fromCallback = function (fn) {
  return Object.defineProperty(function () {
    if (typeof arguments[arguments.length - 1] === 'function') fn.apply(this, arguments);else {
      return new Promise((resolve, reject) => {
        arguments[arguments.length] = (err, res) => {
          if (err) return reject(err);
          resolve(res);
        };

        arguments.length++;
        fn.apply(this, arguments);
      });
    }
  }, 'name', {
    value: fn.name
  });
};

exports.fromPromise = function (fn) {
  return Object.defineProperty(function () {
    const cb = arguments[arguments.length - 1];
    if (typeof cb !== 'function') return fn.apply(this, arguments);else fn.apply(this, arguments).then(r => cb(null, r), cb);
  }, 'name', {
    value: fn.name
  });
};
},{}],"node_modules/graceful-fs/polyfills.js":[function(require,module,exports) {
var constants = require('constants')

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, cb) {
      return orig.call(fs, target, function (er, stats) {
        if (!stats) return cb.apply(this, arguments)
        if (stats.uid < 0) stats.uid += 0x100000000
        if (stats.gid < 0) stats.gid += 0x100000000
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target) {
      var stats = orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}

},{}],"node_modules/graceful-fs/legacy-streams.js":[function(require,module,exports) {
var Stream = require('stream').Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

},{}],"node_modules/graceful-fs/clone.js":[function(require,module,exports) {
'use strict'

module.exports = clone

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}

},{}],"node_modules/graceful-fs/graceful-fs.js":[function(require,module,exports) {
var fs = require('fs')
var polyfills = require('./polyfills.js')
var legacy = require('./legacy-streams.js')
var clone = require('./clone.js')

var queue = []

var util = require('util')

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    require('assert').equal(queue.length, 0)
  })
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

// Only patch fs once, otherwise we'll run into a memory leak if
// graceful-fs is loaded multiple times, such as in test environments that
// reset the loaded modules between tests.
// We look for the string `graceful-fs` from the comment above. This
// way we are not adding any extra properties and it will detect if older
// versions of graceful-fs are installed.
if (!/\bgraceful-fs\b/.test(fs.closeSync.toString())) {
  fs.closeSync = module.exports.closeSync;
  fs.close = module.exports.close;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}

},{"./polyfills.js":"node_modules/graceful-fs/polyfills.js","./legacy-streams.js":"node_modules/graceful-fs/legacy-streams.js","./clone.js":"node_modules/graceful-fs/clone.js"}],"node_modules/fs-extra/lib/fs/index.js":[function(require,module,exports) {
'use strict'; // This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors

const u = require('universalify').fromCallback;

const fs = require('graceful-fs');

const api = ['access', 'appendFile', 'chmod', 'chown', 'close', 'copyFile', 'fchmod', 'fchown', 'fdatasync', 'fstat', 'fsync', 'ftruncate', 'futimes', 'lchown', 'lchmod', 'link', 'lstat', 'mkdir', 'mkdtemp', 'open', 'readFile', 'readdir', 'readlink', 'realpath', 'rename', 'rmdir', 'stat', 'symlink', 'truncate', 'unlink', 'utimes', 'writeFile'].filter(key => {
  // Some commands are not available on some systems. Ex:
  // fs.copyFile was added in Node.js v8.5.0
  // fs.mkdtemp was added in Node.js v5.10.0
  // fs.lchown is not available on at least some Linux
  return typeof fs[key] === 'function';
}); // Export all keys:

Object.keys(fs).forEach(key => {
  if (key === 'promises') {
    // fs.promises is a getter property that triggers ExperimentalWarning
    // Don't re-export it here, the getter is defined in "lib/index.js"
    return;
  }

  exports[key] = fs[key];
}); // Universalify async methods:

api.forEach(method => {
  exports[method] = u(fs[method]);
}); // We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module

exports.exists = function (filename, callback) {
  if (typeof callback === 'function') {
    return fs.exists(filename, callback);
  }

  return new Promise(resolve => {
    return fs.exists(filename, resolve);
  });
}; // fs.read() & fs.write need special treatment due to multiple callback args


exports.read = function (fd, buffer, offset, length, position, callback) {
  if (typeof callback === 'function') {
    return fs.read(fd, buffer, offset, length, position, callback);
  }

  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) return reject(err);
      resolve({
        bytesRead,
        buffer
      });
    });
  });
}; // Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args


exports.write = function (fd, buffer, ...args) {
  if (typeof args[args.length - 1] === 'function') {
    return fs.write(fd, buffer, ...args);
  }

  return new Promise((resolve, reject) => {
    fs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
      if (err) return reject(err);
      resolve({
        bytesWritten,
        buffer
      });
    });
  });
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js"}],"node_modules/fs-extra/lib/mkdirs/win32.js":[function(require,module,exports) {
'use strict';

const path = require('path'); // get drive on windows


function getRootPath(p) {
  p = path.normalize(path.resolve(p)).split(path.sep);
  if (p.length > 0) return p[0];
  return null;
} // http://stackoverflow.com/a/62888/10333 contains more accurate
// TODO: expand to include the rest


const INVALID_PATH_CHARS = /[<>:"|?*]/;

function invalidWin32Path(p) {
  const rp = getRootPath(p);
  p = p.replace(rp, '');
  return INVALID_PATH_CHARS.test(p);
}

module.exports = {
  getRootPath,
  invalidWin32Path
};
},{}],"node_modules/fs-extra/lib/mkdirs/mkdirs.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const invalidWin32Path = require('./win32').invalidWin32Path;

const o777 = parseInt('0777', 8);

function mkdirs(p, opts, callback, made) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (!opts || typeof opts !== 'object') {
    opts = {
      mode: opts
    };
  }

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.');
    errInval.code = 'EINVAL';
    return callback(errInval);
  }

  let mode = opts.mode;
  const xfs = opts.fs || fs;

  if (mode === undefined) {
    mode = o777 & ~process.umask();
  }

  if (!made) made = null;

  callback = callback || function () {};

  p = path.resolve(p);
  xfs.mkdir(p, mode, er => {
    if (!er) {
      made = made || p;
      return callback(null, made);
    }

    switch (er.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) return callback(er);
        mkdirs(path.dirname(p), opts, (er, made) => {
          if (er) callback(er, made);else mkdirs(p, opts, callback, made);
        });
        break;
      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.

      default:
        xfs.stat(p, (er2, stat) => {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (er2 || !stat.isDirectory()) callback(er, made);else callback(null, made);
        });
        break;
    }
  });
}

module.exports = mkdirs;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","./win32":"node_modules/fs-extra/lib/mkdirs/win32.js"}],"node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const invalidWin32Path = require('./win32').invalidWin32Path;

const o777 = parseInt('0777', 8);

function mkdirsSync(p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = {
      mode: opts
    };
  }

  let mode = opts.mode;
  const xfs = opts.fs || fs;

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.');
    errInval.code = 'EINVAL';
    throw errInval;
  }

  if (mode === undefined) {
    mode = o777 & ~process.umask();
  }

  if (!made) made = null;
  p = path.resolve(p);

  try {
    xfs.mkdirSync(p, mode);
    made = made || p;
  } catch (err0) {
    if (err0.code === 'ENOENT') {
      if (path.dirname(p) === p) throw err0;
      made = mkdirsSync(path.dirname(p), opts, made);
      mkdirsSync(p, opts, made);
    } else {
      // In the case of any other error, just see if there's a dir there
      // already. If so, then hooray!  If not, then something is borked.
      let stat;

      try {
        stat = xfs.statSync(p);
      } catch (err1) {
        throw err0;
      }

      if (!stat.isDirectory()) throw err0;
    }
  }

  return made;
}

module.exports = mkdirsSync;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","./win32":"node_modules/fs-extra/lib/mkdirs/win32.js"}],"node_modules/fs-extra/lib/mkdirs/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const mkdirs = u(require('./mkdirs'));

const mkdirsSync = require('./mkdirs-sync');

module.exports = {
  mkdirs,
  mkdirsSync,
  // alias
  mkdirp: mkdirs,
  mkdirpSync: mkdirsSync,
  ensureDir: mkdirs,
  ensureDirSync: mkdirsSync
};
},{"universalify":"node_modules/universalify/index.js","./mkdirs":"node_modules/fs-extra/lib/mkdirs/mkdirs.js","./mkdirs-sync":"node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js"}],"node_modules/fs-extra/lib/util/utimes.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const os = require('os');

const path = require('path'); // HFS, ext{2,3}, FAT do not, Node.js v0.10 does not


function hasMillisResSync() {
  let tmpfile = path.join('millis-test-sync' + Date.now().toString() + Math.random().toString().slice(2));
  tmpfile = path.join(os.tmpdir(), tmpfile); // 550 millis past UNIX epoch

  const d = new Date(1435410243862);
  fs.writeFileSync(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141');
  const fd = fs.openSync(tmpfile, 'r+');
  fs.futimesSync(fd, d, d);
  fs.closeSync(fd);
  return fs.statSync(tmpfile).mtime > 1435410243000;
}

function hasMillisRes(callback) {
  let tmpfile = path.join('millis-test' + Date.now().toString() + Math.random().toString().slice(2));
  tmpfile = path.join(os.tmpdir(), tmpfile); // 550 millis past UNIX epoch

  const d = new Date(1435410243862);
  fs.writeFile(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141', err => {
    if (err) return callback(err);
    fs.open(tmpfile, 'r+', (err, fd) => {
      if (err) return callback(err);
      fs.futimes(fd, d, d, err => {
        if (err) return callback(err);
        fs.close(fd, err => {
          if (err) return callback(err);
          fs.stat(tmpfile, (err, stats) => {
            if (err) return callback(err);
            callback(null, stats.mtime > 1435410243000);
          });
        });
      });
    });
  });
}

function timeRemoveMillis(timestamp) {
  if (typeof timestamp === 'number') {
    return Math.floor(timestamp / 1000) * 1000;
  } else if (timestamp instanceof Date) {
    return new Date(Math.floor(timestamp.getTime() / 1000) * 1000);
  } else {
    throw new Error('fs-extra: timeRemoveMillis() unknown parameter type');
  }
}

function utimesMillis(path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  fs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err);
    fs.futimes(fd, atime, mtime, futimesErr => {
      fs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr);
      });
    });
  });
}

function utimesMillisSync(path, atime, mtime) {
  const fd = fs.openSync(path, 'r+');
  fs.futimesSync(fd, atime, mtime);
  return fs.closeSync(fd);
}

module.exports = {
  hasMillisRes,
  hasMillisResSync,
  timeRemoveMillis,
  utimesMillis,
  utimesMillisSync
};
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js"}],"node_modules/fs-extra/lib/util/buffer.js":[function(require,module,exports) {
'use strict';
/* eslint-disable node/no-deprecated-api */

module.exports = function (size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    try {
      return Buffer.allocUnsafe(size);
    } catch (e) {
      return new Buffer(size);
    }
  }

  return new Buffer(size);
};
},{}],"node_modules/fs-extra/lib/copy-sync/copy-sync.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const mkdirpSync = require('../mkdirs').mkdirsSync;

const utimesSync = require('../util/utimes.js').utimesMillisSync;

const notExist = Symbol('notExist');

function copySync(src, dest, opts) {
  if (typeof opts === 'function') {
    opts = {
      filter: opts
    };
  }

  opts = opts || {};
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now

  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber
  // Warn about using preserveTimestamps on 32-bit node

  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  const destStat = checkPaths(src, dest);
  if (opts.filter && !opts.filter(src, dest)) return;
  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) mkdirpSync(destParent);
  return startCopy(destStat, src, dest, opts);
}

function startCopy(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return;
  return getStats(destStat, src, dest, opts);
}

function getStats(destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
  const srcStat = statSync(src);
  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
}

function onFile(srcStat, destStat, src, dest, opts) {
  if (destStat === notExist) return copyFile(srcStat, src, dest, opts);
  return mayCopyFile(srcStat, src, dest, opts);
}

function mayCopyFile(srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs.unlinkSync(dest);
    return copyFile(srcStat, src, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}

function copyFile(srcStat, src, dest, opts) {
  if (typeof fs.copyFileSync === 'function') {
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, srcStat.mode);

    if (opts.preserveTimestamps) {
      return utimesSync(dest, srcStat.atime, srcStat.mtime);
    }

    return;
  }

  return copyFileFallback(srcStat, src, dest, opts);
}

function copyFileFallback(srcStat, src, dest, opts) {
  const BUF_LENGTH = 64 * 1024;

  const _buff = require('../util/buffer')(BUF_LENGTH);

  const fdr = fs.openSync(src, 'r');
  const fdw = fs.openSync(dest, 'w', srcStat.mode);
  let pos = 0;

  while (pos < srcStat.size) {
    const bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, _buff, 0, bytesRead);
    pos += bytesRead;
  }

  if (opts.preserveTimestamps) fs.futimesSync(fdw, srcStat.atime, srcStat.mtime);
  fs.closeSync(fdr);
  fs.closeSync(fdw);
}

function onDir(srcStat, destStat, src, dest, opts) {
  if (destStat === notExist) return mkDirAndCopy(srcStat, src, dest, opts);

  if (destStat && !destStat.isDirectory()) {
    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
  }

  return copyDir(src, dest, opts);
}

function mkDirAndCopy(srcStat, src, dest, opts) {
  fs.mkdirSync(dest);
  copyDir(src, dest, opts);
  return fs.chmodSync(dest, srcStat.mode);
}

function copyDir(src, dest, opts) {
  fs.readdirSync(src).forEach(item => copyDirItem(item, src, dest, opts));
}

function copyDirItem(item, src, dest, opts) {
  const srcItem = path.join(src, item);
  const destItem = path.join(dest, item);
  const destStat = checkPaths(srcItem, destItem);
  return startCopy(destStat, srcItem, destItem, opts);
}

function onLink(destStat, src, dest, opts) {
  let resolvedSrc = fs.readlinkSync(src);

  if (opts.dereference) {
    resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
  }

  if (destStat === notExist) {
    return fs.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;

    try {
      resolvedDest = fs.readlinkSync(dest);
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlinkSync(resolvedSrc, dest);
      throw err;
    }

    if (opts.dereference) {
      resolvedDest = path.resolve(process.cwd(), resolvedDest);
    }

    if (isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    } // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.


    if (fs.statSync(dest).isDirectory() && isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }

    return copyLink(resolvedSrc, dest);
  }
}

function copyLink(resolvedSrc, dest) {
  fs.unlinkSync(dest);
  return fs.symlinkSync(resolvedSrc, dest);
} // return true if dest is a subdir of src, otherwise false.


function isSrcSubdir(src, dest) {
  const srcArray = path.resolve(src).split(path.sep);
  const destArray = path.resolve(dest).split(path.sep);
  return srcArray.reduce((acc, current, i) => acc && destArray[i] === current, true);
}

function checkStats(src, dest) {
  const srcStat = fs.statSync(src);
  let destStat;

  try {
    destStat = fs.statSync(dest);
  } catch (err) {
    if (err.code === 'ENOENT') return {
      srcStat,
      destStat: notExist
    };
    throw err;
  }

  return {
    srcStat,
    destStat
  };
}

function checkPaths(src, dest) {
  const {
    srcStat,
    destStat
  } = checkStats(src, dest);

  if (destStat.ino && destStat.ino === srcStat.ino) {
    throw new Error('Source and destination must not be the same.');
  }

  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
  }

  return destStat;
}

module.exports = copySync;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../util/utimes.js":"node_modules/fs-extra/lib/util/utimes.js","../util/buffer":"node_modules/fs-extra/lib/util/buffer.js"}],"node_modules/fs-extra/lib/copy-sync/index.js":[function(require,module,exports) {
'use strict';

module.exports = {
  copySync: require('./copy-sync')
};
},{"./copy-sync":"node_modules/fs-extra/lib/copy-sync/copy-sync.js"}],"node_modules/fs-extra/lib/path-exists/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromPromise;

const fs = require('../fs');

function pathExists(path) {
  return fs.access(path).then(() => true).catch(() => false);
}

module.exports = {
  pathExists: u(pathExists),
  pathExistsSync: fs.existsSync
};
},{"universalify":"node_modules/universalify/index.js","../fs":"node_modules/fs-extra/lib/fs/index.js"}],"node_modules/fs-extra/lib/copy/copy.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const mkdirp = require('../mkdirs').mkdirs;

const pathExists = require('../path-exists').pathExists;

const utimes = require('../util/utimes').utimesMillis;

const notExist = Symbol('notExist');

function copy(src, dest, opts, cb) {
  if (typeof opts === 'function' && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === 'function') {
    opts = {
      filter: opts
    };
  }

  cb = cb || function () {};

  opts = opts || {};
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now

  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber
  // Warn about using preserveTimestamps on 32-bit node

  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  checkPaths(src, dest, (err, destStat) => {
    if (err) return cb(err);
    if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
    return checkParentDir(destStat, src, dest, opts, cb);
  });
}

function checkParentDir(destStat, src, dest, opts, cb) {
  const destParent = path.dirname(dest);
  pathExists(destParent, (err, dirExists) => {
    if (err) return cb(err);
    if (dirExists) return startCopy(destStat, src, dest, opts, cb);
    mkdirp(destParent, err => {
      if (err) return cb(err);
      return startCopy(destStat, src, dest, opts, cb);
    });
  });
}

function handleFilter(onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then(include => {
    if (include) {
      if (destStat) return onInclude(destStat, src, dest, opts, cb);
      return onInclude(src, dest, opts, cb);
    }

    return cb();
  }, error => cb(error));
}

function startCopy(destStat, src, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
  return getStats(destStat, src, dest, opts, cb);
}

function getStats(destStat, src, dest, opts, cb) {
  const stat = opts.dereference ? fs.stat : fs.lstat;
  stat(src, (err, srcStat) => {
    if (err) return cb(err);
    if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
  });
}

function onFile(srcStat, destStat, src, dest, opts, cb) {
  if (destStat === notExist) return copyFile(srcStat, src, dest, opts, cb);
  return mayCopyFile(srcStat, src, dest, opts, cb);
}

function mayCopyFile(srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    fs.unlink(dest, err => {
      if (err) return cb(err);
      return copyFile(srcStat, src, dest, opts, cb);
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`));
  } else return cb();
}

function copyFile(srcStat, src, dest, opts, cb) {
  if (typeof fs.copyFile === 'function') {
    return fs.copyFile(src, dest, err => {
      if (err) return cb(err);
      return setDestModeAndTimestamps(srcStat, dest, opts, cb);
    });
  }

  return copyFileFallback(srcStat, src, dest, opts, cb);
}

function copyFileFallback(srcStat, src, dest, opts, cb) {
  const rs = fs.createReadStream(src);
  rs.on('error', err => cb(err)).once('open', () => {
    const ws = fs.createWriteStream(dest, {
      mode: srcStat.mode
    });
    ws.on('error', err => cb(err)).on('open', () => rs.pipe(ws)).once('close', () => setDestModeAndTimestamps(srcStat, dest, opts, cb));
  });
}

function setDestModeAndTimestamps(srcStat, dest, opts, cb) {
  fs.chmod(dest, srcStat.mode, err => {
    if (err) return cb(err);

    if (opts.preserveTimestamps) {
      return utimes(dest, srcStat.atime, srcStat.mtime, cb);
    }

    return cb();
  });
}

function onDir(srcStat, destStat, src, dest, opts, cb) {
  if (destStat === notExist) return mkDirAndCopy(srcStat, src, dest, opts, cb);

  if (destStat && !destStat.isDirectory()) {
    return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
  }

  return copyDir(src, dest, opts, cb);
}

function mkDirAndCopy(srcStat, src, dest, opts, cb) {
  fs.mkdir(dest, err => {
    if (err) return cb(err);
    copyDir(src, dest, opts, err => {
      if (err) return cb(err);
      return fs.chmod(dest, srcStat.mode, cb);
    });
  });
}

function copyDir(src, dest, opts, cb) {
  fs.readdir(src, (err, items) => {
    if (err) return cb(err);
    return copyDirItems(items, src, dest, opts, cb);
  });
}

function copyDirItems(items, src, dest, opts, cb) {
  const item = items.pop();
  if (!item) return cb();
  return copyDirItem(items, item, src, dest, opts, cb);
}

function copyDirItem(items, item, src, dest, opts, cb) {
  const srcItem = path.join(src, item);
  const destItem = path.join(dest, item);
  checkPaths(srcItem, destItem, (err, destStat) => {
    if (err) return cb(err);
    startCopy(destStat, srcItem, destItem, opts, err => {
      if (err) return cb(err);
      return copyDirItems(items, src, dest, opts, cb);
    });
  });
}

function onLink(destStat, src, dest, opts, cb) {
  fs.readlink(src, (err, resolvedSrc) => {
    if (err) return cb(err);

    if (opts.dereference) {
      resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
    }

    if (destStat === notExist) {
      return fs.symlink(resolvedSrc, dest, cb);
    } else {
      fs.readlink(dest, (err, resolvedDest) => {
        if (err) {
          // dest exists and is a regular file or directory,
          // Windows may throw UNKNOWN error. If dest already exists,
          // fs throws error anyway, so no need to guard against it here.
          if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlink(resolvedSrc, dest, cb);
          return cb(err);
        }

        if (opts.dereference) {
          resolvedDest = path.resolve(process.cwd(), resolvedDest);
        }

        if (isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
        } // do not copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.


        if (destStat.isDirectory() && isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
        }

        return copyLink(resolvedSrc, dest, cb);
      });
    }
  });
}

function copyLink(resolvedSrc, dest, cb) {
  fs.unlink(dest, err => {
    if (err) return cb(err);
    return fs.symlink(resolvedSrc, dest, cb);
  });
} // return true if dest is a subdir of src, otherwise false.


function isSrcSubdir(src, dest) {
  const srcArray = path.resolve(src).split(path.sep);
  const destArray = path.resolve(dest).split(path.sep);
  return srcArray.reduce((acc, current, i) => acc && destArray[i] === current, true);
}

function checkStats(src, dest, cb) {
  fs.stat(src, (err, srcStat) => {
    if (err) return cb(err);
    fs.stat(dest, (err, destStat) => {
      if (err) {
        if (err.code === 'ENOENT') return cb(null, {
          srcStat,
          destStat: notExist
        });
        return cb(err);
      }

      return cb(null, {
        srcStat,
        destStat
      });
    });
  });
}

function checkPaths(src, dest, cb) {
  checkStats(src, dest, (err, stats) => {
    if (err) return cb(err);
    const {
      srcStat,
      destStat
    } = stats;

    if (destStat.ino && destStat.ino === srcStat.ino) {
      return cb(new Error('Source and destination must not be the same.'));
    }

    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`));
    }

    return cb(null, destStat);
  });
}

module.exports = copy;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js","../util/utimes":"node_modules/fs-extra/lib/util/utimes.js"}],"node_modules/fs-extra/lib/copy/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

module.exports = {
  copy: u(require('./copy'))
};
},{"universalify":"node_modules/universalify/index.js","./copy":"node_modules/fs-extra/lib/copy/copy.js"}],"node_modules/fs-extra/lib/remove/rimraf.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const assert = require('assert');

const isWindows = process.platform === 'win32';

function defaults(options) {
  const methods = ['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir'];
  methods.forEach(m => {
    options[m] = options[m] || fs[m];
    m = m + 'Sync';
    options[m] = options[m] || fs[m];
  });
  options.maxBusyTries = options.maxBusyTries || 3;
}

function rimraf(p, options, cb) {
  let busyTries = 0;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  assert(p, 'rimraf: missing path');
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert.strictEqual(typeof cb, 'function', 'rimraf: callback function required');
  assert(options, 'rimraf: invalid options argument provided');
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');
  defaults(options);
  rimraf_(p, options, function CB(er) {
    if (er) {
      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100; // try again, with the same exact callback as this one.

        return setTimeout(() => rimraf_(p, options, CB), time);
      } // already gone


      if (er.code === 'ENOENT') er = null;
    }

    cb(er);
  });
} // Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.


function rimraf_(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function'); // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.

  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null);
    } // Windows can EPERM on stat.  Life is suffering.


    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb);
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb);
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null);
        }

        if (er.code === 'EPERM') {
          return isWindows ? fixWinEPERM(p, options, er, cb) : rmdir(p, options, er, cb);
        }

        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb);
        }
      }

      return cb(er);
    });
  });
}

function fixWinEPERM(p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');

  if (er) {
    assert(er instanceof Error);
  }

  options.chmod(p, 0o666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}

function fixWinEPERMSync(p, options, er) {
  let stats;
  assert(p);
  assert(options);

  if (er) {
    assert(er instanceof Error);
  }

  try {
    options.chmodSync(p, 0o666);
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return;
    } else {
      throw er;
    }
  }

  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return;
    } else {
      throw er;
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}

function rmdir(p, options, originalEr, cb) {
  assert(p);
  assert(options);

  if (originalEr) {
    assert(originalEr instanceof Error);
  }

  assert(typeof cb === 'function'); // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.

  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb);
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}

function rmkids(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');
  options.readdir(p, (er, files) => {
    if (er) return cb(er);
    let n = files.length;
    let errState;
    if (n === 0) return options.rmdir(p, cb);
    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState) {
          return;
        }

        if (er) return cb(errState = er);

        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
} // this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.


function rimrafSync(p, options) {
  let st;
  options = options || {};
  defaults(options);
  assert(p, 'rimraf: missing path');
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert(options, 'rimraf: missing options');
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');

  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === 'ENOENT') {
      return;
    } // Windows can EPERM on stat.  Life is suffering.


    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return;
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
    } else if (er.code !== 'EISDIR') {
      throw er;
    }

    rmdirSync(p, options, er);
  }
}

function rmdirSync(p, options, originalEr) {
  assert(p);
  assert(options);

  if (originalEr) {
    assert(originalEr instanceof Error);
  }

  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr;
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options);
    } else if (er.code !== 'ENOENT') {
      throw er;
    }
  }
}

function rmkidsSync(p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options));

  if (isWindows) {
    // We only end up here once we got ENOTEMPTY at least once, and
    // at this point, we are guaranteed to have removed all the kids.
    // So, we know that it won't be ENOENT or ENOTDIR or anything else.
    // try really hard to delete stuff on windows, because it has a
    // PROFOUNDLY annoying habit of not closing handles promptly when
    // files are deleted, resulting in spurious ENOTEMPTY errors.
    const startTime = Date.now();

    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret;
      } catch (er) {}
    } while (Date.now() - startTime < 500); // give up after 500ms

  } else {
    const ret = options.rmdirSync(p, options);
    return ret;
  }
}

module.exports = rimraf;
rimraf.sync = rimrafSync;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js"}],"node_modules/fs-extra/lib/remove/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const rimraf = require('./rimraf');

module.exports = {
  remove: u(rimraf),
  removeSync: rimraf.sync
};
},{"universalify":"node_modules/universalify/index.js","./rimraf":"node_modules/fs-extra/lib/remove/rimraf.js"}],"node_modules/fs-extra/lib/empty/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const fs = require('fs');

const path = require('path');

const mkdir = require('../mkdirs');

const remove = require('../remove');

const emptyDir = u(function emptyDir(dir, callback) {
  callback = callback || function () {};

  fs.readdir(dir, (err, items) => {
    if (err) return mkdir.mkdirs(dir, callback);
    items = items.map(item => path.join(dir, item));
    deleteItem();

    function deleteItem() {
      const item = items.pop();
      if (!item) return callback();
      remove.remove(item, err => {
        if (err) return callback(err);
        deleteItem();
      });
    }
  });
});

function emptyDirSync(dir) {
  let items;

  try {
    items = fs.readdirSync(dir);
  } catch (err) {
    return mkdir.mkdirsSync(dir);
  }

  items.forEach(item => {
    item = path.join(dir, item);
    remove.removeSync(item);
  });
}

module.exports = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
},{"universalify":"node_modules/universalify/index.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../remove":"node_modules/fs-extra/lib/remove/index.js"}],"node_modules/fs-extra/lib/ensure/file.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const path = require('path');

const fs = require('graceful-fs');

const mkdir = require('../mkdirs');

const pathExists = require('../path-exists').pathExists;

function createFile(file, callback) {
  function makeFile() {
    fs.writeFile(file, '', err => {
      if (err) return callback(err);
      callback();
    });
  }

  fs.stat(file, (err, stats) => {
    // eslint-disable-line handle-callback-err
    if (!err && stats.isFile()) return callback();
    const dir = path.dirname(file);
    pathExists(dir, (err, dirExists) => {
      if (err) return callback(err);
      if (dirExists) return makeFile();
      mkdir.mkdirs(dir, err => {
        if (err) return callback(err);
        makeFile();
      });
    });
  });
}

function createFileSync(file) {
  let stats;

  try {
    stats = fs.statSync(file);
  } catch (e) {}

  if (stats && stats.isFile()) return;
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir);
  }

  fs.writeFileSync(file, '');
}

module.exports = {
  createFile: u(createFile),
  createFileSync
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/ensure/link.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const path = require('path');

const fs = require('graceful-fs');

const mkdir = require('../mkdirs');

const pathExists = require('../path-exists').pathExists;

function createLink(srcpath, dstpath, callback) {
  function makeLink(srcpath, dstpath) {
    fs.link(srcpath, dstpath, err => {
      if (err) return callback(err);
      callback(null);
    });
  }

  pathExists(dstpath, (err, destinationExists) => {
    if (err) return callback(err);
    if (destinationExists) return callback(null);
    fs.lstat(srcpath, err => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink');
        return callback(err);
      }

      const dir = path.dirname(dstpath);
      pathExists(dir, (err, dirExists) => {
        if (err) return callback(err);
        if (dirExists) return makeLink(srcpath, dstpath);
        mkdir.mkdirs(dir, err => {
          if (err) return callback(err);
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}

function createLinkSync(srcpath, dstpath) {
  const destinationExists = fs.existsSync(dstpath);
  if (destinationExists) return undefined;

  try {
    fs.lstatSync(srcpath);
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink');
    throw err;
  }

  const dir = path.dirname(dstpath);
  const dirExists = fs.existsSync(dir);
  if (dirExists) return fs.linkSync(srcpath, dstpath);
  mkdir.mkdirsSync(dir);
  return fs.linkSync(srcpath, dstpath);
}

module.exports = {
  createLink: u(createLink),
  createLinkSync
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/ensure/symlink-paths.js":[function(require,module,exports) {
'use strict';

const path = require('path');

const fs = require('graceful-fs');

const pathExists = require('../path-exists').pathExists;
/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */


function symlinkPaths(srcpath, dstpath, callback) {
  if (path.isAbsolute(srcpath)) {
    return fs.lstat(srcpath, err => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink');
        return callback(err);
      }

      return callback(null, {
        'toCwd': srcpath,
        'toDst': srcpath
      });
    });
  } else {
    const dstdir = path.dirname(dstpath);
    const relativeToDst = path.join(dstdir, srcpath);
    return pathExists(relativeToDst, (err, exists) => {
      if (err) return callback(err);

      if (exists) {
        return callback(null, {
          'toCwd': relativeToDst,
          'toDst': srcpath
        });
      } else {
        return fs.lstat(srcpath, err => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink');
            return callback(err);
          }

          return callback(null, {
            'toCwd': srcpath,
            'toDst': path.relative(dstdir, srcpath)
          });
        });
      }
    });
  }
}

function symlinkPathsSync(srcpath, dstpath) {
  let exists;

  if (path.isAbsolute(srcpath)) {
    exists = fs.existsSync(srcpath);
    if (!exists) throw new Error('absolute srcpath does not exist');
    return {
      'toCwd': srcpath,
      'toDst': srcpath
    };
  } else {
    const dstdir = path.dirname(dstpath);
    const relativeToDst = path.join(dstdir, srcpath);
    exists = fs.existsSync(relativeToDst);

    if (exists) {
      return {
        'toCwd': relativeToDst,
        'toDst': srcpath
      };
    } else {
      exists = fs.existsSync(srcpath);
      if (!exists) throw new Error('relative srcpath does not exist');
      return {
        'toCwd': srcpath,
        'toDst': path.relative(dstdir, srcpath)
      };
    }
  }
}

module.exports = {
  symlinkPaths,
  symlinkPathsSync
};
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/ensure/symlink-type.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

function symlinkType(srcpath, type, callback) {
  callback = typeof type === 'function' ? type : callback;
  type = typeof type === 'function' ? false : type;
  if (type) return callback(null, type);
  fs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file');
    type = stats && stats.isDirectory() ? 'dir' : 'file';
    callback(null, type);
  });
}

function symlinkTypeSync(srcpath, type) {
  let stats;
  if (type) return type;

  try {
    stats = fs.lstatSync(srcpath);
  } catch (e) {
    return 'file';
  }

  return stats && stats.isDirectory() ? 'dir' : 'file';
}

module.exports = {
  symlinkType,
  symlinkTypeSync
};
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js"}],"node_modules/fs-extra/lib/ensure/symlink.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const path = require('path');

const fs = require('graceful-fs');

const _mkdirs = require('../mkdirs');

const mkdirs = _mkdirs.mkdirs;
const mkdirsSync = _mkdirs.mkdirsSync;

const _symlinkPaths = require('./symlink-paths');

const symlinkPaths = _symlinkPaths.symlinkPaths;
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;

const _symlinkType = require('./symlink-type');

const symlinkType = _symlinkType.symlinkType;
const symlinkTypeSync = _symlinkType.symlinkTypeSync;

const pathExists = require('../path-exists').pathExists;

function createSymlink(srcpath, dstpath, type, callback) {
  callback = typeof type === 'function' ? type : callback;
  type = typeof type === 'function' ? false : type;
  pathExists(dstpath, (err, destinationExists) => {
    if (err) return callback(err);
    if (destinationExists) return callback(null);
    symlinkPaths(srcpath, dstpath, (err, relative) => {
      if (err) return callback(err);
      srcpath = relative.toDst;
      symlinkType(relative.toCwd, type, (err, type) => {
        if (err) return callback(err);
        const dir = path.dirname(dstpath);
        pathExists(dir, (err, dirExists) => {
          if (err) return callback(err);
          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback);
          mkdirs(dir, err => {
            if (err) return callback(err);
            fs.symlink(srcpath, dstpath, type, callback);
          });
        });
      });
    });
  });
}

function createSymlinkSync(srcpath, dstpath, type) {
  const destinationExists = fs.existsSync(dstpath);
  if (destinationExists) return undefined;
  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync(relative.toCwd, type);
  const dir = path.dirname(dstpath);
  const exists = fs.existsSync(dir);
  if (exists) return fs.symlinkSync(srcpath, dstpath, type);
  mkdirsSync(dir);
  return fs.symlinkSync(srcpath, dstpath, type);
}

module.exports = {
  createSymlink: u(createSymlink),
  createSymlinkSync
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","./symlink-paths":"node_modules/fs-extra/lib/ensure/symlink-paths.js","./symlink-type":"node_modules/fs-extra/lib/ensure/symlink-type.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/ensure/index.js":[function(require,module,exports) {
'use strict';

const file = require('./file');

const link = require('./link');

const symlink = require('./symlink');

module.exports = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
};
},{"./file":"node_modules/fs-extra/lib/ensure/file.js","./link":"node_modules/fs-extra/lib/ensure/link.js","./symlink":"node_modules/fs-extra/lib/ensure/symlink.js"}],"node_modules/jsonfile/index.js":[function(require,module,exports) {
var _fs
try {
  _fs = require('graceful-fs')
} catch (_) {
  _fs = require('fs')
}

function readFile (file, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }

  if (typeof options === 'string') {
    options = {encoding: options}
  }

  options = options || {}
  var fs = options.fs || _fs

  var shouldThrow = true
  if ('throws' in options) {
    shouldThrow = options.throws
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err)

    data = stripBom(data)

    var obj
    try {
      obj = JSON.parse(data, options ? options.reviver : null)
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message
        return callback(err2)
      } else {
        return callback(null, null)
      }
    }

    callback(null, obj)
  })
}

function readFileSync (file, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {encoding: options}
  }

  var fs = options.fs || _fs

  var shouldThrow = true
  if ('throws' in options) {
    shouldThrow = options.throws
  }

  try {
    var content = fs.readFileSync(file, options)
    content = stripBom(content)
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message
      throw err
    } else {
      return null
    }
  }
}

function stringify (obj, options) {
  var spaces
  var EOL = '\n'
  if (typeof options === 'object' && options !== null) {
    if (options.spaces) {
      spaces = options.spaces
    }
    if (options.EOL) {
      EOL = options.EOL
    }
  }

  var str = JSON.stringify(obj, options ? options.replacer : null, spaces)

  return str.replace(/\n/g, EOL) + EOL
}

function writeFile (file, obj, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }
  options = options || {}
  var fs = options.fs || _fs

  var str = ''
  try {
    str = stringify(obj, options)
  } catch (err) {
    // Need to return whether a callback was passed or not
    if (callback) callback(err, null)
    return
  }

  fs.writeFile(file, str, options, callback)
}

function writeFileSync (file, obj, options) {
  options = options || {}
  var fs = options.fs || _fs

  var str = stringify(obj, options)
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  content = content.replace(/^\uFEFF/, '')
  return content
}

var jsonfile = {
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
}

module.exports = jsonfile

},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js"}],"node_modules/fs-extra/lib/json/jsonfile.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const jsonFile = require('jsonfile');

module.exports = {
  // jsonfile exports
  readJson: u(jsonFile.readFile),
  readJsonSync: jsonFile.readFileSync,
  writeJson: u(jsonFile.writeFile),
  writeJsonSync: jsonFile.writeFileSync
};
},{"universalify":"node_modules/universalify/index.js","jsonfile":"node_modules/jsonfile/index.js"}],"node_modules/fs-extra/lib/json/output-json.js":[function(require,module,exports) {
'use strict';

const path = require('path');

const mkdir = require('../mkdirs');

const pathExists = require('../path-exists').pathExists;

const jsonFile = require('./jsonfile');

function outputJson(file, data, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  const dir = path.dirname(file);
  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err);
    if (itDoes) return jsonFile.writeJson(file, data, options, callback);
    mkdir.mkdirs(dir, err => {
      if (err) return callback(err);
      jsonFile.writeJson(file, data, options, callback);
    });
  });
}

module.exports = outputJson;
},{"../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js","./jsonfile":"node_modules/fs-extra/lib/json/jsonfile.js"}],"node_modules/fs-extra/lib/json/output-json-sync.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const mkdir = require('../mkdirs');

const jsonFile = require('./jsonfile');

function outputJsonSync(file, data, options) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir);
  }

  jsonFile.writeJsonSync(file, data, options);
}

module.exports = outputJsonSync;
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","./jsonfile":"node_modules/fs-extra/lib/json/jsonfile.js"}],"node_modules/fs-extra/lib/json/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const jsonFile = require('./jsonfile');

jsonFile.outputJson = u(require('./output-json'));
jsonFile.outputJsonSync = require('./output-json-sync'); // aliases

jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
module.exports = jsonFile;
},{"universalify":"node_modules/universalify/index.js","./jsonfile":"node_modules/fs-extra/lib/json/jsonfile.js","./output-json":"node_modules/fs-extra/lib/json/output-json.js","./output-json-sync":"node_modules/fs-extra/lib/json/output-json-sync.js"}],"node_modules/fs-extra/lib/move-sync/index.js":[function(require,module,exports) {
'use strict';

const fs = require('graceful-fs');

const path = require('path');

const copySync = require('../copy-sync').copySync;

const removeSync = require('../remove').removeSync;

const mkdirpSync = require('../mkdirs').mkdirsSync;

const buffer = require('../util/buffer');

function moveSync(src, dest, options) {
  options = options || {};
  const overwrite = options.overwrite || options.clobber || false;
  src = path.resolve(src);
  dest = path.resolve(dest);
  if (src === dest) return fs.accessSync(src);
  if (isSrcSubdir(src, dest)) throw new Error(`Cannot move '${src}' into itself '${dest}'.`);
  mkdirpSync(path.dirname(dest));
  tryRenameSync();

  function tryRenameSync() {
    if (overwrite) {
      try {
        return fs.renameSync(src, dest);
      } catch (err) {
        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
          removeSync(dest);
          options.overwrite = false; // just overwriteed it, no need to do it again

          return moveSync(src, dest, options);
        }

        if (err.code !== 'EXDEV') throw err;
        return moveSyncAcrossDevice(src, dest, overwrite);
      }
    } else {
      try {
        fs.linkSync(src, dest);
        return fs.unlinkSync(src);
      } catch (err) {
        if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') {
          return moveSyncAcrossDevice(src, dest, overwrite);
        }

        throw err;
      }
    }
  }
}

function moveSyncAcrossDevice(src, dest, overwrite) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    return moveDirSyncAcrossDevice(src, dest, overwrite);
  } else {
    return moveFileSyncAcrossDevice(src, dest, overwrite);
  }
}

function moveFileSyncAcrossDevice(src, dest, overwrite) {
  const BUF_LENGTH = 64 * 1024;

  const _buff = buffer(BUF_LENGTH);

  const flags = overwrite ? 'w' : 'wx';
  const fdr = fs.openSync(src, 'r');
  const stat = fs.fstatSync(fdr);
  const fdw = fs.openSync(dest, flags, stat.mode);
  let pos = 0;

  while (pos < stat.size) {
    const bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, _buff, 0, bytesRead);
    pos += bytesRead;
  }

  fs.closeSync(fdr);
  fs.closeSync(fdw);
  return fs.unlinkSync(src);
}

function moveDirSyncAcrossDevice(src, dest, overwrite) {
  const options = {
    overwrite: false
  };

  if (overwrite) {
    removeSync(dest);
    tryCopySync();
  } else {
    tryCopySync();
  }

  function tryCopySync() {
    copySync(src, dest, options);
    return removeSync(src);
  }
} // return true if dest is a subdir of src, otherwise false.
// extract dest base dir and check if that is the same as src basename


function isSrcSubdir(src, dest) {
  try {
    return fs.statSync(src).isDirectory() && src !== dest && dest.indexOf(src) > -1 && dest.split(path.dirname(src) + path.sep)[1].split(path.sep)[0] === path.basename(src);
  } catch (e) {
    return false;
  }
}

module.exports = {
  moveSync
};
},{"graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../copy-sync":"node_modules/fs-extra/lib/copy-sync/index.js","../remove":"node_modules/fs-extra/lib/remove/index.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../util/buffer":"node_modules/fs-extra/lib/util/buffer.js"}],"node_modules/fs-extra/lib/move/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const fs = require('graceful-fs');

const path = require('path');

const copy = require('../copy').copy;

const remove = require('../remove').remove;

const mkdirp = require('../mkdirs').mkdirp;

const pathExists = require('../path-exists').pathExists;

function move(src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  const overwrite = opts.overwrite || opts.clobber || false;
  src = path.resolve(src);
  dest = path.resolve(dest);
  if (src === dest) return fs.access(src, cb);
  fs.stat(src, (err, st) => {
    if (err) return cb(err);

    if (st.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`));
    }

    mkdirp(path.dirname(dest), err => {
      if (err) return cb(err);
      return doRename(src, dest, overwrite, cb);
    });
  });
}

function doRename(src, dest, overwrite, cb) {
  if (overwrite) {
    return remove(dest, err => {
      if (err) return cb(err);
      return rename(src, dest, overwrite, cb);
    });
  }

  pathExists(dest, (err, destExists) => {
    if (err) return cb(err);
    if (destExists) return cb(new Error('dest already exists.'));
    return rename(src, dest, overwrite, cb);
  });
}

function rename(src, dest, overwrite, cb) {
  fs.rename(src, dest, err => {
    if (!err) return cb();
    if (err.code !== 'EXDEV') return cb(err);
    return moveAcrossDevice(src, dest, overwrite, cb);
  });
}

function moveAcrossDevice(src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy(src, dest, opts, err => {
    if (err) return cb(err);
    return remove(src, cb);
  });
}

function isSrcSubdir(src, dest) {
  const srcArray = src.split(path.sep);
  const destArray = dest.split(path.sep);
  return srcArray.reduce((acc, current, i) => {
    return acc && destArray[i] === current;
  }, true);
}

module.exports = {
  move: u(move)
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../copy":"node_modules/fs-extra/lib/copy/index.js","../remove":"node_modules/fs-extra/lib/remove/index.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/output/index.js":[function(require,module,exports) {
'use strict';

const u = require('universalify').fromCallback;

const fs = require('graceful-fs');

const path = require('path');

const mkdir = require('../mkdirs');

const pathExists = require('../path-exists').pathExists;

function outputFile(file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding;
    encoding = 'utf8';
  }

  const dir = path.dirname(file);
  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err);
    if (itDoes) return fs.writeFile(file, data, encoding, callback);
    mkdir.mkdirs(dir, err => {
      if (err) return callback(err);
      fs.writeFile(file, data, encoding, callback);
    });
  });
}

function outputFileSync(file, ...args) {
  const dir = path.dirname(file);

  if (fs.existsSync(dir)) {
    return fs.writeFileSync(file, ...args);
  }

  mkdir.mkdirsSync(dir);
  fs.writeFileSync(file, ...args);
}

module.exports = {
  outputFile: u(outputFile),
  outputFileSync
};
},{"universalify":"node_modules/universalify/index.js","graceful-fs":"node_modules/graceful-fs/graceful-fs.js","../mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","../path-exists":"node_modules/fs-extra/lib/path-exists/index.js"}],"node_modules/fs-extra/lib/index.js":[function(require,module,exports) {
'use strict';

module.exports = Object.assign({}, // Export promiseified graceful-fs:
require('./fs'), // Export extra methods:
require('./copy-sync'), require('./copy'), require('./empty'), require('./ensure'), require('./json'), require('./mkdirs'), require('./move-sync'), require('./move'), require('./output'), require('./path-exists'), require('./remove')); // Export fs.promises as a getter property so that we don't trigger
// ExperimentalWarning before fs.promises is actually accessed.

const fs = require('fs');

if (Object.getOwnPropertyDescriptor(fs, 'promises')) {
  Object.defineProperty(module.exports, 'promises', {
    get() {
      return fs.promises;
    }

  });
}
},{"./fs":"node_modules/fs-extra/lib/fs/index.js","./copy-sync":"node_modules/fs-extra/lib/copy-sync/index.js","./copy":"node_modules/fs-extra/lib/copy/index.js","./empty":"node_modules/fs-extra/lib/empty/index.js","./ensure":"node_modules/fs-extra/lib/ensure/index.js","./json":"node_modules/fs-extra/lib/json/index.js","./mkdirs":"node_modules/fs-extra/lib/mkdirs/index.js","./move-sync":"node_modules/fs-extra/lib/move-sync/index.js","./move":"node_modules/fs-extra/lib/move/index.js","./output":"node_modules/fs-extra/lib/output/index.js","./path-exists":"node_modules/fs-extra/lib/path-exists/index.js","./remove":"node_modules/fs-extra/lib/remove/index.js"}],"app/helpers/jsx.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runJSX = void 0;

var _fsExtra = require("fs-extra");

const EXTENSION_LOCATION = csInterface.getSystemPath(SystemPath.EXTENSION);
const HOST_APPLICATION = csInterface.getHostEnvironment().appId;

const runJSX = async (name, args, useIndesignHistory = false) => {
  try {
    const filepath = `${EXTENSION_LOCATION}/jsx/${name}.jsx`;
    const fileContents = await (0, _fsExtra.readFile)(filepath, 'utf8');
    const script = `function(){\nvar exports;\n${fileContents}\nreturn exports.apply(null, ${JSON.stringify(args || [])})\n}`;
    let result;

    if (HOST_APPLICATION === 'IDSN' && !!useIndesignHistory) {
      result = await new Promise((resolve, reject) => csInterface.evalScript(`app.doScript(${script}, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.FAST_ENTIRE_SCRIPT, "${name}")`, resolve));
    } else {
      result = await new Promise((resolve, reject) => csInterface.evalScript(`(${script})()`, resolve));
    }

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.runJSX = runJSX;
},{"fs-extra":"node_modules/fs-extra/lib/index.js"}],"app/effects/JSX.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSX = void 0;

var _jsx = require("../helpers/jsx.js");

// const JSX = (fx => (action, { script, args, useIndesignHistory }) => [fx, { action, script, args, useIndesignHistory }])(
//   ({ action, script, args, useIndesignHistory }, dispatch) => runJSX(script, args, useIndesignHistory).then(res => dispatch([action[0], res]))
// )
const fxJSX = ({
  action,
  script,
  args,
  useIndesignHistory
}, dispatch) => (0, _jsx.runJSX)(script, args, useIndesignHistory).then(res => dispatch(action, res));

const JSX = props => [fxJSX, props];

exports.JSX = JSX;
},{"../helpers/jsx.js":"app/helpers/jsx.js"}],"app/main.js":[function(require,module,exports) {
"use strict";

var _hyperapp = require("hyperapp");

var _transposeLinks = require("./transposeLinks");

var _view = require("./view");

var _JSX = require("./effects/JSX");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const SetLinks = (state, links) => _objectSpread({}, state, {
  links
});

const SetBrowserItems = (state, browserItems) => _objectSpread({}, state, {
  browserItems
});

const SetEditingIndex = (state, editingItem) => _objectSpread({}, state, {
  editingItem
});

const SetEditingValue = (state, editingValue) => _objectSpread({}, state, {
  editingValue
});

const Populate = (state, data) => {
  const links = JSON.parse(data).links;
  return _objectSpread({}, state, {
    links,
    browserItems: (0, _transposeLinks.transposeLinks)(links)
  });
};

(0, _hyperapp.app)({
  init: [{
    links: [],
    browserItems: []
  }, (0, _JSX.JSX)({
    action: Populate,
    script: "getLinks",
    args: []
  })],
  view: _view.view,
  node: document.body
});
},{"hyperapp":"node_modules/hyperapp/src/index.js","./transposeLinks":"app/transposeLinks.js","./view":"app/view.js","./effects/JSX":"app/effects/JSX.js"}]},{},["app/main.js"], null)
//# sourceMappingURL=/app/main.js.map