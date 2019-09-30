import moment from 'moment';

import {getRandomInt, getRandomArrayElement, getRandomDate, getRandomBoolean} from '../src/util.js';
import {TASK_COUNT, DESCRIPTIONS, COLORS} from '../src/constants.js';

const getFilterCount = (tasks, callback) => tasks.filter((it) => callback(it)).length;

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

const getFilters = (tasks) => (
  [
    {
      title: `all`,
      count: getFilterCount(tasks, (task) => !task.isArchive),
    },
    {
      title: `overdue`,
      count: getFilterCount(tasks, (task) => moment(Date.now()).subtract(1, `days`).isAfter(task.dueDate)),
    },
    {
      title: `today`,
      count: getFilterCount(tasks, (task) => new Date(task.dueDate).toDateString() === new Date(Date.now()).toDateString()),
    },
    {
      title: `favorites`,
      count: getFilterCount(tasks, (task) => task.isFavorite),
    },
    {
      title: `repeating`,
      count: getFilterCount(tasks, (task) => Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day])),
    },
    {
      title: `tags`,
      count: getFilterCount(tasks, (task) => task.tags.size > 0),
    },
    {
      title: `archive`,
      count: getFilterCount(tasks, (task) => task.isArchive),
    }
  ]
);

const taskMocks = Array.from(Array(getRandomInt(TASK_COUNT))).map(getTask);
const filtersList = getFilters(taskMocks);

export {taskMocks, filtersList, getFilters};
