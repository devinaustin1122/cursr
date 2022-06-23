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

  //*************************************************************
  // Need to start thinking about handling errors.
  // I wonder if there are any functional design patterns
  //*************************************************************

  // update cursor if configuration exists
  html.style.cursor = configs.svg ? `url(${configs.svg}), auto` : "auto";

  // update cursor background img if configuration exists
  background.setAttribute("id", "mouse-background");
  background.style.backgroundImage = configs.bg
    ? `url("${configs.bg}")`
    : "unset";
  document.body.appendChild(background);

  //position cursor background
  setPosition(divX, divY);

  function effect(options) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;
      // start animation if started is false.
      if (!started) {
        follow({ delay: 1, ...options });
      }
    });
  }

  function follow(options) {
    started = true;
    updatePosition(options.delay);

    // if mouse and background position are close, end animation.
    // this might be able to be turned into it's own function.
    if (Math.abs(dX + dY) > 0.1) {
      requestAnimationFrame(() => follow(options));
    } else {
      started = false;
    }
  }

  // might want to use canvas here. might be difficult with event object.
  // trying to keep everything clean.
  //
  // https://www.kirupa.com/canvas/creating_motion_trails.htm
  function trail() {
    clone = background.cloneNode();
    html.appendChild(clone);
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

  function fade(element) {}

  let self = {
    effect,
  };

  return self;
}
