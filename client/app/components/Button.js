import { h } from "hyperapp";
import cc from "classcat";

export const Button = ({ onclick, class: c }, children) => (<button class={cc(["button", c])} onclick={onclick}>
  {children}
</button>);
