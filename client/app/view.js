import * as R from "ramda";

import { h } from "hyperapp";

/** Effects */
import { JSX } from "./effects/JSX";

/** Components */
import { BrowserItem } from "./components/BrowserItem";

/** Helpers */
import { walkParentTreeUntil } from "./helpers/browser/walkParentTreeUntil";
import { getDescendentsByIndex } from "./helpers/browser/getDescendentsByIndex";
import { setCollapsedByIndex } from "./helpers/browser/setCollapsedByIndex";
import { hasManyChildrenByIndex } from "./helpers/browser/hasManyChildrenByIndex";
import { nearestParentDir } from "./helpers/nearestParentDir";
import { dispatchEvent } from "./helpers/dispatchEvent";

// const FX = props => {
//   return [fx, (dispatch, { action, pathname }) => {
//     return Promise.resolve(true).then(res => dispatch(action, pathname))
//   }];
// };

export const view = state => (
  <main class="">
    {console.log(state)}
    <article class="browser">
      {state.browserItems.map((item, idx, browserItems) => (
        <BrowserItem
          value={item.value}
          indent={item.indent}
          collapsable={
            item.type === "directory" ||
            hasManyChildrenByIndex(idx, browserItems)
          }
          status={(() => {
            if (item.type !== "directory")
              return (
                (
                  state.links.filter(
                    l =>
                      l.id ===
                      (item.type === "group" ? browserItems[idx + 1] : item).id
                  )[0] || {}
                ).status || ""
              ).toLowerCase();
          })()}
          isSelected={(() => {
            if (item.type === "file")
              return state.selectedLinkIDs.includes(item.id);
            else if (item.type === "group")
              return R.all(
                child => state.selectedLinkIDs.includes(child.id),
                getDescendentsByIndex(idx, browserItems)
              );
          })()}
          isCollapsed={item.isCollapsed}
          isHidden={
            item.isHidden ||
            walkParentTreeUntil(
              parent => !!parent.isCollapsed,
              idx,
              browserItems
            )
          }
          setCollapsed={value => setCollapsedByIndex(state, idx, value)}
          onDoubleClick={state =>
            item.type === "directory"
              ? [
                  state,
                  JSX({
                    action: (state, result) => {
                      dispatchEvent("com.linkmanager.replaceFolderLocation", {
                        newLocation: result,
                        oldLocation: item.key
                      });
                      return state;
                    },
                    filename: "selectFolderWithDialogue",
                    args: [nearestParentDir(item.key)]
                  })
                ]
              : null
          }
          // onLoad={
          //   state => [state, FX({
          //     pathname: item.key,
          //     action: state => null,
          //   })]
          // {
          //   if (item.type === "directory") {
          //     try {
          //       var res = fs.accessSync(item.key, fs.constants.F_OK);
          //       console.log(true);
          //       // return true;
          //     } catch (error) {
          //       console.log(false);
          //       // return false;
          //     }
          //   }

          //   return null;
          // }}
          // }
        />
      ))}
    </article>
  </main>
);
