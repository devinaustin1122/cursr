function mouse(configs) {
  let mouseX = 0;
  let mouseY = 0;
  let divX = 0;
  let divY = 0;
  let dX = 0;
  let dY = 0;
  let started = false;
  let background = document.createElement("div");

  // update cursor
  let html = document.getElementsByTagName("html");
  html[0].style.cursor = `url("${configs.svg}"), pointer`;

  // update cursor background
  background.setAttribute("id", "mouse-background");
  background.style.backgroundImage = `url("${configs.bg}")`;
  document.body.appendChild(background);

  function animate(options) {
    let defaults = {
      delay: 1,
      ...options,
    };

    started = true;
    updatePosition(defaults.delay);
    background.style.top = `${divY}px`;
    background.style.left = `${divX}px`;

    // if mouse and background are close, end animation.
    if (Math.abs(dX + dY) > 0.1) {
      requestAnimationFrame(() => animate(defaults));
    } else {
      started = false;
    }
  }

  function updatePosition(delay) {
    dX = mouseX - divX + 5 - background.offsetWidth / 2;
    dY = mouseY - divY + 5 - background.offsetWidth / 2;
    divX += dX * delay;
    divY += dY * delay;
  }

  function effect(options) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;
      // start animation if started is false.
      if (!started) {
        animate(options);
      }
    });
  }

  let self = {
    effect,
  };

  return self;
}
