/*
 * Consider using a testing framework like jest. It has a VSCode extension.
 */

// use a map to link elements to effects?
// i'm avoiding OOP programming. this is where most of the difficulty
// is coming from. but what am I really gaining from this approach?

// Initialization

async function init() {
  let canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  let elements = {
    permanent: [],
    spawned: [],
  };

  let cursor = pair(0, 0);
  document.addEventListener("mousemove", async (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    elements.spawned.push(
      await element("./public/images/mouse.svg", pair(0, 0), cursor)
    );
  });

  let el1 = await element("./public/images/mouse.svg", pair(0, 0), cursor);
  let el2 = await element(
    "./public/images/mouse.svg",
    pair(0, 0),
    el1.coordinates
  );
  let el3 = await element(
    "./public/images/mouse.svg",
    pair(0, 0),
    el2.coordinates
  );

  elements.permanent.push(el1);
  elements.permanent.push(el2);
  elements.permanent.push(el3);
  loop(canvas, elements);
}

// Animation

function loop(canvas, elements) {
  clearCanvas(canvas);

  let element = elements.permanent[0];
  elements.permanent[0] = follow(element, element.reference);
  drawElement(canvas, element);

  console.log(elements.spawned);

  requestAnimationFrame(() => {
    loop(canvas, elements);
  });
}

// Effects

function follow(element, to) {
  let difference = subtract(to, element.coordinates);

  let spring = true;

  if (spring) {
    element.velocity.x = element.velocity.x * 0.9 + (difference.x / 2) * 0.1;
    element.velocity.y = element.velocity.y * 0.9 + (difference.y / 2) * 0.1;
  } else {
    element.velocity.x = difference.x * 0.5;
    element.velocity.y = difference.y * 0.5;
  }

  element.coordinates.x += element.velocity.x;
  element.coordinates.y += element.velocity.y;
  element.coordinates.y += 20;

  return element;
}

// Utility

function subtract(minuend, subtrahend) {
  return pair(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
}

function addElement(list, element) {
  return [...list, element];
}

function drawElement(canvas, element) {
  let context = canvas.getContext("2d");
  context.drawImage(element.img, element.coordinates.x, element.coordinates.y);
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

async function element(src, coordinates, reference, effect) {
  let img = await createCanvas(src);

  return {
    img,
    velocity: pair(0, 0),
    coordinates: { ...coordinates },
    reference,
  };
}

// Main

function effect() {}

export { follow, pair, element, addElement, createCanvas, init };
export default effect;
