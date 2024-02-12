const Counter = await fetch("/zig-out/lib/zig-wasm-triangle.wasm")
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.compile(bytes))
  .then((module) => new WebAssembly.Instance(module))
  .then((instance) => {
    return class {
      constructor() {
        this._fns = instance.exports;
        this.self = instance.exports.init();
      }
      increment() {
        this._fns.increment(this.self);
      }
      get_count() {
        return this._fns.get_count(this.self);
      }
      deinit() {
        return this._fns.deinit(this.self);
      }
    };
  });
export { Counter }
