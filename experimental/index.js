let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let particle = {
  image: preRender("./ellipse.svg"),
  ...pair(0, 0),
};
let cursor = pair(0, 0);
let velocity = pair(0, 0);
let length = 10;

// initialize
// need to update this to insert all elements we need for the effects.
function mouse() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener("mousemove", async (e) => {
    cursor = pair(e.clientX, e.clientY);
  });

  return {
    trail,
    elastic,
  };
}

// animation recursive loop
// add update function parameter
function elastic() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let spring = subtract(cursor, particle);

  velocity.x = velocity.x * 0.9 + (spring.x / length) * 0.2;
  velocity.y = velocity.y * 0.9 + (spring.y / length) * 0.2;

  particle.x = particle.x + velocity.x;
  particle.y = particle.y + velocity.y;

  ctx.drawImage(particle.image, particle.x, particle.y);
  requestAnimationFrame(elastic);
}

// animation recursive loop
// add update function parameter
function trail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let velocity = subtract(cursor, particle);

  velocity.x = velocity.x * 0.1;
  velocity.y = velocity.y * 0.1;

  particle.x = particle.x + velocity.x;
  particle.y = particle.y + velocity.y;

  ctx.drawImage(particle.image, particle.x, particle.y);
  requestAnimationFrame(trail);
}

// prerenders the image. improves performance
function preRender(src) {
  let canvasOS = document.createElement("canvas");
  let ctxOS = canvasOS.getContext("2d");
  const image = new Image();
  image.src = src;
  image.onload = () => ctxOS.drawImage(image, 0, 0);
  return canvasOS;
}

// subtracts two pairs
function subtract(first, second) {
  return pair(first.x - second.x, first.y - second.y);
}

// using the component form, gets magnitude of vector
function magnitude(component) {
  return Math.sqrt(Math.pow(component.x, 2) + Math.pow(component.y, 2));
}

// factory function for a pair object
function pair(x, y) {
  return {
    x,
    y,
  };
}
