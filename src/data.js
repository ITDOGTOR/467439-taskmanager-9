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
const getFilterCount = (callback) => taskMocks.filter((it) => callback(it)).length;

const filtersList = [
  {
    title: `all`,
    count: getFilterCount(() => true),
  },
  {
    title: `overdue`,
    count: getFilterCount((it) => it.dueDate < Date.now()),
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
