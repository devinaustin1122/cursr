function mouse(configs, event) {
  let mouseX = 0;
  let mouseY = 0;
  let divX = event ? event.pageX : 0;
  let divY = event ? event.pageY : 0;
  let dX = 0;
  let dY = 0;
  let started = false;
  let background = (bg = document.getElementById("mouse-background"))
    ? bg
    : document.createElement("div");
  let html = document.getElementsByTagName("html")[0];

  clear();
  init();

  function init() {
    // update cursor
    html.style.cursor = `url(${configs.svg}), auto`;

    // update cursor background
    background.setAttribute("id", "mouse-background");
    background.style.backgroundImage = configs.bg
      ? `url("${configs.bg}")`
      : "unset";
    document.body.appendChild(background);
    setPosition(divX, divY);
  }

  function animate(options) {
    let defaults = {
      delay: 1,
      ...options,
    };

    started = true;
    updatePosition(defaults.delay);

    // if mouse and background position are close, end animation.
    if (Math.abs(dX + dY) > 0.1) {
      requestAnimationFrame(() => animate(defaults));
    } else {
      started = false;
    }
  }

  function setPosition(x, y) {
    background.style.left = `${x + 5 - background.offsetHeight / 2}px`;
    background.style.top = `${y + 5 - background.offsetHeight / 2}px`;
  }

  function updatePosition(delay) {
    dX = mouseX - divX;
    dY = mouseY - divY;
    divX += dX * delay;
    divY += dY * delay;
    setPosition(divX, divY);
  }

  // clear function
  function clear() {
    background.remove();
    html.style.cursor = "auto";
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
