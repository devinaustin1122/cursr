import { follow, element, pair, addElement } from "./refactor.js";

let particles = [];
let configs = {
  type: "follow",
  img: "/text.svg",
  spring: 2,
  delay: 0.5,
};

console.debug(JSON.stringify(elements, null, 4));

let el = element("test.svg", pair(0, 0));
let arr = [];
let tmp = addElement(arr, el);
tmp = addElement(tmp, el);
console.log(tmp);

console.log("---------------");
console.log("tests complete");
