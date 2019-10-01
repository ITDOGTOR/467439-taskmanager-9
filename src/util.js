const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
  ENTER: `Enter`,
};

const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
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
    case Position.AFTEREND:
      container.after(element);
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

const getRandomColor = () => {
  const r = Math.floor(Math.random() * (256));
  const g = Math.floor(Math.random() * (256));
  const b = Math.floor(Math.random() * (256));

  return `#` + r.toString(16) + g.toString(16) + b.toString(16);
};

export {createElement, renderElement, unrenderElement, getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean, getRandomColor, Key, Position};
