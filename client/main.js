'use strict';

function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = (container && container.children[0]) || null;
  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true;
  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleElement(element)
      })
    }
  }

  function resolveNode(node) {
    return typeof node === "function"
      ? resolveNode(node(globalState, wiredActions))
      : node != null
        ? node
        : ""
  }

  function render() {
    skipRender = !skipRender;

    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, (oldNode = node));
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) out[i] = target[i];
    for (var i in source) out[i] = source[i];

    return out
  }

  function setPartialState(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] =
        path.length > 1
          ? setPartialState(path.slice(1), value, source[path[0]])
          : value;
      return clone(source, target)
    }
    return value
  }

  function getPartialState(path, source) {
    var i = 0;
    while (i < path.length) {
      source = source[path[i++]];
    }
    return source
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              var result = action(data);

              if (typeof result === "function") {
                result = result(getPartialState(path, globalState), actions);
              }

              if (
                result &&
                result !== (state = getPartialState(path, globalState)) &&
                !result.then // !isPromise
              ) {
                scheduleRender(
                  (globalState = setPartialState(
                    path,
                    clone(state, result),
                    globalState
                  ))
                );
              }

              return result
            };
          })(key, actions[key])
        : wireStateToActions(
            path.concat(key),
            (state[key] = clone(state[key])),
            (actions[key] = clone(actions[key]))
          );
    }

    return actions
  }

  function getKey(node) {
    return node ? node.key : null
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event)
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") ; else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value;
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = "";
        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i];
          if (i[0] === "-") {
            element.style.setProperty(i, style);
          } else {
            element.style[i] = style;
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (
        name in element &&
        name !== "list" &&
        name !== "type" &&
        name !== "draggable" &&
        name !== "spellcheck" &&
        name !== "translate" &&
        !isSvg
      ) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSvg = isSvg || node.nodeName === "svg")
          ? document.createElementNS(
              "http://www.w3.org/2000/svg",
              node.nodeName
            )
          : document.createElement(node.nodeName);

    var attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function() {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(
          createElement(
            (node.children[i] = resolveNode(node.children[i])),
            isSvg
          )
        );
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg
        );
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function() {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) ; else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg);
      parent.insertBefore(newElement, element);

      if (oldNode != null) {
        removeElement(parent, element, oldNode);
      }

      element = newElement;
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node;
    } else {
      updateElement(
        element,
        oldNode.attributes,
        node.attributes,
        (isSvg = isSvg || node.nodeName === "svg")
      );

      var oldKeyed = {};
      var newKeyed = {};
      var oldElements = [];
      var oldChildren = oldNode.children;
      var children = node.children;

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldKey = getKey(oldChildren[i]);
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
        }
      }

      var i = 0;
      var k = 0;

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i]);
        var newKey = getKey((children[k] = resolveNode(children[k])));

        if (newKeyed[oldKey]) {
          i++;
          continue
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
          continue
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
            k++;
          }
          i++;
        } else {
          var keyedNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
            i++;
          } else if (keyedNode[0]) {
            patch(
              element,
              element.insertBefore(keyedNode[0], oldElements[i]),
              keyedNode[1],
              children[k],
              isSvg
            );
          } else {
            patch(element, oldElements[i], null, children[k], isSvg);
          }

          newKeyed[newKey] = children[k];
          k++;
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i]);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    }
    return element
  }
}

const isString = x => typeof x === 'string';
const isArray = Array.isArray;
const arrayPush = Array.prototype.push;
const isObject = x => typeof x === 'object' && !isArray(x);

const clean = (arr, n) => (
  n && arrayPush.apply(arr, isString(n[0]) ? [n] : n), arr
);

const child = (n, cb) =>
  n != null ? (isArray(n) ? n.reduce(clean, []).map(cb) : [n + '']) : [];

const h$1 = (x, y, z) => {
  const transform = node =>
  isString(node)
    ? node
    : isObject(node[1])
      ? {
          [x]: node[0],
          [y]: node[1],
          [z]: child(node[2], transform),
        }
      : transform([node[0], {}, node[1]]);
  return transform
};

var isArray$1 = Array.isArray;

