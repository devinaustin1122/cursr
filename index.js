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
    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    let context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      //   resolve(canvas);
    };
    image.src = src;
    // });
    return canvas;
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
      velocity: { x: 0, y: 0 },
      update,
      draw: function draw(context) {
        context.drawImage(this.image, this.x, this.y);
      },
    };
  }

  // Effect functions

  function trail(element, cursor) {
    let difference = vecSubtract(cursor, element);
    // element.x += difference.x * 0.1;
    // element.y += difference.y * 0.1;
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
            float(spawn);
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
