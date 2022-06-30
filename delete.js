function mouse(wrapper, options) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let elements = [];
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

    let coordinates = { x: 0, y: 0 };
    let dimensions = { width: 10, height: 10 };

    // elements.push(factory(configs.bg, coordinates, dimensions, follow));
    // loop();

    elements.push(factory(configs.bg, coordinates, dimensions, null));
    elements.push(factory(configs.bg, coordinates, dimensions, null));
    elements.push(factory(configs.bg, coordinates, dimensions, null));
    elements.push(factory(configs.bg, coordinates, dimensions, null));
    elements.push(factory(configs.bg, coordinates, dimensions, null));
    elements.push(factory(configs.bg, coordinates, dimensions, null));
    copy();
  }

  // recursive function for following
  function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < elements.length; i++) {
      elements[i].update();
      elements[i].draw();
    }
    requestAnimationFrame(loop);
  }

  // recursive function for copying
  function copy() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let element = elements.pop();
    element.coordinates = cursor;
    elements.unshift(element);
    console.log(elements);
    for (let i = 0; i < elements.length; i++) {
      elements[i].draw();
    }
    // requestAnimationFrame(copy);
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

  // element factory
  function factory(src, coordinates, dimensions, update) {
    return {
      image: preRender(src),
      coordinates,
      dimensions,
      dx: 0,
      dy: 0,
      update,
      draw() {
        context.drawImage(this.image, this.coordinates.x, this.coordinates.y);
      },
    };
  }

  // update functions
  function follow() {
    this.dx = (cursor.x - this.coordinates.x) * 0.04;
    this.coordinates.x += this.dx;
    this.dy = (cursor.y - this.coordinates.y) * 0.04;
    this.coordinates.y += this.dy;
  }

  init();
}
