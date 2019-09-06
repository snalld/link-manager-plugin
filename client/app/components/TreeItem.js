import cc from 'classcat'
import { repeat } from 'ramda'

import { Row } from './Row.js'

export const TreeItem = ({ item, isSelected, isChildOfSelected, setSelected, setEditing, bumpDate }) =>
  Row(
    {
      class: {
        'whitespace-no-wrap': true,
        'bg-grey-darker': isSelected || isChildOfSelected,
      },
      onclick: () => {
        setSelected()
      },
      ondblclick: () => {
        setEditing()
      },
    },
    [
      repeat('  ', item.indent).map(el => [
        'span',
        {
          class: 'pr-8',
        },
      ]),
      [
        'span',
        {
          class: cc({
            'whitespace-no-wrap': true,
            'font-bold': isSelected,
          }),
        },
        item.name,
      ],
      ['button', { class: cc({'button': true}), onclick: bumpDate }, 'Bump Date']
    ]
  )
