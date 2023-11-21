export type ReactTag = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

type CleanProps<TTag extends ReactTag, OmitProps extends string> = TTag extends React.ElementType
  ? Omit<React.ComponentProps<TTag>, "ref" | "as" | OmitProps>
  : never;

export type AsComponentProps<TTag extends ReactTag, OmitProps extends string = never> = CleanProps<TTag, OmitProps> & {
  as?: TTag;
};
