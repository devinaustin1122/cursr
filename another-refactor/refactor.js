
/*
* On mouse move, duplicate all spawn children.
*/

// Loops

function initElements(configs) {
  let arr = [];
  let el = element("test.svg", pair);
  for (let config of configs) {
    if (config.children) {
      el.children = initElements(config.children);
    }
    arr.push(el);
  }
  return arr;
}

// Effects

function follow(element, following) {
  let difference = subtract(following.coordinates, element.coordinates);

  let spring = false;

  if (spring) {
    element.velocity.x = element.velocity.x * 0.9 + (difference.x / 2) * 0.1;
    element.velocity.y = element.velocity.y * 0.9 + (difference.y / 2) * 0.1;
  } else {
    element.velocity.x = difference.x * 0.5;
    element.velocity.y = difference.y * 0.5;
  }

  element.coordinates.x += element.velocity.x;
  element.coordinates.y += element.velocity.y;
  return element;
}

// Utility

function subtract(minuend, subtrahend) {
  return pair(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
}

// Factories

function pair(x, y) {
  return {
    x,
    y,
  };
}

function element(src, coordinates, update) {
  return {
    img: src, // prerender here
    velocity: pair(0, 0),
    coordinates: { ...coordinates },
    update,
    draw: () => {
      console.log("draw");
    },
    children: [],';'
  };
}

// Main

function effect() {}

export { initElements, follow, pair, element };
export default effect;
