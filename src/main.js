import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import FiltersContainer from '../src/components/filters-container.js';
import Filter from '../src/components/filter.js';
import Board from '../src/components/board.js';
import BoardFilters from '../src/components/board-filters.js';
import TasksContainer from '../src/components/tasks-container.js';
import Task from '../src/components/task.js';
import TaskEdit from '../src/components/task-edit.js';
import LoadMoreButton from '../src/components/load-more-button.js';
import NoTasks from '../src/components/no-tasks.js';

import {taskMocks, filtersList} from '../src/data.js';
import {renderElement, Position} from '../src/util.js';
import {TASK_COUNT} from '../src/constants.js';

const {render} = TASK_COUNT;
const {AFTERBEGIN} = Position;

const copyTasks = taskMocks.slice();

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);
  const tasksContainer = document.querySelector(`.board__tasks`);

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

const renderFilter = (filter) => {
  const filterElement = new Filter(filter);
  const filtersContainer = document.querySelector(`.main__filter`);

  renderElement(filtersContainer, filterElement.getElement());
};

const renderTasks = (tasks) => tasks.splice(0, render).forEach((taskMock) => renderTask(taskMock));
const renderFilters = (filters) => filters.forEach((filter) => renderFilter(filter));

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const renderMainComponents = () => {
  renderElement(menuContainer, new Menu().getElement());
  renderElement(mainContainer, new Search().getElement());
  renderElement(mainContainer, new FiltersContainer().getElement());
  renderFilters(filtersList);
  renderElement(mainContainer, new Board().getElement());

  const boardContainer = mainContainer.querySelector(`.board`);

  if (!copyTasks.length) {
    renderElement(boardContainer, new NoTasks().getElement());
    return;
  }

  renderElement(boardContainer, new TasksContainer().getElement());
  renderElement(boardContainer, new BoardFilters().getElement(), AFTERBEGIN);

  if (copyTasks.length > render) {
    renderElement(boardContainer, new LoadMoreButton().getElement());
  }

  renderTasks(copyTasks);
};

renderMainComponents();

const onRenderMoreTask = () => {
  if (copyTasks.length) {
    renderTasks(copyTasks);

    if (!copyTasks.length) {
      loadMoreTasks.style.display = `none`;
      loadMoreTasks.removeEventListener(`click`, onRenderMoreTask);
    }
  }
};

const loadMoreTasks = document.querySelector(`.load-more`);

if (loadMoreTasks) {
  loadMoreTasks.addEventListener(`click`, onRenderMoreTask);
}
