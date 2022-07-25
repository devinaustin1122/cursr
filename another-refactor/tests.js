import { follow, element, pair, initElements } from "./refactor.js";

// let el = element("test.svg", pair(0, 0));
// let cursor = element("test.svg", pair(100, 100));

// for (let i = 0; i < 100; i++) {
//   el = follow(el, cursor);
//   console.log(el);
// }

let particles = [];
let configs = [
  {
    type: "follow",
    img: "/text.svg",
    spring: 2,
    delay: 0.5,
    children: [
      {
        type: "spawn",
        img: "/text.svg",
        spring: 2,
        delay: 0.5,
      },
    ],
  },
];

let elements = initElements(configs);
console.debug(JSON.stringify(elements, null, 4));

console.log("---------------");
console.log("tests complete");
