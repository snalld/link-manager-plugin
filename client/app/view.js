import { h } from "hyperapp"

import { walkParentTreeUntil } from "./helpers/browser/walkParentTreeUntil"
import { getDescendentsByIndex } from "./helpers/browser/getDescendentsByIndex"
import { setCollapsedByIndex } from "./helpers/browser/setCollapsedByIndex"
import { BrowserItem } from "./components/BrowserItem"
import { hasManyChildrenByIndex } from "./helpers/browser/hasManyChildrenByIndex";


export const view = (state) => (
  <main class="">
    {console.log(state)}
    <article class="browser">
      {state.browserItems.map((item, idx, browserItems) => (
        <BrowserItem
          content={item.content}
          indent={item.indent}
          collapsable={
            item.type === "directory" ||
            hasManyChildrenByIndex(idx, browserItems)
          }
          isCollapsed={item.isCollapsed}
          isHidden={
            item.isHidden ||
            walkParentTreeUntil(
              (parent) => !!parent.isCollapsed,
              idx,
              browserItems
            )
          }
          setCollapsed={(value) => setCollapsedByIndex(state, idx, value)}
        />
      ))}
    </article>
  </main>
)

// const Directory = ({
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