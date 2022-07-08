let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
let particles = [particle("./ellipse.svg")];
let cursor = pair(0, 0);
let length = 10;

// initialize everything
function init() {
  // this needs to be updated
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// function prepares and returns all relevant effects
function follow() {
  init();
  document.body.appendChild(canvas);
  document.addEventListener("mousemove", (e) => {
    cursor = pair(e.clientX, e.clientY);
  });

  return {
    trail,
    elastic,
  };
}

// function prepares and returns all relevant effects
function spawn() {
  init();
  document.body.appendChild(canvas);
  document.addEventListener("mousemove", (e) => {
    addParticle(pair(e.clientX, e.clientY), 100);
  });

  return {
    float,
  };
}

// add particle to particles list
function addParticle(coordinates, limit) {
  let particle;
  if (particles.length > limit) {
    particle = particles.pop();
  } else {
    particle = {
      image: preRender("./ellipse.svg"),
      opacity: 1,
      ...coordinates,
    };
  }

  particles.unshift({
    ...particle,
    opacity: 1,
    ...coordinates,
  });
}

// floating effect
function float() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].y -= 1;
    particles[i].opacity *= 0.9;
    ctx.globalAlpha = particles[i].opacity;
    ctx.drawImage(particles[i].image, particles[i].x, particles[i].y);
  }
  requestAnimationFrame(float);
}

// animation recursive loop
// add update function parameter
function elastic() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let spring = subtract(cursor, particles[0]);

  particles[0].velocity.x =
    particles[0].velocity.x * 0.9 + (spring.x / length) * 1;
  particles[0].velocity.y =
    particles[0].velocity.y * 0.9 + (spring.y / length) * 1;

  particles[0].x = particles[0].x + particles[0].velocity.x;
  particles[0].y = particles[0].y + particles[0].velocity.y;

  ctx.drawImage(particles[0].image, particles[0].x, particles[0].y);
  requestAnimationFrame(elastic);
}

// animation recursive loop
// add update function parameter
function trail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let velocity = subtract(cursor, particles[0]);

  velocity.x = velocity.x * 0.1;
  velocity.y = velocity.y * 0.1;

  particles[0].x = particles[0].x + velocity.x;
  particles[0].y = particles[0].y + velocity.y;

  ctx.drawImage(particles[0].image, particles[0].x, particles[0].y);
  requestAnimationFrame(trail);
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

// factory functino for particles
function particle(src) {
  return {
    image: preRender(src),
    opacity: 1,
    velocity: pair(0, 0),
    ...pair(0, 0),
  };
}

// utility functions
// prerenders the image. improves performance
function preRender(src) {
  let canvasOS = document.createElement("canvas");
  let ctxOS = canvasOS.getContext("2d");
  const image = new Image();
  image.src = src;
  image.onload = () => ctxOS.drawImage(image, 0, 0);
  return canvasOS;
}
