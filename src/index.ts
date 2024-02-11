import { stream, fromPromise, sync } from "@thi.ng/rstream";
import { $compile } from "@thi.ng/rdom";

const fns = fromPromise(
  fetch("/zig-out/lib/zig-wasm-triangle.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.compile(bytes))
    .then((module) => new WebAssembly.Instance(module))
    .then((instance) => instance.exports),
);

const click = stream<void>();
const root = document.getElementById("app")!;
$compile([
  "div",
  { onclick: () => click.next() },
  ["div.pointer", {}, "clickme"],
  sync({ src: { fns, click } }).map(({ fns }) => fns.counter()),
]).mount(root);
