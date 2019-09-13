export function transposeLinks(links) {
  let browserItems = new Map();
  let counter = 0;
  links.forEach(link => {
    const parts = `${link.path}`.split(":");
    parts.forEach((val, idx) => {
      const path = [...parts.slice(0, idx), val];
      const itemType = idx !== parts.length - 1 ? "directory" : "file";

      let key = null;
      let order = null;
      let id = null;
      let value = path[path.length - 1];
      let indent = idx;
      let location = null;

      if (itemType === "file") {
        value = val;
        location = link.location.padStart(3, "0");
        order = `${counter}`.padStart(3, "0")
        id = link.id
        counter++;

        // Add file group
        const groupKey = [...path].join("/");

        if (!browserItems.has(groupKey)) {
          browserItems.set(groupKey, {
            key: groupKey,
            value,
            indent,
            type: "group",
            isCollapsed: true
          });
        } else {
          // Default state expanded
          browserItems.set(groupKey, {
            ...browserItems.get(groupKey),
            isCollapsed: false
          });
        }

        indent++;
      }

      key = [...path, location, order]
        .filter(e => !!e)
        .join("/");
      browserItems.set(key, {
        key,
        id,
        value,
        indent,
        type: itemType,
        location
      });
    });
  });

  const sortedBrowserItems = [...browserItems.values()].sort((a, b) => {
    const aKey = a.key;
    const bKey = b.key;
    return aKey === bKey ? 0 : aKey < bKey ? -1 : 1;
  });

  return sortedBrowserItems;
}
