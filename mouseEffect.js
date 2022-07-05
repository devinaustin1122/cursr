function mouse(wrapper, options) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let elements = [];
  let cursor = { x: 0, y: 0 };
  let dimensions = { width: 10, height: 10 };

  let configs = {
    cursor: "./images/cursor.svg",
    bg: null,
    ...options,
  };

  // initialization function
  function init() {
    document.body.style.cursor = `url('${configs.cursor}'), pointer`;
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

    let tracking = true;

    if (tracking) {
      document.addEventListener("mousemove", (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      });
      elements.push(
        factory(configs.bg, { x: cursor.x, y: cursor.y }, dimensions, follow)
      );
    } else {
      document.addEventListener("mousemove", (e) => {
        elements.push(
          // factory(configs.bg, { x: e.clientX, y: e.clientY }, dimensions, countDown)
          // factory(configs.bg, { x: e.clientX, y: e.clientY }, dimensions, float)
          factory(configs.bg, { x: e.clientX, y: e.clientY }, dimensions, fall)
        );
      });
    }
    loop();
  }

  // recursive function for following
  function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < elements.length; i++) {
      elements[i].draw();
      elements[i].update();
    }
    requestAnimationFrame(loop);
  }

  // element factory
  function factory(src, coordinates, dimensions, update) {
    return {
      image: preRender(src),
      coordinates,
      dimensions,
      dx: 0,
      dy: 0,
      count: 0,
      opacity: 0.5,
      update,
      draw() {
        context.globalAlpha = this.opacity;
        context.drawImage(this.image, this.coordinates.x, this.coordinates.y);
      },
    };
  }

  // float
  function float() {
    this.coordinates.y -= 10;
    countDown.call(this);
  }

  // fall
  function fall() {
    this.coordinates.y += 10;
    countDown.call(this);
  }

  // https://www.youtube.com/watch?v=Zdicf60eNzA
  // good start

  // update functions
  function follow() {
    this.dx = (cursor.x - this.coordinates.x) * 0.1;
    this.coordinates.x += this.dx;
    this.dy = (cursor.y - this.coordinates.y) * 0.1;
    this.coordinates.y += this.dy;
  }

  function countDown() {
    if (this.count > 100 && elements.length) {
      elements.splice(elements.indexOf(this), 1);
    }
    this.opacity = 1 / this.count;
    this.count++;
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

  init();
}
