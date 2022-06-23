function mouse(wrapper, options) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let satellites = [];
  let cursor = { x: 0, y: 0 };

  // initialization function
  function init() {
    canvas.style.pointerEvents = "none";

    if (wrapper) {
      let wrapperElement = document.getElementById("wrapper");
      canvas.style.position = "absolute";
      canvas.style.top = `${wrapperElement.offsetTop}px`;
      canvas.style.left = `${wrapperElement.offsetLeft}px`;
      canvas.width = wrapperElement.offsetWidth;
      canvas.height = wrapperElement.offsetHeight;
      wrapperElement.appendChild(canvas);
    } else {
      canvas.style.position = "fixed";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    }

    document.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    });

    satellites.push(new Satellite("./images/circle.svg", 0, 0, 10, 10, 0.2));
    satellites.push(new Satellite("./images/circle.svg", 0, 0, 10, 10, 0.4));
    satellites.push(new Satellite("./images/circle.svg", 0, 0, 10, 10, 0.6));
    satellites.push(new Satellite("./images/circle.svg", 0, 0, 10, 10, 0.8));
    recurse();
  }

  // recursive function for animations
  function recurse() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < satellites.length; i++) {
      satellites[i].update(cursor.x, cursor.y);
      satellites[i].draw();
    }
    requestAnimationFrame(recurse);
  }

  // function used to prerender images
  function preRender(src) {
    let canvasOS = document.createElement("canvas");
    let contextOS = canvasOS.getContext("2d");
    const image = new Image();
    image.src = src;
    image.onload = () => contextOS.drawImage(image, 0, 0);
    return canvasOS;
  }

  // satellite images used to create effects
  function Satellite(src, x, y, width, height, delay) {
    this.image = preRender(src);
    this.x = cursor.x;
    this.y = cursor.y;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;

    this.update = (x, y) => {
      this.dx = (x - this.x) * delay;
      this.x += this.dx;
      this.dy = (y - this.y) * delay;
      this.y += this.dy;
    };

    this.draw = () => {
      context.drawImage(this.image, this.x, this.y);
    };
  }

  init();
}
