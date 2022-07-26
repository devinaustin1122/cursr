/*
 * Consider using a testing framework like jest. It has a VSCode extension.
 */

const global = {
  cursor: pair(-100, -100),
  elements: [],
};

// Initialization

async function init() {
  let canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  // promises work in order to ensure image is properly loaded.
  // could potentially wrap in try catch.
  let el = await element("./public/images/mouse.svg", pair(0, 0));
  draw(canvas, el.img);

  document.addEventListener("mousemove", (e) => {
    global.cursor = pair(e.clientX, e.clientY);
  });

  // how can I cleanly handle updating cursor on mouse move.
  loop();
}

// Animation

function loop() {
  console.log(global.cursor);
  requestAnimationFrame(loop);
}

// Effects

function follow(element, following) {
  let difference = subtract(following.coordinates, element.coordinates);

  let spring = false;

  if (spring) {
    element.velocity.x = element.velocity.x * 0.9 + (difference.x / 2) * 0.1;
    element.velocity.y = element.velocity.y * 0.9 + (difference.y / 2) * 0.1;
  } else {
    element.velocity.x = difference.x * 0.5;
    element.velocity.y = difference.y * 0.5;
  }

  element.coordinates.x += element.velocity.x;
  element.coordinates.y += element.velocity.y;
  return element;
}

// Utility

function subtract(minuend, subtrahend) {
  return pair(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
}

function addElement(list, element) {
  return [...list, element];
}

function draw(canvas, img) {
  let context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
}

function createCanvas(src) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;

    let context = canvas.getContext("2d");

    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      resolve(canvas);
    };
    image.src = src;
  });
}

// Factories

function pair(x, y) {
  return {
    x,
    y,
  };
}

async function element(src, coordinates, effect) {
  let img = await createCanvas(src);

  return {
    img,
    velocity: pair(0, 0),
    coordinates: { ...coordinates },
    update: () => {
      console.log("update");
    },
  };
}

// Main

function effect() {}

export { follow, pair, element, addElement, createCanvas, init };
export default effect;
