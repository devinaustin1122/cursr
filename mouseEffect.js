function mouse(wrapper, options) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let satellites = [];
  let cursor = { x: 0, y: 0 };
  let configs = {
    cursor: "./images/cursor.svg",
    bg: null,
    ...options,
  };

  // initialization function
  function init() {
    document.body.style.cursor = `url('${configs.cursor}'), pointer`;
    canvas.style.pointerEvents = "none";
    // canvas.style.cursor = "progress";

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

    if (configs.bg) {
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      satellites.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      copy();
    }
  }

  // recursive function for following
  function follow() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < satellites.length; i++) {
      let satellite = satellites[i];
      satellite.dx = (cursor.x - satellite.x) * satellite.delay;
      satellite.x += satellite.dx;
      satellite.dy = (cursor.y - satellite.y) * satellite.delay;
      satellite.y += satellite.dy;
      satellite.draw();
    }
    requestAnimationFrame(follow);
  }

  // recursive function for copying
  function copy() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let tmp = satellites.pop();
    tmp.x = cursor.x;
    tmp.y = cursor.y;
    satellites.unshift(tmp);
    for (let i = 0; i < satellites.length; i++) {
      satellites[i].draw();
    }
    requestAnimationFrame(copy);
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
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;
    this.delay = delay;

    this.draw = () => {
      context.drawImage(this.image, this.x, this.y);
    };
  }

  init();
}
