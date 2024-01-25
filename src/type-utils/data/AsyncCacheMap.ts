class AsyncCacheMap<K, V> {
  private readonly cache: Map<K, V | Promise<V>>;
  private readonly loader: (key: K) => Promise<V>;
  constructor(loader: (key: K) => Promise<V>) {
    this.cache = new Map<K, V | Promise<V>>();
    this.loader = loader;
  }
  async get(key: K): Promise<V | Promise<V>> {
    if (this.cache.has(key)) {
      return this.cache.get(key) as V | Promise<V>;
    }
    let promise: Promise<V> | undefined = undefined;
    promise = (async () => {
      try {
        const value = await this.loader(key);
        if (this.cache.get(key) === promise) {
          this.cache.set(key, value);
        }
        return value;
      } catch (err) {
        if (this.cache.get(key) === promise) {
          this.cache.delete(key);
        }
        throw err;
      }
    })();
    this.cache.set(key, promise);
    return promise;
  }
}
