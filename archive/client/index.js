/* Create an instance of CSInterface. */
const csInterface = new CSInterface();

/* Helper function to create and return a promise object */
function runExtendscriptFunction(script) {
  return new Promise(function(resolve, reject){
      csInterface.evalScript(script, resolve);
  });
}

// const keyEvents = [];  

// keyEvents.push({  
//   "keyCode": 6,   // Z - in hex: 0x06 (or 0x6).  
//   // "metaKey": true // WARNING: This is probably buggy.  
//   "ctrlKey": true, // <-- SUGGESTION: Use this instead of metaKey.  
//   "shiftKey": true, // <-- SUGGESTION: Use this instead of metaKey.  
// });  

// csInterface.registerKeyEventsInterest(JSON.stringify(keyEvents));  

const merge = (...args) => Object.assign({}, ...args)

const state = {
  links: []
}

const actions = {

  setLinks: links => state => {
    return merge(state, { links })
  },

  updateLinks: _ => (state, actions) => {
    runExtendscriptFunction('getLinks()')
      .then(res => {
        actions.setLinks(JSON.parse(res).links)
      })
  }
  
  // storeTest: _ => state => {
  //   localStorage.setItem('test', state.test)
  // },

  // retrieveTest: _ => state => {
  //   return {
  //     test: localStorage.getItem('test') || state.test
  //   }
  // }

}

const view = (state, actions) => {
  console.log(state.links)
  return(
  h( "div", {}, [
    h( "button", {
      onclick: event => actions.updateLinks()
    }, "Refresh" ),
    h( "div", {}, [
      state.links.map(path => (
        h( "div", { class: "", style: {"color": "white", "font-family": "Andale Mono", "font-size": "10px"} }, path.split(":").map(part => [
          h( "span", {}, ["/"]),
          h( "span", {}, [
            part
          ])
        ])))),
    ])
  ])
)}

const main = app(state, actions, view, document.body)

main.updateLinks()
