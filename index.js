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
    return new Promise((resolve) => {
      let canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      let context = canvas.getContext("2d");
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0);
        resolve(canvas);
      };
      image.src = src;
    });
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

  async function createElement(src, x, y, update) {
    return {
      image: await preRender(src),
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

    async function follow(configs, reference = display.cursor) {
      let element = await createElement(
        configs.img,
        reference.x,
        reference.y,
        () => {
          trail(element, display.cursor);
        }
      );
      display.addElement(element);
      return element;
    }

    async function spring(configs, reference = display.cursor) {
      let element = await createElement(
        configs.img,
        reference.x,
        reference.y,
        () => {
          trail(element, display.cursor);
        }
      );
      display.addElement(element);
      return element;
    }

    async function spawn(configs, reference = display.cursor) {
      document.addEventListener("mousemove", async (e) => {
        let element = await createElement(
          configs.img,
          reference.x,
          reference.y,
          () => {
            float(spawn);
          }
        );
        display.addElement(element);
        console.log(element);
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
