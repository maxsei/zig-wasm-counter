import { fromPromise, metaStream, fromInterval } from "@thi.ng/rstream";
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
      // counter
      const Counter = await CounterPromise;
      const counter = new Counter();
      // container
      let containerEl = document.createElement("div");
      containerEl.classList = ["pointer"];
      // Message
      let messageEl = document.createElement("span");
      messageEl.innerText = "Click Me: ";
      containerEl.appendChild(messageEl);
      // counter element
      let counterEl = document.createElement("span");
      counterEl.innerText = `${counter.get_count()}`;
      containerEl.appendChild(counterEl);
      containerEl.onclick = (e: MouseEvent) => {
        counter.increment();
        counterEl.innerText = `${counter.get_count()}`;
      };
      // IComponent
      return {
        el: containerEl,
        mount: async (
          parent: ParentNode,
          idx: number | Element,
          ...xs: any[]
        ): Promise<Element> => {
          if (idx === -1 || parent.childElementCount === idx) {
            parent.appendChild(containerEl);
          } else {
            parent.insertBefore(containerEl, parent.childNodes[idx]);
          }
          return parent;
        },
        unmount: async (): Promise<void> => {
          containerEl.remove();
          counter.deinit();
        },
      };
    })(),
  );

const root = document.getElementById("app")!;
$compile([
  "div",
  {},
  $replace(clickComponent()),
  $replace(clickComponent()),
]).mount(root);
