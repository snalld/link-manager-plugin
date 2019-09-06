import { h } from "hyperapp"

export const BrowserItemIndent = ({ level }) => (<div>
  {Array(level)
    .fill(true)
    .map(() => (<span class="item__indent">&nbsp;</span>))}
</div>);
