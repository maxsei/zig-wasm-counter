import { stream, fromPromise } from "@thi.ng/rstream";
import { $compile, $replace } from "@thi.ng/rdom";
import { scan, comp, reducer, map } from "@thi.ng/transducers";

const CounterPromise = fetch("/zig-out/lib/zig-wasm-triangle.wasm")
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.compile(bytes))
  .then((module) => new WebAssembly.Instance(module))
  .then(
    (instance) =>
      class Counter {
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
      },
  );

const clickComponent = () =>
  fromPromise(
    (async () => {
      const Counter = await CounterPromise;
      const counter = new Counter();
      // TODO: onunmount destroy <12-02-24, Max Schulte> //
      const click = stream<void>();
      return [
        "div",
        { onclick: () => click.next() },
        ["div.pointer", {}, "clickme"],
        click.transform(
          comp(
            scan(
              reducer(
                () => counter,
                (acc, cur) => {
                  acc.increment();
                  return acc;
                },
              ),
            ),
            map((x) => x.get_count()),
          ),
        ),
      ];
    })(),
  );

const root = document.getElementById("app")!;
$compile([
  "div",
  {},
  $replace(clickComponent()),
  $replace(clickComponent()),
]).mount(root);
