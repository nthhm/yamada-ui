import type { CSSUIObject, HTMLUIProps, ThemeProps } from "@yamada-ui/core"
import {
  ui,
  forwardRef,
  useMultiComponentStyle,
  omitThemeProps,
} from "@yamada-ui/core"
import { createContext, cx, omitObject } from "@yamada-ui/utils"

type TableStyleContext = Record<string, CSSUIObject>

export const [TableStyleProvider, useTableStyles] =
  createContext<TableStyleContext>({
    name: "TableStyleContext",
    errorMessage: `useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Table />" or "<NativeTable />" or "<PagingTable />"`,
  })

type NativeTableOptions = {
  /**
   * The CSS `table-layout` property.
   */
  layout?: CSSUIObject["tableLayout"]
  /**
   * If `true`, highlight the row when the table row is hovered.
   *
   * @default false
   */
  highlightOnHover?: boolean
  /**
   * If `true`, display the outer border of the table.
   *
   * @default false
   */
  withBorder?: boolean
  /**
   * If `true`, display line on the columns of the table.
   *
   * @default false
   */
  withColumnBorders?: boolean
}

export type NativeTableProps = HTMLUIProps<"table"> &
  ThemeProps<"NativeTable"> &
  NativeTableOptions

/**
 * `NativeTable` is a component for efficiently organizing and displaying data.
 *
 * @see Docs https://yamada-ui.com/components/data-display/native-table
 */
export const NativeTable = forwardRef<NativeTableProps, "table">(
  (props, ref) => {
    const [styles, mergedProps] = useMultiComponentStyle("NativeTable", props)
    const { className, layout, ...rest } = omitThemeProps(mergedProps)

    const css: CSSUIObject = { tableLayout: layout, ...styles.table }

    return (
      <TableStyleProvider value={styles}>
        <ui.table
          ref={ref}
          className={cx("ui-table", className)}
          __css={css}
          {...omitObject(rest, [
            "withBorder",
            "withColumnBorders",
            "highlightOnHover",
          ])}
        />
      </TableStyleProvider>
    )
  },
)
