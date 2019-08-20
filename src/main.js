import {createSiteMenuTemplate} from '../src/components/site-menu.js';
import {createSearchTemplate} from '../src/components/search.js';
import {createFilterContainerTemplate} from '../src/components/filter-container.js';
import {createFilterTemplate} from '../src/components/filter.js';
import {createBoardTemplate} from '../src/components/board.js';
import {createSortingTemplate} from '../src/components/sorting.js';
import {createTaskEditTemplate} from '../src/components/task-edit.js';
import {createTaskTemplate} from '../src/components/task.js';
import {createLoadMoreButtonTemplate} from '../src/components/load-more-button.js';
import {tasks, filters} from '../src/data.js';
import {TASK_COUNT} from '../src/constants.js';

const taskArray = tasks.slice();
const {firstRender, moreRender} = TASK_COUNT;

const renderTemplate = (container, template, place = `beforeEnd`) => container.insertAdjacentHTML(place, template);
const renderListTemplate = (container, list, template, place = `beforeEnd`) => container.insertAdjacentHTML(place, list.map(template).join(``));

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(siteHeaderElement, createSiteMenuTemplate());
renderTemplate(siteMainElement, createSearchTemplate());
renderTemplate(siteMainElement, createFilterContainerTemplate());

const siteFilterElement = siteMainElement.querySelector(`.main__filter`);

renderListTemplate(siteFilterElement, filters, createFilterTemplate);
renderTemplate(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(boardElement, createSortingTemplate(), `afterBegin`);
renderTemplate(taskListElement, createTaskEditTemplate(taskArray.shift()), `afterBegin`);
renderListTemplate(taskListElement, taskArray.splice(0, firstRender), createTaskTemplate);
renderTemplate(boardElement, createLoadMoreButtonTemplate());

const renderMoreTaskHandler = () => {
  if (taskArray.length) {
    renderListTemplate(taskListElement, taskArray.splice(0, moreRender), createTaskTemplate);

    if (!taskArray.length) {
      loadMoreElement.style.display = `none`;
      loadMoreElement.removeEventListener(`click`, renderMoreTaskHandler);
    }
  }
};

const loadMoreElement = boardElement.querySelector(`.load-more`);

loadMoreElement.addEventListener(`click`, renderMoreTaskHandler);
