import {
  follow,
  element,
  pair,
  initElements,
  addElement,
  render,
} from "./refactor.js";

let particles = [];
let configs = {
  type: "follow",
  img: "/text.svg",
  spring: 2,
  delay: 0.5,
};

let elements = initElements(configs);
console.debug(JSON.stringify(elements, null, 4));

let el = element("test.svg", pair(0, 0));
let arr = [];
let tmp = addElement(arr, el);
tmp = addElement(tmp, el);
console.log(tmp);

let img = render("test.svg");
console.log(img);

console.log("---------------");
console.log("tests complete");
