import * as R from "ramda";

import { h } from "hyperapp";

import { walkParentTreeUntil } from "./helpers/browser/walkParentTreeUntil";
import { getDescendentsByIndex } from "./helpers/browser/getDescendentsByIndex";
import { setCollapsedByIndex } from "./helpers/browser/setCollapsedByIndex";
import { BrowserItem } from "./components/BrowserItem";
import { hasManyChildrenByIndex } from "./helpers/browser/hasManyChildrenByIndex";

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
          // {
          //   item.type !== "directory"
          //     ? (
          //         (state.links.filter(l => l.id === item.id)[0] || {}).status ||
          //         ""
          //       ).toLowerCase()
          //     : null
          // }
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
        />
      ))}
    </article>
  </main>
);
