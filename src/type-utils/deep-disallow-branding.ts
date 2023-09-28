declare const _anyDetector: unique symbol;

type ContainsValueDeep<T, V, True = true, False = false> = typeof _anyDetector extends T
  ? False
  : T extends V
  ? True
  : T extends Record<any, any>
  ? true extends ContainsValueDeep<T[keyof T], V>
    ? True
    : False
  : False;
type _Is<V, T extends V> = T;
type _ContainsValueTestUnknownFalse = _Is<false, ContainsValueDeep<unknown, "efg">>;
type _ContainsValueTestAnyFalse = _Is<false, ContainsValueDeep<any, "efg">>;
type _ContainsValueTestNullTrue = _Is<true, ContainsValueDeep<null, null>>;
type _ContainsValueTestNullFalse = _Is<false, ContainsValueDeep<null, "efg">>;
type _ContainsValueTestPrimitiveTrue = _Is<true, ContainsValueDeep<"abc", "abc">>;
type _ContainsValueTestPrimitiveFalse = _Is<false, ContainsValueDeep<"abc", "efg">>;
type _ContainsValueTestArrayTrue = _Is<true, ContainsValueDeep<["abc", "hij"], "abc">>;
type _ContainsValueTestArrayFalse = _Is<false, ContainsValueDeep<["abc", "hij"], "efg">>;
type _ContainsValueTestObjectTrue = _Is<true, ContainsValueDeep<{ a: "abc"; b: "hij" }, "abc">>;
type _ContainsValueTestObjectFalse = _Is<false, ContainsValueDeep<{ a: "abc"; b: "hij" }, "efg">>;
type _ContainsValueTestNestedTrue = _Is<
  true,
  ContainsValueDeep<
    [null, { a: [null, { a: [null, { a: [null, { a: "abc"; b: "hij" }]; b: "hij" }]; b: "hij" }]; b: "hij" }],
    "abc"
  >
>;
type _ContainsValueTestNestedFalse = _Is<
  false,
  ContainsValueDeep<
    [null, { a: [null, { a: [null, { a: [null, { a: "abc"; b: "hij" }]; b: "hij" }]; b: "hij" }]; b: "hij" }],
    "efg"
  >
>;

declare function logNoPii<T>(data: ContainsValueDeep<T, z.BRAND<"PII">, never, T>);

const PIIString = z.string().brand("PII");
type PIIString = z.infer<typeof PIIString>;

const email = PIIString.parse("test@example.com");

logNoPii("abc");
logNoPii(email);
logNoPii({ people: [{ email: "abc" }] });
logNoPii({ people: [{ email: email }] });
