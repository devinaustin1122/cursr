let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let particle = {
  image: preRender("./ellipse.svg"),
  x: 0,
  y: 0,
};
let cursor = {
  x: 0,
  y: 0,
};
let velocity = {
  x: 0,
  y: 0,
};

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener("mousemove", async (e) => {
    cursor = {
      x: e.clientX,
      y: e.clientY,
    };
  });
}

// it's working somewhat, but I don't want there to be any pulling when
// shape is close to cursor. Need to add free fall effect.
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  velocity = subtract(cursor, particle);
  console.log(velocity);
  particle.x = particle.x + velocity.x;
  particle.y = particle.y + velocity.y;
  ctx.drawImage(particle.image, particle.x, particle.y);
  requestAnimationFrame(loop);
}

function preRender(src) {
  let canvasOS = document.createElement("canvas");
  let ctxOS = canvasOS.getContext("2d");
  const image = new Image();
  image.src = src;
  image.onload = () => ctxOS.drawImage(image, 0, 0);
  return canvasOS;
}

function subtract(first, second) {
  return {
    x: first.x - second.x,
    y: first.y - second.y,
  };
}

function add(first, second) {
  return {
    x: first.x + second.x,
    y: first.y + second.y,
  };
}

// function distance(first, second) {
//   // calculate the distance
// }

init();
loop();
