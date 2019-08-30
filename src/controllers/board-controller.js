import Board from '../components/board.js';
import BoardFilters from '../components/board-filters.js';
import TaskContainer from '../components/tasks-container.js';
import Task from '../components/task.js';
import TaskEdit from '../components/task-edit.js';
import LoadMoreButton from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';
import {renderElement, Key, Position} from '../util.js';
import {TASK_COUNT} from '../constants.js';

const {render} = TASK_COUNT;
const {AFTERBEGIN} = Position;

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._boardFilters = new BoardFilters();
    this._taskContainer = new TaskContainer();
    this._loadMoreButton = new LoadMoreButton();
    this._noTasks = new NoTasks();
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

  init() {
    const renderTasks = (taskList) => {
      taskList.splice(0, render).forEach((task) => this._renderTask(task));
    };

    const copyTasks = this._tasks.slice();
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._boardFilters.getElement(), AFTERBEGIN);

    if (!this._tasks.length) {
      renderElement(this._board.getElement(), this._noTasks.getElement());
      return;
    }

    renderElement(this._board.getElement(), this._taskContainer.getElement());

    if (this._tasks.length > render) {
      renderElement(this._board.getElement(), this._loadMoreButton.getElement());
    }

    renderTasks(copyTasks);

    const onRenderMoreTask = () => {
      if (copyTasks.length) {
        renderTasks(copyTasks);

        if (!copyTasks.length) {
          loadMoreTasks.style.display = `none`;
          loadMoreTasks.removeEventListener(`click`, onRenderMoreTask);
        }
      }
    };

    const loadMoreTasks = this._loadMoreButton.getElement();

    if (loadMoreTasks) {
      loadMoreTasks.addEventListener(`click`, onRenderMoreTask);
    }
  }
}
