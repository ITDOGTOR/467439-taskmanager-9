const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
};

const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const renderElement = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

const unrenderElement = (element) => {
  if (element) {
    element.remove();
  }
};

const getRandomInt = ({min, max}) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomArrayElement = (array) => array[Math.floor((Math.random() * array.length) + 0)];
const getRandomDate = () => Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000;
const getRandomBoolean = () => Boolean(Math.random() > 0.5);

export {createElement, renderElement, unrenderElement, getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean, Key, Position};
