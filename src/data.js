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

const filters = [
  {
    title: `all`,
    count: taskMocks.length,
  },
  {
    title: `overdue`,
    count: taskMocks.filter((it) => it.dueDate < Date.now()).length,
  },
  {
    title: `today`,
    count: taskMocks.filter((it) => new Date(it.dueDate).toDateString() === new Date().toDateString()).length,
  },
  {
    title: `favorites`,
    count: taskMocks.filter((it) => it.isFavorite).length,
  },
  {
    title: `repeating`,
    count: taskMocks.filter((it) => Object.keys(it.repeatingDays).some((day) => it.repeatingDays[day])).length,
  },
  {
    title: `tags`,
    count: taskMocks.filter((it) => it.tags).length,
  },
  {
    title: `archive`,
    count: taskMocks.filter((it) => it.isArchive).length,
  }
];

export {taskMocks, filters};
