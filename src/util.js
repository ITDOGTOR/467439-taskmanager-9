const getRandomInt = ({min, max}) => Math.floor(Math.floor(Math.random() * (max - min + 1) + min) / min) * min;
const getRandomArrayElement = (array) => array[Math.floor((Math.random() * array.length) + 0)];
const getRandomDate = () => Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000;
const getRandomBoolean = () => Boolean(Math.random() > 0.5);

export {getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean};
