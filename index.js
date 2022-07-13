// wrap everything in a function that accepts configs?

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
let particles = [];
let cursor = {};

// initialize canvas
function effect(configs) {
  if (configs.wrapper) {
    let bounds = document
      .getElementById(configs.wrapper)
      .getBoundingClientRect();
    canvas.style.position = "absolute";
    canvas.style.top = `${bounds.top}px`;
    canvas.style.left = `${bounds.left}px`;
    canvas.width = bounds.width;
    canvas.height = bounds.height;
  } else {
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  document.body.appendChild(canvas);

  configureEvents(configs);
  animationLoop(configs);
}

// configure events
function configureEvents(configs) {
  document.body.addEventListener("mouseenter", (e) => {
    if (particles.length == 0) {
      particles.unshift(particle(configs.image, pair(e.clientX, e.clientY)));
    }
  });

  document.body.addEventListener("mousemove", (e) => {
    cursor = pair(e.clientX, e.clientY);
  });

  document.body.addEventListener("mousemove", (e) => {
    if (configs.spawn == true)
      particles.unshift(particle(configs.image, pair(e.clientX, e.clientY)));
  });
}

// animation loop
function animationLoop(configs) {
  follow(configs.follow);
  draw();
  requestAnimationFrame(() => animationLoop(configs));
}

// follow effect (WIP)
function follow(configs) {
  particles.forEach((particle) => {
    let velocity = subtract(cursor, particle);

    if (configs.spring) {
      console.log(configs.length);
      particle.velocity.x =
        particle.velocity.x * 0.9 + (velocity.x / configs.length) * 0.1;
      particle.velocity.y =
        particle.velocity.y * 0.9 + (velocity.y / configs.length) * 0.1;
      particle.x = particle.x + particle.velocity.x;
      particle.y = particle.y + particle.velocity.y;
    }
  });
}

// elastic effect
function elastic(configs) {
  return () => {
    particles.forEach((particle) => {
      let spring = subtract(cursor, particle);
      particle.velocity.x =
        particle.velocity.x * 0.9 + (spring.x / length) * 0.2;
      particle.velocity.y =
        particle.velocity.y * 0.9 + (spring.y / length) * 0.2;
      particle.x = particle.x + particle.velocity.x;
      particle.y = particle.y + particle.velocity.y;
    });
  };
}

// trail effect
function trail(configs) {
  return () => {
    particles.forEach((particle) => {
      let velocity = subtract(cursor, particle);
      velocity.x = velocity.x * 0.2;
      velocity.y = velocity.y * 0.2;
      particle.x = particle.x + velocity.x;
      particle.y = particle.y + velocity.y;
    });
  };
}

// float effect
function float(configs) {
  return () => {
    particles.forEach((particle) => {
      particle.y -= 1;
      particle.count++;
      if (particle.count > 100) {
        particles.splice(particles.indexOf(particle));
      }
    });
  };
}

// draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.drawImage(
      particle.image,
      particle.x - parseInt(canvas.style.left, 10),
      particle.y - parseInt(canvas.style.top, 10),
      particle.image.width * particle.scale,
      particle.image.height * particle.scale
    );
  });
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

// factory function for a pair
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
    count: 0,
    ...coordinates,
  };
}

// subtracts two pairs
function subtract(first, second) {
  return pair(first.x - second.x, first.y - second.y);
}

// returns the magnitude of a vector described by two points
function magnitude(start, end) {
  let diff = subtract(end, start);
  return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
}
