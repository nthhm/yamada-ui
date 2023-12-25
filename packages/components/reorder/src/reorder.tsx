import type { CSSUIObject, HTMLUIProps, ThemeProps } from "@yamada-ui/core"
import { ui, useMultiComponentStyle, omitThemeProps } from "@yamada-ui/core"
import type { HTMLMotionProps } from "@yamada-ui/motion"
import { MotionReorder } from "@yamada-ui/motion"
import {
  createContext,
  cx,
  getValidChildren,
  handlerAll,
  useUpdateEffect,
} from "@yamada-ui/utils"
import { forwardRef, useCallback, useMemo, useState } from "react"

type ReorderContext = {
  orientation: "vertical" | "horizontal"
  styles: Record<string, CSSUIObject>
}

export const [ReorderProvider, useReorderContext] =
  createContext<ReorderContext>({
    name: "ReorderContext",
    errorMessage: `useReorderContext returned is 'undefined'. Seems you forgot to wrap the components in "<Reorder />"`,
  })

type ReorderOptions = {
  /**
   * The orientation of the reorder.
   *
   * @default 'vertical'
   */
  orientation?: "vertical" | "horizontal"
  /**
   * The callback invoked when reorder items are moved.
   */
  onChange?: (labels: (string | number)[]) => void
  /**
   * The callback invoked when the movement of reorder items is completed.
   */
  onCompleteChange?: (labels: (string | number)[]) => void
}

export type ReorderProps = Omit<HTMLUIProps<"ul">, "as" | "onChange"> &
  Omit<HTMLMotionProps<"ul">, "as" | "onChange"> &
  ThemeProps<"Reorder"> &
  ReorderOptions

const omitDuplicated = (values: (string | number)[]): (string | number)[] =>
  Array.from(new Set(values))

const pickDuplicated = (values: (string | number)[]): (string | number)[] =>
  values.filter(
    (value, index, self) =>
      self.indexOf(value) === index && index !== self.lastIndexOf(value),
  )

/**
 * `Reorder` is a component that allows you to change the order of items using drag and drop.
 *
 * @see Docs https://yamada-ui.com/components/data-display/reorder
 */
export const Reorder = forwardRef<HTMLUListElement, ReorderProps>(
  (props, ref) => {
    const [styles, mergedProps] = useMultiComponentStyle("Reorder", props)
    const {
      className,
      orientation = "vertical",
      gap = "md",
      onChange,
      onCompleteChange,
      children,
      ...rest
    } = omitThemeProps(mergedProps)

    const axis = orientation === "vertical" ? "y" : "x"

    const validChildren = getValidChildren(children)

    const defaultValues = useMemo(() => {
      const values = validChildren.map(({ props }) => props.label)

      const duplicatedValues = pickDuplicated(values)

      if (duplicatedValues.length)
        console.warn(
          `Reorder: 'label' of 'ReorderItem' must not be duplicated. duplicate 'label' is '${duplicatedValues.join(
            `', '`,
          )}' `,
        )

      return omitDuplicated(values)
    }, [validChildren])

    const [values, setValues] = useState<(string | number)[]>(defaultValues)

    const onReorder = useCallback(
      (newValues: (string | number)[]) => {
        setValues(newValues)

        onChange?.(newValues)
      },
      [onChange],
    )

    useUpdateEffect(() => {
      const isDone = defaultValues.every((defaultValue) =>
        values.includes(defaultValue),
      )

      if (isDone) return

      setValues(defaultValues)
    }, [defaultValues])

    const cloneChildren = useMemo(
      () =>
        values.map((value) =>
          validChildren.find(({ props }) => props.label === value),
        ),
      [values, validChildren],
    )

    const css: CSSUIObject = {
      display: "flex",
      flexDirection: orientation === "vertical" ? "column" : "row",
      gap,
      ...styles.container,
    }

    return (
      <ReorderProvider value={{ orientation, styles }}>
        <ui.ul
          ref={ref}
          as={MotionReorder.Group}
          className={cx("ui-reorder", className)}
          axis={axis}
          values={values}
          onReorder={onReorder}
          __css={css}
          {...rest}
          onMouseUp={handlerAll(
            rest.onMouseUp,
            () => onCompleteChange?.(values),
          )}
          onTouchEnd={handlerAll(
            rest.onTouchEnd,
            () => onCompleteChange?.(values),
          )}
        >
          {cloneChildren}
        </ui.ul>
      </ReorderProvider>
    )
  },
)

Reorder.displayName = "Reorder"
