import {getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean} from '../src/util.js';
import {TASK_COUNT, DESCRIPTIONS, COLORS} from '../src/constants.js';

const getTask = () => ({
  description: getRandomArrayElement(DESCRIPTIONS),
  dueDate: getRandomDate(),
  repeatingDays: {
    'mo': getRandomBoolean(),
    'tu': false,
    'we': false,
    'th': getRandomBoolean(),
    'fr': false,
    'sa': false,
    'su': getRandomBoolean(),
  },
  tags: new Set([
    `homework`,
    `practice`,
    `intensive`,
  ]),
  color: getRandomArrayElement(COLORS),
  isFavorite: getRandomBoolean(),
  isArchive: getRandomBoolean(),
});

const taskMocks = Array.from(Array(getRandomInt(TASK_COUNT))).map(getTask);
const getFilterCount = (callback) => taskMocks.filter((it) => callback(it)).length;

const filtersList = [
  {
    title: `all`,
    count: getFilterCount((it) => !it.isArchive),
  },
  {
    title: `overdue`,
    count: getFilterCount((it) => it.dueDate > Date.now() + 399999999), // Временное решение
  },
  {
    title: `today`,
    count: getFilterCount((it) => new Date(it.dueDate).toDateString() === new Date().toDateString()),
  },
  {
    title: `favorites`,
    count: getFilterCount((it) => it.isFavorite),
  },
  {
    title: `repeating`,
    count: getFilterCount((it) => Object.keys(it.repeatingDays).some((day) => it.repeatingDays[day])),
  },
  {
    title: `tags`,
    count: getFilterCount((it) => it.tags),
  },
  {
    title: `archive`,
    count: getFilterCount((it) => it.isArchive),
  }
];

export {taskMocks, filtersList};
