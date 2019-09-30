import TaskController, {Mode as TaskControllerMode} from '../controllers/task-controller.js';
import FiltersController from '../controllers/filters-controller.js';
import {unrenderElement} from '../util.js';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._tasks = [];
    this._shownTasksCount = null;
    this._creatingTask = null;
    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._filtersController = new FiltersController(document.querySelector(`.main__filter`));
  }

  _renderTasks(visibleTasks, allTasks) {
    this._tasks = allTasks;
    this._subscriptions = [];
    this._creatingTask = null;
    this._shownTasksCount = visibleTasks.length;

    this._container.innerHTML = ``;
    // Удаляет все календари flatpickr
    document.querySelectorAll(`.flatpickr-calendar`).forEach((element) => unrenderElement(element));
    visibleTasks.forEach((task) => this._renderOneTask(task));
  }

  _renderOneTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderMoreTasks(tasks) {
    tasks.forEach((task) => this._renderOneTask(task));
    this._shownTasksCount += tasks.length;
  }

  _renderNewTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: null,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      tags: new Set(),
      color: `black`,
      isFavorite: false,
      isArchive: false,
    };

    this._onChangeView();
    this._createTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onChangeView, (...args) => {
      this._createTask = null;
      this._onDataChange(...args);
    });
  }

  _onDataChange(newData, oldData) {
    const taskIndex = this._tasks.findIndex((task) => task === oldData);

    // Если новая карточка была удалена без сохранения
    if (newData === null && oldData === null) {
      this._onDataChangeMain(this._tasks);
      return;

    // Если любая открытая карточка была удалена
    } else if (newData === null) {
      this._tasks = [...this._tasks.slice(0, taskIndex), ...this._tasks.slice(taskIndex + 1)];

    // Если была создана новая карточка
    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];

    // Если были изменены данные любой открытой карточки
    } else {
      this._tasks[taskIndex] = newData;
    }

    this._onDataChangeMain(this._tasks);
    this._filtersController._updateFilters(this._tasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());

    // Удаляет новую карточку, если она сначала была создана, а потом кликнули Edit другой любой карточки или при переключении окна, или при сортировке
    if (this._container.children.length > this._shownTasksCount) {
      unrenderElement(this._container.firstElementChild);
      this._creatingTask = null;
    }
  }
}
