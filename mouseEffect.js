function mouse() {
  let mouseX = 0;
  let mouseY = 0;
  let divX = 0;
  let divY = 0;
  let dX = 0;
  let dY = 0;
  let started = false;
  let background = document.createElement("div");

  let defaults = {
    delay: 0.5,
  };

  function animate(options) {
    started = true;
    updatePosition(0.5);
    background.style.top = `${divY}px`;
    background.style.left = `${divX}px`;

    // if mouse and background are close, end animation.
    if (Math.abs(dX + dY) > 0.1) {
      requestAnimationFrame(() => animate(options));
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
    options = { ...defaults, ...options };

    background.setAttribute("id", "mouse-background");
    document.body.appendChild(background);

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
