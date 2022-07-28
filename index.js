/*
 * Consider using a testing framework like jest. It has a VSCode extension.
 */

// might want to update this to not use canvas. that way I can just save ID's and state is
// saved on the html side.

// might also want to keep it as canvas for more control.

// ideas include ripple effect
// fading trail effect
// shrinking effect

// Initialization

async function cursr(configs) {
  let canvas = createCanvas();
  let cursor = initCursor("./circle.svg");
  document.body.appendChild(canvas);

  // initialize elements on mouseenter
  let el1 = await element(0, "./cursor.svg", pair(0, 0), cursor);
  let el2 = await element(1, "./mouse.svg", pair(0, 0), el1.coordinates);
  let elements = [el1, el2];

  addEventListener("mousemove", async () => {
    elements.push(
      await element(3, "./mouse.svg", { ...el2.coordinates }, null)
    );
  });

  // pass configs to animation loop
  let effects = [];
  effects[el1.id] = follow;
  effects[el2.id] = spring;
  effects[3] = float;

  animate(canvas, elements, effects);
}

// Animation

function animate(canvas, elements, effects) {
  clearCanvas(canvas);

  for (let i = 0; i < elements.length; i++) {
    //updateElements
    effects[elements[i].id](elements[i], element.reference);
    //update to drawElements
    drawElement(canvas, elements[i]);
    //paintElements
  }

  requestAnimationFrame(() => {
    animate(canvas, elements, effects);
  });
}

// Effects

// how can I break these up? return a vector rather than an element
function spring(element) {
  let difference = subtract(element.reference, element.coordinates);

  element.velocity.x = element.velocity.x * 0.9 + (difference.x / 2) * 0.1;
  element.velocity.y = element.velocity.y * 0.9 + (difference.y / 2) * 0.1;

  element.coordinates.x += element.velocity.x;
  element.coordinates.y += element.velocity.y;
  element.coordinates.y += 15;
}

function follow(element) {
  let difference = subtract(element.reference, element.coordinates);

  element.velocity.x = difference.x * 0.2;
  element.velocity.y = difference.y * 0.2;

  element.coordinates.x += element.velocity.x;
  element.coordinates.y += element.velocity.y;
}

function float(element) {
  element.coordinates.y += 5;
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

function createCanvas() {
  let canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas;
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderCanvas(src) {
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

function initCursor(src) {
  document.body.style.cursor = `url(${src}), auto`;
  let cursor = pair(0, 0);
  document.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });
  return cursor;
}

// Factories

function pair(x, y) {
  return {
    x,
    y,
  };
}

// I think I'll be able to remove reference. this will already
// be determined in the effects map
async function element(id, src, coordinates, reference, effect) {
  let img = await renderCanvas(src);

  return {
    id,
    img,
    velocity: pair(0, 0),
    coordinates: { ...coordinates },
    reference,
  };
}

// Main

function effect() {}

export { follow, pair, element, addElement, renderCanvas };
export default cursr;
