/**
 * @file Brand
 *
 * Provides a way to distinguish primitives from each other that would otherwise
 * be considered compatible. Although the types may be incompatible, there's
 * no runtime enforcement.
 *
 * See https://github.com/Microsoft/TypeScript/issues/202
 * See https://github.com/spion/branded-types
 */

//
// NOTE: Zod provides a way to do branding that may be preferable
//

/**
 * Made-up symbol that doesn't exist. It's purpose is to help discriminate types
 * for type checking purposes only.
 */
declare const __brand: unique symbol;

type Discriminator = string | number | symbol;

/** Brands a type */
export type Branded<B extends Discriminator, T extends NonNull> = T & { [__brand]: B };

/** Removes the brand from an already branded type */
export type Unbranded<T extends Branded<any, any>> = T extends Branded<any, infer U> ? U : never;

/** Infers the Branded type from a Brand object */
export type InferBranded<B extends Brand<any, any>> = B extends Brand<infer D, infer T> ? Branded<D, T> : never;

interface Brand<B extends Discriminator, V extends NonNull = NonNull> {
  /**
   * Used to cast a value into a branded type.
   * This is better than using an `as BrandedType` since that can lose useful
   * type information.
   * This is a no-op at runtime.
   */
  <T extends V>(value: T): Branded<B, T>;

  /**
   * Removes the brand from a branded value
   * This is a no-op at runtime.
   */
  unbrand<T extends V>(value: Branded<B, T>): T;
}

/**
 * Creates a function for branding and unbranding values. It's a no-op at runtime.
 *
 * @example ```ts
 * const UuidBrand = Brand<"UUID", string>();
 * let myUuid = UuidBrand("123");
 *
 * const RedactedBrand = Brand<"Redacted">();
 * let myRedacted = RedactedBrand("123");
 *
 * // Error
 * myUuid = myRedacted
 * myRedacted = myUuid;
 *
 * // Okay
 * let aString: string = myUuid;
 * ```
 */
export function Brand<B extends Discriminator = never, V extends NonNull = NonNull>() {
  const brand: Brand<B, V> = <T extends V>(value: T) => value as Branded<B, T>;
  brand.unbrand = (value) => value;
  return brand;
}
