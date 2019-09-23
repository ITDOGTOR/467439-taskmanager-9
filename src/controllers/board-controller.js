import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TaskController from '../controllers/task-controller.js';
import TaskContainer from '../components/tasks-container.js';
import LoadMoreButton from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';

import {renderElement, unrenderElement, Position} from '../util.js';
import {TASK_COUNT} from '../constants.js';

const {render} = TASK_COUNT;
const {AFTERBEGIN, AFTEREND} = Position;

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
    this._visibleTasks = render;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  _renderBoard(tasks) {
    this._taskContainer.removeElement();
    renderElement(this._sort.getElement(), this._taskContainer.getElement(), AFTEREND);
    this._renderTasks(tasks.slice(), this._visibleTasks);
  }

  _renderTasks(taskList, count = render) {
    taskList.splice(0, count).forEach((task) => {
      const taskController = new TaskController(this._taskContainer, task, this._onDataChange, this._onChangeView);
      this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    });
  }

  _renderLoadMoreButton(taskList) {
    if (taskList.length > render) {
      renderElement(this._board.getElement(), this._loadMoreButton.getElement());
    }
  }

  _onDataChange(newData, oldData) {
    this._tasks[this._tasks.findIndex((it) => it === oldData)] = newData;
    this._renderBoard(this._tasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const getSortedTasks = (callback) => {
      const sortedTasks = this._tasks.slice().sort((a, b) => callback(a, b));
      this._renderTasks(sortedTasks, this._visibleTasks);
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
        this._visibleTasks = this._tasks.length - this._unrenderedTasks.length;

        if (!this._unrenderedTasks.length) {
          unrenderElement(this._loadMoreButton.getElement());
        }
      }
    });
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }
}
