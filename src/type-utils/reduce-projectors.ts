type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T> = Exclude<Extract<ValuesOf<T>, object>, Array<any>>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type ShallowFlatten<T extends Record<string, Record<string, unknown>>> = UnionToIntersection<ObjectValuesOf<T>>;

function makeSuperProjector<Projectors extends Record<string, (context: any) => any>>(mappings: Projectors) {
  return function mapper<Key extends keyof Projectors>(
    keys: readonly Key[],
    context: ShallowFlatten<{ [K in Key]: Parameters<Projectors[K]>[0] }>
  ): ShallowFlatten<{ [K in Key]: ReturnType<Projectors[K]> }> {
    return keys.reduce((acc, key) => Object.assign(acc, mappings[key](context)), {}) as any;
  };
}

const getProjection = makeSuperProjector({
  base: (context: { id: string }) => ({ id: context.id }),
  totalPrice: (context: { qty: number; price: number }) => ({
    qty: context.qty,
    price: context.price,
    totalPrice: context.qty * context.price,
  }),
});

const a = getProjection(["base"], { id: "abc" });
const b = getProjection(["totalPrice"], { qty: 5, price: 10 });
const c = getProjection(["base", "totalPrice"], { id: "abc", qty: 5, price: 10 });

console.log([a, b, c]);
