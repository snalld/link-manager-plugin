import { h } from "hyperapp"
import cc from "classcat"
import { BrowserItemIndent } from "./BrowserItemIndent"

export const BrowserItem = (
  {
    content,
    indent,
    collapsable = true,
    isCollapsed,
    isHidden,
    isEditing,
    setCollapsed = () => {},
    setEditing = () => {}
  },
  children
) => (
  <div class={cc(["item", { hidden: isHidden }])}>
    {!!collapsable && (
      <div>
        {!isCollapsed ? (
          <p onclick={() => setCollapsed(true)}>-</p>
        ) : (
          <p onclick={() => setCollapsed(false)}>+</p>
        )}
      </div>
    )}
    <BrowserItemIndent level={indent} />
    {!isEditing ?
      <div class="item__content" ondblclick={setEditing}>
      <p>{content}</p>
    </div> :
    <div><input type="text" value={content}/></div>
    }
  </div>
)