function cc(names) {
  var i,
    len,
    tmp,
    out = "",
    type = typeof names;

  if (type === "string" || type === "number") return names || ""

  if (isArray$1(names) && names.length > 0) {
    for (i = 0, len = names.length; i < len; i++) {
      if ((tmp = cc(names[i])) !== "") out += (out && " ") + tmp;
    }
  } else {
    for (i in names) {
      if (names.hasOwnProperty(i) && names[i]) out += (out && " ") + i;
    }
  }

  return out
}

const runScriptSync = (csInterface, name, argumentList, onDone) => csInterface.evalScript(`run('${name}', ${JSON.stringify(argumentList)})`, onDone);
const runScript = async (csInterface, name, argumentList) => new Promise((resolve, reject) => runScriptSync(csInterface, name, argumentList, resolve));

const merge = (...args) => Object.assign({}, ...args);

const actions = {

    setList: list => state => {
      return merge(state, { list })
    },
  
    setTree: tree => state => {
      return merge(state, { tree })
    },
  
    setActiveTreeItem: activeTreeItem => state => {
      console.log(activeTreeItem);
      return merge(state, { activeTreeItem })
    },
  
    updateLinks: _ => (state, actions) => {
      runScript(csInterface, 'getLinks.jsx')
        .then(res => {
          try {
            const links = JSON.parse(res).links;
            actions.setList(links);
            actions.updateTree(links);
          } catch (error) {
            console.log(res);
          }
        });
    },
  
    updateTree: links => (state, actions) => {
      let tree = [];
  
      links.forEach(link  => {
        
        const parts = `${link.path}${link.page ? '###' + link.page : ''}`.split(':');
        parts.reduce((a, val, idx) => {
          if (idx !== 0) 
            a = a + '/';
    
          tree = tree.filter(el => !(el.parent === a && el.name === val && idx < parts.length - 1));

          let branch = { 
            parent: a, 
            name: val, 
            indent: idx,
            
            type: idx === parts.length - 1 ? 'file' : 'folder',
          };

          if (branch.type === 'file')
            branch = merge(branch, { 
              link 
            });
          
          tree = [...tree, branch];
    
          return a + val
        }, '');
    
      });
  
      tree = tree.sort((a, b) => {
        let sa = `${a.parent}${a.name}`;
        let sb = `${b.parent}${b.name}`;
  
        if (sa === sb)
          return 0
        if (sa > sb)
          return 1
        else
          return - 1
  
      });

      console.log(state);
      
  
      actions.setTree(tree);
    },
  
  };

const state = {
  list: [],
  tree: [],
  activeTreeItem: {},
};

const Row = (attrs, children) => [ 'div', { class: 'flex items-center h-10' }, children ];


function isAChildOfB(itemB, itemA) {
  return itemB.type === 'file' && itemA.type === 'file' ?
    itemB.link.id === itemA.link.id :
    (itemA.parent + itemA.name).indexOf(itemB.parent + itemB.name) === 0
}

function isSameItem(itemB, itemA) {
  return itemB.type === 'file' && itemA.type === 'file' ?
    itemB.link.id === itemA.link.id :
    itemB.parent + itemB.name === itemA.parent + itemA.name
}

  
const Tree = ({ tree, activeItem }, actions$$1) =>
  ['div', {
      class: ''
    },
    tree.map((item, idx) => 
      ['div', {
        class: cc({
          'whitespace-no-wrap': true,
          'bg-grey-darker': isAChildOfB(activeItem, item),
        }),
        }, [
          Row({
            onclick: () => {
              actions$$1.setActiveTreeItem(item);
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
  ];

const view = (state, actions$$1) => h$1('nodeName', 'attributes', 'children')(
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
                onclick: event => actions$$1.updateLinks()
              }, 'Refresh Links'
            ],
          ]),

      ]],
      ['div', { 
          class: 'flex-1 w-full p-1 max-h-full overflow-y-auto'
        }, [
          Tree({ tree: state.tree, activeItem: state.activeTreeItem }, actions$$1),
      ]],
  ]]
);

const main = app(state, actions, view, document.body);

main.updateLinks();

module.exports = main;
