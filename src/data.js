import {getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean} from '../src/util.js';
import {TASK_COUNT, TASK_DESCRIPTIONS, TASK_COLORS} from '../src/constants.js';

const getTask = () => ({
  description: getRandomArrayElement(TASK_DESCRIPTIONS),
  dueDate: getRandomDate(),
  repeatingDays: {
    'mo': getRandomBoolean(),
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: new Set([
    `homework`,
    `practice`,
    `intensive`,
  ]),
  color: getRandomArrayElement(TASK_COLORS),
  isFavorite: getRandomBoolean(),
  isArchive: getRandomBoolean(),
});

const taskMocks = Array.from(Array(getRandomInt(TASK_COUNT))).map(getTask);
const filterCount = (callback = true) => taskMocks.filter(() => callback).length;

const filtersList = [
  {
    title: `all`,
    count: filterCount(),
  },
  {
    title: `overdue`,
    count: filterCount(taskMocks.dueDate < Date.now()),
  },
  {
    title: `today`,
    count: filterCount(new Date(taskMocks.dueDate).toDateString() === new Date().toDateString()),
  },
  {
    title: `favorites`,
    count: filterCount(taskMocks.isFavorite),
  },
  {
    title: `repeating`,
    count: taskMocks.filter((it) => Object.keys(it.repeatingDays).some((day) => it.repeatingDays[day])).length,
  },
  {
    title: `tags`,
    count: filterCount(taskMocks.tags),
  },
  {
    title: `archive`,
    count: filterCount(taskMocks.isArchive),
  }
];

export {taskMocks, filtersList};
