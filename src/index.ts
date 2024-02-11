import { reactive, fromPromise, sync } from "@thi.ng/rstream";
import { $compile } from "@thi.ng/rdom";

const addFunction = fromPromise(
  fetch("/zig-out/lib/zig-wasm-triangle.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.compile(bytes))
    .then((module) => new WebAssembly.Instance(module))
    .then((instance) => instance.exports.add),
);

const a = reactive(0);
const b = reactive(0);

const numInput = (i) => [
  "input",
  {
    oninput: (e) => {
      const v = parseFloat(e.target.value);
      v && i.next(v);
    },
  },
  b,
];

const root = document.getElementById("app")!;
$compile([
  "div",
  {},
  numInput(a),
  "+",
  numInput(b),
  "=",
  sync({ src: { addFunction, a, b } }).map(({ addFunction, a, b }) =>
    addFunction(a, b),
  ),
]).mount(root);
