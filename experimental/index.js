let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
let particles = [];
let cursor = pair(0, 0);
let length = 10;

// initialize document and canvas
function init() {
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener("mousemove", (e) => {
    cursor = pair(e.clientX, e.clientY);
  });

  document.body.appendChild(canvas);
}

// initalize the effect
function effect(configs) {
  init();
  particles.push(particle("./ellipse.svg", cursor));
  // loop(elastic);
  // loop(trail);
  let spawn = true;
  if (spawn) {
    document.addEventListener("mousemove", (e) => {
      add(particle("./ellipse.svg", cursor));
    });
  }
  loop(float, shrink);
}

// animation loop function
function loop(...updates) {
  updates.forEach((update) => {
    update(particles);
  });
  draw(particles);
  requestAnimationFrame(() => loop(...updates));
}

// draw function
function draw(particles) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.globalAlpha = particle.opacity;
    ctx.drawImage(
      particle.image,
      particle.x,
      particle.y,
      particle.image.width * particle.scale,
      particle.image.height * particle.scale
    );
  });
}

// add particle
function add(particle, limit) {
  particles.unshift(particle);
  console.log(particles);
}

// elastic update function
function elastic(particles) {
  particles.forEach((particle) => {
    let spring = subtract(cursor, particle);

    particle.velocity.x = particle.velocity.x * 0.9 + (spring.x / length) * 0.2;
    particle.velocity.y = particle.velocity.y * 0.9 + (spring.y / length) * 0.2;

    particle.x = particle.x + particle.velocity.x;
    particle.y = particle.y + particle.velocity.y;
  });
}

// trail update function
function trail(particles) {
  particles.forEach((particle) => {
    let velocity = subtract(cursor, particle);

    velocity.x = velocity.x * 0.1;
    velocity.y = velocity.y * 0.1;

    particle.x = particle.x + velocity.x;
    particle.y = particle.y + velocity.y;
  });
}

// float update function
function float(particles) {
  particles.forEach((particle) => {
    particle.y -= 1;
  });
}

// function fade
function fade(particles) {
  particles.forEach((particle) => {
    particle.opacity *= 0.9;
  });
}

// function shrink
function shrink(particles) {
  particles.forEach((particle) => {
    particle.scale *= 0.99;
  });
}

// subtracts two pairs
function subtract(first, second) {
  return pair(first.x - second.x, first.y - second.y);
}

// prerenders the image. improves performance.
function render(src) {
  let canvasOS = document.createElement("canvas");
  canvasOS.width = 100;
  canvasOS.height = 100;
  let ctxOS = canvasOS.getContext("2d");
  const image = new Image();
  image.src = src;
  image.onload = () => ctxOS.drawImage(image, 0, 0);
  return canvasOS;
}

// factory function for a pair object
function pair(x, y) {
  return {
    x,
    y,
  };
}

// factory function for particles
function particle(src, coordinates) {
  return {
    image: render(src),
    opacity: 1,
    velocity: pair(0, 0),
    scale: 1,
    ...coordinates,
  };
}
