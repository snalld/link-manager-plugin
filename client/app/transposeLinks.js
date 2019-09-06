export function transposeLinks(links) {
  let browserItems = new Map()
  let counter = 0
  links.forEach((link) => {
    const parts = `${link.path}`.split(":")
    parts.forEach((val, idx) => {
      const path = [...parts.slice(0, idx), val]
      const itemType = idx !== parts.length - 1 ? "directory" : "file"

      let key = null
      let id = null
      let content = path[path.length - 1]
      let indent = idx
      let location = null

      if (itemType === "file") {
        content = val
        location = link.location.padStart(3, "0")
        id = `${counter}`.padStart(3, "0")
        counter++

        // Add file group
        const groupKey = [...path].join("/")

        if (!browserItems.has(groupKey)) {
          browserItems.set(groupKey, {
            key: groupKey,
            content,
            indent,
            type: "group",
            isCollapsed: true
          })
        } else {
          // Default state expanded
          browserItems.set(groupKey, {
            ...browserItems.get(groupKey),
            isCollapsed: false
          })
        }

        indent++
      }

      key = [...path, location, id].filter((e) => !!e).join("/")
      browserItems.set(key, {
        key,
        content,
        indent,
        type: itemType,
        location
      })
    })
  })

  const sortedBrowserItems = [...browserItems.values()].sort((a, b) => {
    const aKey = a.key
    const bKey = b.key
    return aKey === bKey ? 0 : aKey < bKey ? -1 : 1
  })

  return sortedBrowserItems
}
