import moment from 'moment';

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
    this._taskListController._onChangeView();
    this._board.getElement().classList.add(`visually-hidden`);
  }

  _renderTasks(tasks) {
    this._tasks = tasks;
    this._shownTasksCount = TASK_COUNT.render;

    this._renderBoard();
  }

  _renderBoard() {
    const sortedTasks = this._getSortTasks(this._tasks);

    this._taskList.getElement().innerHTML = ``;
    this._loadMoreButton.removeElement();

    if (!sortedTasks.length) {
      this._board.getElement().innerHTML = ``;
      renderElement(this._board.getElement(), this._noTasks.getElement());
      return;
    }

    if ([...this._board.getElement().children].includes(this._noTasks.getElement())) {
      this._noTasks.removeElement();
      renderElement(this._board.getElement(), this._sort.getElement());
      renderElement(this._board.getElement(), this._taskList.getElement());
    }

    if (this._shownTasksCount < sortedTasks.length) {
      renderElement(this._board.getElement(), this._loadMoreButton.getElement());
      this._loadMoreButton.getElement().addEventListener(`click`, this._bindOnLoadMoreButtonClick);
    }

    this._taskListController._renderTasks(sortedTasks.slice(0, this._shownTasksCount), this._tasks);
  }

  _renderNewTask() {
    if (this._shownTasksCount === TASK_COUNT.render) {
      this._noTasks.removeElement();
      renderElement(this._board.getElement(), this._sort.getElement());
      renderElement(this._board.getElement(), this._taskList.getElement());
      this._taskList.innerHTML = ``;
    }

    this._taskListController._renderNewTask();
  }

  _getSortTasks(tasks) {
    const getSortedTasks = (callback) => tasks.slice().sort((a, b) => callback(a, b));
    const getFilterTasks = (taskList, callback) => taskList.filter((it) => callback(it));

    const currentSort = [...this._sort.getElement().querySelectorAll(`.board__filter`)].find((sortItem) => sortItem.classList.contains(`board__filter--active`)).dataset.sortType;
    const currentFilter = [...document.querySelectorAll(`.filter__input`)].find((filterItem) => filterItem.checked).id;

    let sortedTasks = [];

    switch (currentSort) {
      case `date-up`:
        sortedTasks = getSortedTasks((a, b) => a.dueDate - b.dueDate);
        break;
      case `date-down`:
        sortedTasks = getSortedTasks((a, b) => b.dueDate - a.dueDate);
        break;
      case `default`:
        sortedTasks = getSortedTasks(() => true);
        break;
    }

    switch (currentFilter) {
      case `filter__all`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => !task.isArchive);
        break;
      case `filter__overdue`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => moment(Date.now()).subtract(1, `days`).isAfter(task.dueDate));
        break;
      case `filter__today`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => new Date(task.dueDate).toDateString() === new Date(Date.now()).toDateString());
        break;
      case `filter__favorites`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => task.isFavorite);
        break;
      case `filter__repeating`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day]));
        break;
      case `filter__tags`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => task.tags.size > 0);
        break;
      case `filter__archive`:
        sortedTasks = getFilterTasks(sortedTasks, (task) => task.isArchive);
        break;
    }

    return sortedTasks;
  }

  _onDataChange(tasks) {
    this._tasks = tasks;

    this._onDataChangeMain(tasks);
    this._renderBoard();
  }

  _onLoadMoreButtonClick() {
    const nextRenderTasks = this._shownTasksCount + TASK_COUNT.render;
    const sortedTasks = this._getSortTasks(this._tasks);

    this._taskListController._renderMoreTasks(sortedTasks.slice(this._shownTasksCount, nextRenderTasks));

    this._shownTasksCount = nextRenderTasks;

    if (this._shownTasksCount >= sortedTasks.length) {
      this._loadMoreButton.getElement().removeEventListener(`click`, this._bindOnLoadMoreButtonClick);
      this._loadMoreButton.removeElement();
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._sort.getElement().querySelectorAll(`.board__filter`).forEach((sortItem) => sortItem.classList.remove(`board__filter--active`));
    evt.target.classList.add(`board__filter--active`);

    const sortedTasks = this._getSortTasks(this._tasks);

    this._taskListController._renderTasks(sortedTasks.slice(0, this._shownTasksCount), this._tasks);
  }

  _onFilterClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    switch (evt.target.id) {
      case `filter__all`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__overdue`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__today`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__favorites`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__repeating`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__tags`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
      case `filter__archive`:
        this._shownTasksCount = TASK_COUNT.render;
        break;
    }
  }

  init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._sort.getElement());
    renderElement(this._board.getElement(), this._taskList.getElement());

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }
}
