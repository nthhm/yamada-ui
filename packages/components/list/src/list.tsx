import type {
  HTMLUIProps,
  ThemeProps,
  CSSUIObject,
  CSSUIProps,
} from "@yamada-ui/core"
import {
  ui,
  forwardRef,
  useMultiComponentStyle,
  omitThemeProps,
} from "@yamada-ui/core"
import type { IconProps } from "@yamada-ui/icon"
import { Icon } from "@yamada-ui/icon"
import { createContext, cx, getValidChildren } from "@yamada-ui/utils"

const [ListProvider, useList] = createContext<Record<string, CSSUIObject>>({
  name: `ListContext`,
  errorMessage: `useList returned is 'undefined'. Seems you forgot to wrap the components in "<List />" `,
})

type ListOptions = {
  /**
   * The CSS `list-style-type` property.
   *
   * @default 'none'
   */
  styleType?: CSSUIProps["listStyleType"]
  /**
   * The CSS `list-style-position` property.
   */
  stylePosition?: CSSUIProps["listStylePosition"]
  /**
   * The CSS `gap` property.
   *
   * @default 'sm'
   */
  gap?: CSSUIObject["gap"]
}

export type ListProps = HTMLUIProps<"ul"> & ThemeProps<"List"> & ListOptions

/**
 * `List` is a component for displaying lists. By default, it renders a `ul` element.
 *
 * @see Docs https://yamada-ui.com/components/data-display/list
 */
export const List = forwardRef<ListProps, "ul">((props, ref) => {
  const [styles, mergedProps] = useMultiComponentStyle("List", props)
  const {
    className,
    children,
    styleType: listStyleType = "none",
    stylePosition: listStylePosition,
    gap = "sm",
    ...rest
  } = omitThemeProps(mergedProps)

  const validChildren = getValidChildren(children)

  const css: CSSUIObject = {
    display: "flex",
    flexDirection: "column",
    gap,
    ms: listStyleType !== "none" ? "1.4em" : undefined,
    "& > li": { ps: listStyleType === "decimal" ? "0.3em" : undefined },
    ...styles.container,
  }

  return (
    <ListProvider value={styles}>
      <ui.ul
        ref={ref}
        listStyleType={listStyleType}
        listStylePosition={listStylePosition}
        role="list"
        className={cx("ui-list", className)}
        __css={css}
        {...rest}
      >
        {validChildren}
      </ui.ul>
    </ListProvider>
  )
})

export const DiscList = forwardRef<ListProps, "ul">(({ ...rest }, ref) => {
  return <List ref={ref} as="ul" styleType="disc" {...rest} />
})

export const DecimalList = forwardRef<ListProps, "ol">(({ ...rest }, ref) => {
  return <List ref={ref} as="ol" styleType="decimal" ms="1.2em" {...rest} />
})

export type ListItemProps = HTMLUIProps<"li">

export const ListItem = forwardRef<ListItemProps, "li">(
  ({ className, ...rest }, ref) => {
    const styles = useList()

    const css = { ...styles.item }

    return (
      <ui.li
        ref={ref}
        className={cx("ui-list-item", className)}
        __css={css}
        {...rest}
      />
    )
  },
)

export type ListIconProps = IconProps

export const ListIcon = forwardRef<ListIconProps, "svg">(
  ({ className, ...rest }, ref) => {
    const styles = useList()

    const css = { ...styles.icon }

    return (
      <Icon
        ref={ref}
        className={cx("ui-list-icon", className)}
        role="presentation"
        __css={css}
        {...rest}
      />
    )
  },
)
