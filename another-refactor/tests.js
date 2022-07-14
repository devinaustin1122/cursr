import { follow, element, pair, initElements } from "./refactor.js";

let el = element("test.svg", pair(0, 0));
let cursor = element("test.svg", pair(100, 100));

for (let i = 0; i < 100; i++) {
  el = follow(el, cursor);
  console.log(el);
}

let particles = [];
let configs = {
  follow: {
    img: "/text.svg",
    spring: 2,
    delay: 0.5,
  },
};

let tree = {};

initElements(configs);

console.log(arr);

console.log("---------------");
console.log("tests complete");
