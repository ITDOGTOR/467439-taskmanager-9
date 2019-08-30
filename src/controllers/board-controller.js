import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TaskContainer from '../components/tasks-container.js';
import Task from '../components/task.js';
import TaskEdit from '../components/task-edit.js';
import LoadMoreButton from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';
import {renderElement, unrenderElement, Key, Position} from '../util.js';
import {TASK_COUNT} from '../constants.js';

const {render} = TASK_COUNT;
const {AFTERBEGIN} = Position;

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._sort = new Sort();
    this._taskContainer = new TaskContainer();
    this._loadMoreButton = new LoadMoreButton();
    this._noTasks = new NoTasks();
    this._unrenderedTasks = null;
  }

  _renderTask(task) {
    const taskComponent = new Task(task);
    const taskEditComponent = new TaskEdit(task);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE_IE || evt.key === Key.ESCAPE) {
        this._taskContainer.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
      this._taskContainer.getElement().replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.getElement().querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.getElement().querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.getElement().querySelector(`.card__save`).addEventListener(`click`, () => {
      this._taskContainer.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    renderElement(this._taskContainer.getElement(), taskComponent.getElement());
  }

  _renderTasks(taskList) {
    taskList.splice(0, render).forEach((task) => this._renderTask(task));
  }

  _renderLoadMoreButton(taskList) {
    if (taskList.length > render) {
      renderElement(this._board.getElement(), this._loadMoreButton.getElement());
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const getSortedTasks = (callback) => {
      const sortedTasks = this._tasks.slice().sort((a, b) => callback(a, b));
      this._renderLoadMoreButton(sortedTasks);
      this._renderTasks(sortedTasks);
      this._unrenderedTasks = sortedTasks;
    };

    this._taskContainer.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        getSortedTasks((a, b) => a.dueDate - b.dueDate);
        break;
      case `date-down`:
        getSortedTasks((a, b) => b.dueDate - a.dueDate);
        break;
      case `default`:
        getSortedTasks(() => true);
        break;
    }
  }

  init() {
    const copyTasks = this._tasks.slice();

    renderElement(this._container, this._board.getElement());

    if (!this._tasks.length) {
      renderElement(this._board.getElement(), this._noTasks.getElement());
      return;
    }

    renderElement(this._board.getElement(), this._sort.getElement(), AFTERBEGIN);
    renderElement(this._board.getElement(), this._taskContainer.getElement());
    this._renderTasks(copyTasks);
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    this._renderLoadMoreButton(this._tasks);
    this._unrenderedTasks = copyTasks;

    this._loadMoreButton.getElement().addEventListener(`click`, () => {
      if (this._unrenderedTasks.length) {
        this._renderTasks(this._unrenderedTasks);

        if (!this._unrenderedTasks.length) {
          unrenderElement(this._loadMoreButton.getElement());
        }
      }
    });
  }
}
