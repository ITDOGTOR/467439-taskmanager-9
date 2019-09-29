import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TaskList from '../components/tasks-list.js';
import LoadMoreButton from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';

import TaskListController from '../controllers/task-list-controller.js';

import {renderElement} from '../util.js';
import {TASK_COUNT} from '../constants.js';

export default class BoardController {
  constructor(container, onDataChange) {
    this._container = container;

    this._tasks = [];
    this._sortedTask = this._tasks;
    this._shownTasksCount = TASK_COUNT.render;

    this._onDataChangeMain = onDataChange;

    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._loadMoreButton = new LoadMoreButton();
    this._noTasks = new NoTasks();
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));

    this._bindOnLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this.init();
  }

  _show(tasks) {
    if (tasks !== this._tasks) {
      this._renderTasks(tasks);
    }

    this._board.getElement().classList.remove(`visually-hidden`);
  }

  _hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  _renderTasks(tasks) {
    this._tasks = tasks;
    this._sortedTask = this._tasks;
    this._shownTasksCount = TASK_COUNT.render;

    this._renderBoard();
  }

  _renderBoard() {
    this._taskList.getElement().innerHTML = ``;
    this._loadMoreButton.removeElement();

    if (!this._tasks.length) {
      this._board.getElement().innerHTML = ``;
      renderElement(this._board.getElement(), this._noTasks.getElement());
      return;
    }

    if (this._tasks.length > this._shownTasksCount) {
      renderElement(this._board.getElement(), this._loadMoreButton.getElement());
      this._loadMoreButton.getElement().addEventListener(`click`, this._bindOnLoadMoreButtonClick);
    }

    this._taskListController._renderTasks(this._tasks.slice(0, this._shownTasksCount), this._tasks.slice(this._shownTasksCount));
  }

  _renderNewTask() {
    if (!this._tasks.length) {
      this._board.getElement().innerHTML = ``;
      renderElement(this._board.getElement(), this._sort.getElement());
      renderElement(this._board.getElement(), this._taskList.getElement());
    }

    this._taskListController._renderNewTask();
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._sortedTask = this._tasks;

    this._onDataChangeMain(tasks);
    this._renderBoard();
  }

  _onLoadMoreButtonClick() {
    const nextRenderTasks = this._shownTasksCount + TASK_COUNT.render;

    this._taskListController._renderMoreTasks(this._tasks.slice(this._shownTasksCount, nextRenderTasks));

    this._shownTasksCount = nextRenderTasks;

    if (this._shownTasksCount >= this._tasks.length) {
      this._loadMoreButton.getElement().removeEventListener(`click`, this._bindOnLoadMoreButtonClick);
      this._loadMoreButton.removeElement();
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const getSortedTasks = (callback) => this._tasks.slice().sort((a, b) => callback(a, b));

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        this._sortedTask = getSortedTasks((a, b) => a.dueDate - b.dueDate);
        break;
      case `date-down`:
        this._sortedTask = getSortedTasks((a, b) => b.dueDate - a.dueDate);
        break;
      case `default`:
        this._sortedTask = getSortedTasks(() => true);
        break;
    }

    this._taskListController._renderTasks(this._sortedTask.slice(0, this._shownTasksCount), this._sortedTask.slice(this._shownTasksCount));
  }

  init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._sort.getElement());
    renderElement(this._board.getElement(), this._taskList.getElement());

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }
}
