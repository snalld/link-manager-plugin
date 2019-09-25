import path from "path";
import { promisify } from "util";
const fs = eval('require("fs")');
const access = promisify(fs.access);

export const nearestParentDir = async (pathname, defaultPathname) => {
  let parent = pathname;
  do {
    try {
      await access(parent, fs.constants.F_OK);
      return parent;
    }
    catch (error) {
      parent = path.dirname(parent);
    }
  } while (parent);
};
