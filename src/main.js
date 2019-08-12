import {createSiteMenuTemplate} from '../src/components/site-menu.js';
import {createSearchTemplate} from '../src/components/search.js';
import {createFilterTemplate} from '../src/components/filter.js';
import {createBoardTemplate} from '../src/components/board.js';
import {createSortingTemplate} from '../src/components/sorting.js';
import {createTaskEditTemplate} from '../src/components/task-edit.js';
import {createTaskTemplate} from '../src/components/task.js';
import {createLoadMoreButtonTemplate} from '../src/components/load-more-button.js';

const renderTemplate = (container, template, place) => container.insertAdjacentHTML(place, template);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), `beforeEnd`);
renderTemplate(siteMainElement, createSearchTemplate(), `beforeEnd`);
renderTemplate(siteMainElement, createFilterTemplate(), `beforeEnd`);
renderTemplate(siteMainElement, createBoardTemplate(), `beforeEnd`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(boardElement, createSortingTemplate(), `afterBegin`);
renderTemplate(taskListElement, createTaskEditTemplate(), `beforeEnd`);

new Array(3).fill(``).forEach(() => renderTemplate(taskListElement, createTaskTemplate(), `beforeEnd`));

renderTemplate(boardElement, createLoadMoreButtonTemplate(), `beforeEnd`);
