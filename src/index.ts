import { fromPromise, metaStream, fromInterval } from "@thi.ng/rstream";
import { $compile, $replace } from "@thi.ng/rdom";
import { scan, comp, reducer, map } from "@thi.ng/transducers";
import {Counter} from "./counter"

const counterComponent = () => {
	const counter = new Counter();
  let containerEl: HTMLElement;
  return {
    el: containerEl,
    mount: async (
      parent: ParentNode,
      idx: number | Element,
      ...xs: any[]
    ): Promise<Element> => {
      // container
      containerEl = document.createElement("div");
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
      // Insert container element.
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
};

const root = document.getElementById("app")!;
$compile(["div", {}, counterComponent(), counterComponent()]).mount(root);
