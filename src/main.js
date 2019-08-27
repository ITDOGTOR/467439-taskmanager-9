import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import FiltersContainer from '../src/components/filters-container.js';
import Filter from '../src/components/filter.js';
import Board from '../src/components/board.js';
import Task from '../src/components/task.js';
import TaskEdit from '../src/components/task-edit.js';
import LoadMoreButton from '../src/components/load-more-button.js';

import {taskMocks, filtersList} from '../src/data.js';
import {renderElement} from './util.js';
import {TASK_COUNT} from '../src/constants.js';

const {render} = TASK_COUNT;

const copyTasks = taskMocks.slice();

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEdit.getElement().querySelector(`textarea`).addEventListener(`focus`, () => {
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  taskEdit.getElement().querySelector(`textarea`).addEventListener(`blur`, () => {
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEdit.getElement().querySelector(`.card__save`).addEventListener(`click`, () => {
    tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderElement(tasksContainer, task.getElement());
};

const renderTasks = (tasks) => tasks.splice(0, render).forEach((taskMock) => renderTask(taskMock));

const renderFilters = (filters) => {
  filters.forEach((filter) => {
    const filterElement = new Filter(filter);
    renderElement(filtersContainer, filterElement.getElement());
  });
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
renderElement(menuContainer, new Menu().getElement());
renderElement(mainContainer, new Search().getElement());
renderElement(mainContainer, new FiltersContainer().getElement());

const filtersContainer = mainContainer.querySelector(`.main__filter`);
renderFilters(filtersList);
renderElement(mainContainer, new Board().getElement());

const boardContainer = mainContainer.querySelector(`.board`);
const tasksContainer = boardContainer.querySelector(`.board__tasks`);
renderElement(boardContainer, new LoadMoreButton().getElement());
renderTasks(copyTasks);

const onRenderMoreTask = () => {
  if (copyTasks.length) {
    renderTasks(copyTasks);

    if (!copyTasks.length) {
      loadMoreElement.style.display = `none`;
      loadMoreElement.removeEventListener(`click`, onRenderMoreTask);
    }
  }
};

const loadMoreElement = boardContainer.querySelector(`.load-more`);
loadMoreElement.addEventListener(`click`, onRenderMoreTask);
