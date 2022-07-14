let tree = {};

// Loops

function initElements(configs, elements) {
  let i = 0;
  for (let config in configs) {
    elements = { ...elements, config: element("test.svg", pair(0, 0)) };
  }
  console.log(elements.config);
}

// Effects

function follow(element, following, configs) {
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

function element(src, coordinates) {
  return {
    img: src, // prerender here
    velocity: pair(0, 0),
    coordinates: { ...coordinates },
    children: [],
  };
}

// Main

function effect() {}

export { initElements, follow, pair, element };
export default effect;
