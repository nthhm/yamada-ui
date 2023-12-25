import type { HTMLUIProps, CSSUIObject } from "@yamada-ui/core"
import { ui, forwardRef } from "@yamada-ui/core"
import { getValidChildren, cx, replaceObject } from "@yamada-ui/utils"
import type { ReactElement } from "react"
import { cloneElement, Fragment, useMemo } from "react"

type StackOptions = {
  /**
   * The CSS `flex-direction` property.
   */
  direction?: CSSUIObject["flexDirection"]
  /**
   * The CSS `justify-content` property.
   */
  justify?: CSSUIObject["justifyContent"]
  /**
   * The CSS `align-items` property.
   */
  align?: CSSUIObject["alignItems"]
  /**
   * The CSS `flex-wrap` property.
   */
  wrap?: CSSUIObject["flexWrap"]
  /**
   * If `true`, each stack item will show a divider.
   */
  divider?: ReactElement
}

export type StackProps = Omit<HTMLUIProps<"div">, "direction"> & StackOptions

/**
 * `Stack` is a component that groups elements and provides space between child elements.
 *
 * @see Docs https://yamada-ui.com/components/layouts/stack
 */
export const Stack = forwardRef<StackProps, "div">(
  (
    {
      direction: flexDirection = "column",
      justify: justifyContent,
      align: alignItems,
      wrap: flexWrap,
      gap = "md",
      divider,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isColumn = (value: any) =>
      value === "column" || value === "column-reverse"

    const dividerCSS = useMemo(
      () => ({
        w: replaceObject(flexDirection, (value) =>
          isColumn(value) ? "100%" : "fix-content",
        ),
        h: replaceObject(flexDirection, (value) =>
          isColumn(value) ? "fix-content" : "100%",
        ),
        borderLeftWidth: replaceObject(flexDirection, (value) =>
          isColumn(value) ? 0 : "1px",
        ),
        borderBottomWidth: replaceObject(flexDirection, (value) =>
          isColumn(value) ? "1px" : 0,
        ),
      }),
      [flexDirection],
    )

    const validChildren = getValidChildren(children)

    const cloneChildren = divider
      ? validChildren.map((child, index) => {
          const key = typeof child.key !== "undefined" ? child.key : index

          const cloneDivider = cloneElement(
            divider as React.ReactElement<any>,
            {
              __css: dividerCSS,
            },
          )

          return (
            <Fragment key={key}>
              {!!index ? cloneDivider : null}
              {child}
            </Fragment>
          )
        })
      : validChildren

    const css: CSSUIObject = useMemo(
      () => ({
        display: "flex",
        flexDirection,
        justifyContent,
        alignItems,
        flexWrap,
        gap,
      }),
      [alignItems, flexDirection, flexWrap, gap, justifyContent],
    )

    return (
      <ui.div
        ref={ref}
        className={cx("ui-stack", className)}
        __css={css}
        {...rest}
      >
        {cloneChildren}
      </ui.div>
    )
  },
)

export const HStack = forwardRef<StackProps, "div">((props, ref) => (
  <Stack ref={ref} direction="row" align="center" {...props} />
))

export const VStack = forwardRef<StackProps, "div">((props, ref) => (
  <Stack ref={ref} direction="column" align="stretch" w="100%" {...props} />
))
