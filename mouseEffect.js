function mouse() {
  function effect() {
    let background = document.createElement("div");
    background.setAttribute("id", "mouse-background");
    document.body.appendChild(background);

    let prevTop = document.pageY - background.offsetHeight / 2;
    let prevLeft = document.pageX - background.offsetWidth / 2;

    document.addEventListener("mousemove", (e) => {
      let top = e.pageY - background.offsetHeight / 2;
      let left = e.pageX - background.offsetWidth / 2;
      background.style.top = `${top}px`;
      background.style.left = `${left}px`;
      console.log("prevTop: " + prevTop);
      console.log("prevLeft: " + prevTop);
      console.log("top: " + top);
      console.log("left: " + left);

      prevTop = top;
      prevLeft = left;
    });
  }

  let self = {
    effect,
  };

  return self;
}
