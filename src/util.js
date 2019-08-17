const TASK_COUNT = {
  min: 16,
  max: 50,
};

const {min, max} = TASK_COUNT;

export const getRandomInt = () => Math.floor(Math.floor(Math.random() * (max - min + 1) + min) / min) * min;
