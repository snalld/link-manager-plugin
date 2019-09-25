import { h } from "hyperapp";
import cc from "classcat";
import { BrowserItemIndent } from "./BrowserItemIndent";

export const BrowserItem = (
  {
    value,
    indent,
    type,
    collapsable = true,
    status,
    isSelected,
    isCollapsed,
    isHidden,
    isEditing,
    setCollapsed = () => {},
    // setEditing = () => {},
    setSelected = () => {},
    onLoad = () => {},
    onDoubleClick = () => {},
  },
  children
) => (
  <div
    class={cc([
      "item",
      type,
      {
        selected: isSelected,
        hidden: isHidden
      }
    ])}
  >
    { onLoad() }
    {!!collapsable && (
      <div class="button--small">
        {!isCollapsed ? (
          <p onclick={() => setCollapsed(true)}>-</p>
        ) : (
          <p onclick={() => setCollapsed(false)}>+</p>
        )}
      </div>
    )}
    <BrowserItemIndent level={indent} />
    {!isEditing ? (
      <div
        class={cc(["item__content", `status-${status}`])}
        // ondblclick={setEditing}
        ondblclick={onDoubleClick}
      >
        <p>{value}</p>
      </div>
    ) : (
      <div>
        <input type="text" value={value} />
      </div>
    )}
  </div>
);
