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

    if (configs.bg) {
      elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 0.08));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      //   elements.push(new Satellite(configs.bg, 0, 0, 10, 10, 100));
      follow();
    }
  }

  // recursive function for following
  function follow() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      element.dx = (cursor.x - element.x) * element.delay;
      element.x += element.dx;
      element.dy = (cursor.y - element.y) * element.delay;
      element.y += element.dy;
      element.draw();
    }
    requestAnimationFrame(follow);
  }

  // recursive function for copying
  function copy() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let tmp = elements.pop();
    tmp.x = cursor.x;
    tmp.y = cursor.y;
    elements.unshift(tmp);
    for (let i = 0; i < elements.length; i++) {
      elements[i].draw();
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

  // background element that follows the cursor
  function Satellite(src, x, y, width, height, delay) {
    this.image = preRender(src);
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;
    this.delay = delay;

    this.update = () => {
      console.log("you must set a strategy");
    };

    this.draw = () => {
      context.drawImage(this.image, this.x, this.y);
    };
  }

  init();
}
