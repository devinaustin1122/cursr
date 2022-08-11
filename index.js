let cursr = (function () {
  // Utility functions

  function cursorSet(src) {
    document.body.style.cursor = `url(${src}), pointer`;
  }

  function canvasCreate() {
    let canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas;
  }

  function preRender(src) {
    // let canvas = document.createElement("canvas");
    // canvas.width = 100;
    // canvas.height = 100;
    // let context = canvas.getContext("2d");
    const image = new Image();
    image.src = src;
    return image;
  }

  function vecSubtract(vector, minus) {
    return {
      x: vector.x - minus.x,
      y: vector.y - minus.y,
    };
  }

  // Display factory

  function createDisplay() {
    let cursor = { x: 0, y: 0 };
    let canvas = canvasCreate();
    let context = canvas.getContext("2d");
    let elements = [];

    document.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    });
    document.body.appendChild(canvas);

    return {
      canvas,
      elements,
      cursor,

      addElement: function addElement(element) {
        elements.push(element);
      },

      updateElements: function updateElements() {
        elements = elements.filter((element) => {
          return element.valid();
        });
        elements.forEach((element) => {
          element.update();
        });
      },

      drawElements: function drawElements() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach((element) => {
          element.draw(context);
        });
      },
    };
  }

  // Element factory

  function createElement(src, x, y, update) {
    return {
      image: preRender(src),
      x,
      y,
      scale: 1,
      scaleMax: 100,
      count: 100,
      countMin: 1,
      velocity: { x: 0, y: 0 },
      update,
      draw: function draw(context) {
        context.drawImage(
          this.image,
          this.x,
          this.y,
          this.image.width * this.scale,
          this.image.height * this.scale
        );
      },
      valid: function valid() {
        return this.scale < this.scaleMax && this.count > this.countMin;
      },
    };
  }

  // Effect functions

  function trail(element, cursor) {
    let difference = vecSubtract(cursor, element);
    element.velocity.x += difference.x * 0.1;
    element.velocity.y += difference.y * 0.1;
    element.velocity.x *= 0.9;
    element.velocity.y *= 0.9;

    element.x += element.velocity.x;
    element.y += element.velocity.y;
  }

  function float(element) {
    element.y--;
  }

  function scale(element, percentage) {
    element.scale *= percentage;
  }

  // Main

  function cursr(conifgs) {
    let display = createDisplay();
    cursorSet(conifgs.img);

    function follow(configs, reference = display.cursor) {
      let element = createElement(configs.img, reference.x, reference.y, () => {
        trail(element, display.cursor);
      });
      display.addElement(element);
      return element;
    }

    function spring(configs, reference = display.cursor) {
      let element = createElement(configs.img, reference.x, reference.y, () => {
        trail(element, display.cursor);
      });
      display.addElement(element);
      return element;
    }

    function spawn(configs, reference = display.cursor) {
      document.addEventListener("mousemove", async (e) => {
        let element = createElement(
          configs.img,
          reference.x,
          reference.y,
          () => {
            float(element);
            scale(element, 1.1);
          }
        );
        display.addElement(element);
        return element;
      });
    }

    function start() {
      function loop() {
        display.updateElements();
        display.drawElements();
        requestAnimationFrame(loop);
      }
      loop();
    }

    return { follow, spring, spawn, start };
  }

  return cursr;
})();
