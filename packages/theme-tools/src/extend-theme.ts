import type {
  UsageTheme,
  ThemeToken,
  ThemeTokens,
  ComponentStyle,
  ComponentSizes,
  ComponentVariants,
  ComponentDefaultProps,
  UIStyle,
  UIStyleProps,
  ComponentMultiSizes,
  ComponentMultiVariants,
  ComponentMultiStyle,
} from "@yamada-ui/core"
import { baseTheme, defaultTheme } from "@yamada-ui/theme"
import type { Dict } from "@yamada-ui/utils"
import {
  merge as mergeObject,
  getMemoizedObject as get,
  runIfFunc,
  omitObject,
  pickObject,
  isFunction,
} from "@yamada-ui/utils"

type Options = {
  merge?: boolean
  omit?: (keyof typeof defaultTheme)[]
  pick?: (keyof typeof defaultTheme)[]
}

const createExtendTheme =
  (initialTheme: Dict = defaultTheme) =>
  (...extensions: (UsageTheme | ((theme: UsageTheme) => UsageTheme))[]) =>
  ({ merge = true, pick = [], omit = [] }: Options = {}): Dict => {
    let overrides = [...extensions]
    let theme = extensions[extensions.length - 1]

    if (omit.length) initialTheme = omitObject(initialTheme, omit)
    if (pick.length) initialTheme = pickObject(initialTheme, pick)

    if (!isFunction(theme) && overrides.length > 1) {
      overrides = overrides.slice(0, overrides.length - 1)

      if (merge) theme = mergeObject(initialTheme, theme)
    } else {
      theme = merge ? initialTheme : {}
    }

    return overrides.reduce(
      (prev, extension) => mergeObject(prev, runIfFunc(extension, prev)),
      theme as Dict,
    )
  }

/**
 * Create a new theme by inheriting the default theme.
 * It is also possible to pass multiple objects and specify options.
 *
 * @see Docs https://yamada-ui.com/styled-system/theming/customize-theme#using-extendtheme
 */
export const extendTheme = createExtendTheme(defaultTheme)

/**
 * This creates a new theme that inherits only the tokens such as global styles and colors of the default theme.
 * It is also possible to pass multiple objects and specify options.
 *
 * @see Docs https://yamada-ui.com/styled-system/theming/customize-theme#using-extendbasetheme
 */
export const extendBaseTheme = createExtendTheme(baseTheme)

export const extendToken = (
  token: ThemeToken,
  tokens?: ThemeTokens,
): ThemeTokens =>
  mergeObject(get<ThemeTokens>(defaultTheme, token, {}), tokens ?? {})

export const extendStyle = (
  name: "globalStyle" | "resetStyle",
  style: UIStyle,
): UIStyle => {
  const props: UIStyleProps = {
    theme: {
      __config: {},
      __cssMap: {},
      __cssVars: {},
      __breakpoints: undefined,
    },
  }

  return mergeObject(
    runIfFunc(get<UIStyle>(defaultTheme, `styles.${name}`, {}), props),
    runIfFunc(style, props) ?? {},
  )
}

export const extendComponent = (
  name: keyof (typeof defaultTheme)["components"],
  componentStyle?: ComponentStyle | ComponentMultiStyle,
): ComponentStyle | ComponentMultiStyle =>
  mergeObject(
    get<ComponentStyle | ComponentMultiStyle>(
      defaultTheme,
      `components.${name}`,
      {},
    ),
    componentStyle ?? {},
  )

export const extendComponentSize = (
  name: keyof (typeof defaultTheme)["components"],
  componentSizes?: ComponentSizes | ComponentMultiSizes,
): ComponentSizes | ComponentMultiSizes =>
  mergeObject(
    get<ComponentSizes>(defaultTheme, `components.${name}.sizes`, {}),
    componentSizes ?? {},
  )

export const extendComponentVariant = (
  name: keyof (typeof defaultTheme)["components"],
  componentVariants?: ComponentVariants | ComponentMultiVariants,
): ComponentVariants | ComponentMultiVariants =>
  mergeObject(
    get<ComponentVariants | ComponentMultiVariants>(
      defaultTheme,
      `components.${name}.variants`,
      {},
    ),
    componentVariants ?? {},
  )

export const extendComponentDefaultProps = (
  name: keyof (typeof defaultTheme)["components"],
  componentDefaultProps?: ComponentDefaultProps,
): ComponentDefaultProps =>
  mergeObject(
    get<ComponentDefaultProps>(
      defaultTheme,
      `components.${name}.defaultProps`,
      {},
    ),
    componentDefaultProps ?? {},
  )
