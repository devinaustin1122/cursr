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

  // create a cursor object to track position
  let cursor = pair(0, 0);
  document.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });

  // initialize elements
  // maybe each element can hold configs, that way for effects
  // we can just check if certain properties are available

  // maybe change to when mouse
  let el1 = await element(0, "./cursor.svg", pair(0, 0), cursor);
  let el2 = await element(1, "./mouse.svg", pair(0, 0), el1.coordinates);
  let elements = [el1, el2];

  addEventListener("mousemove", async () => {
    // elements.push(await element(3, "./mouse.svg", { ...cursor }, null));
  });

  // iniatlaize effects. maybe pass configs
  let effects = [];
  effects[el1.id] = (el) => {
    follow(el, el.reference);
  };
  effects[el2.id] = (el) => {
    follow(el, el.reference);
  };
  effects[3] = (el) => {
    float(el);
  };

  animate(canvas, elements, effects);
}

// Animation

function animate(canvas, elements, effects) {
  clearCanvas(canvas);

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    effects[element.id](element);
    drawElement(canvas, element);
  }

  requestAnimationFrame(() => {
    animate(canvas, elements, effects);
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

function float(element) {
  element.coordinates.y += 5;

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

// I think I'll be able to remove reference. this will already
// be determined in the effects map
async function element(id, src, coordinates, reference, effect) {
  let img = await createCanvas(src);

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

export { follow, pair, element, addElement, createCanvas, init };
export default effect;
