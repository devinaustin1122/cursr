let cursr = (function () {
  // Display factory

  function createDisplay() {
    let cursor = { x: 0, y: 0 };
    let canvas = createCanvas();
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
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach((element) => {
          context.drawImage(
            element.image,
            element.position.x,
            element.position.y
          );
        });
      },
    };
  }

  // Element factory

  async function createElement(src, position, update) {
    return {
      velocity: { x: 0, y: 0 },
      position: { ...position },
      image: await preRender(src),
      update,
    };
  }

  // Utility functions

  function createCanvas() {
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

  // Main

  function cursr(conifgs) {
    let display = createDisplay();

    async function follow(reference, configs) {
      let element = await createElement(
        "mouse.svg",
        display.cursor,
        function update() {
          element.position.x = display.cursor.x;
          element.position.y = display.cursor.y;
        }
      );
      display.addElement(element);
    }

    async function spawn(reference, configs) {
      document.addEventListener("mousemove", async (e) => {
        let spawn = await createElement(
          "mouse.svg",
          { x: e.clientX, y: e.clientY },
          function update() {
            spawn.position.y--;
          }
        );
        display.addElement(spawn);
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

    return { follow, spawn, start };
  }

  return cursr;
})();
