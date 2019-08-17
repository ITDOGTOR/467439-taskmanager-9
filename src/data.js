import {getRandomInt} from '../src/util.js';

const getTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    'mo': Boolean(Math.round(Math.random())),
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
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

const tasks = Array.from(Array(getRandomInt())).map(getTask);

const filters = [
  {
    title: `all`,
    count: tasks.length,
  },
  {
    title: `overdue`,
    count: tasks.filter((it) => it.dueDate < Date.now()).length,
  },
  {
    title: `today`,
    count: tasks.filter((it) => it.dueDate === Date.now()).length,
  },
  {
    title: `favorites`,
    count: tasks.filter((it) => it.isFavorite).length,
  },
  {
    title: `repeating`,
    count: tasks.filter((it) => Object.keys(it.repeatingDays).some((day) => it.repeatingDays[day])).length,
  },
  {
    title: `tags`,
    count: tasks.filter((it) => it.tags).length,
  },
  {
    title: `archive`,
    count: tasks.filter((it) => it.isArchive).length,
  }
];

export {tasks, filters};
