import Task from '../components/task.js';
import TaskEdit from '../components/task-edit.js';

import {renderElement, Key} from '../util.js';

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._taskComponent = new Task(data);
    this._taskEditComponent = new TaskEdit(data);

    this.create();
  }

  _replaceConditionTask(condition1, condition2) {
    this._container.getElement().replaceChild(condition1, condition2);
  }

  create() {
    const onEscKeyDown = (evt) => {
      if (this._container.getElement().contains(this._taskEditComponent.getElement()) && (evt.key === Key.ESCAPE_IE || evt.key === Key.ESCAPE)) {
        this._replaceConditionTask(this._taskComponent.getElement(), this._taskEditComponent.getElement());

        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const addTo = (container) => container.classList.contains(`card__btn--disabled`) ? true : false;

    this._taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onChangeView();
      this._replaceConditionTask(this._taskEditComponent.getElement(), this._taskComponent.getElement());

      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEditComponent.getElement().querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEditComponent.getElement().querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEditComponent.getElement().querySelector(`.card__form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      this._replaceConditionTask(this._taskComponent.getElement(), this._taskEditComponent.getElement());
    });

    this._taskEditComponent.getElement().querySelector(`.card__save`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const formData = new FormData(this._taskEditComponent.getElement().querySelector(`.card__form`));

      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: new Date(formData.get(`date`)),
        repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {
          'mo': false,
          'tu': false,
          'we': false,
          'th': false,
          'fr': false,
          'sa': false,
          'su': false,
        }),
        isFavorite: addTo(this._taskEditComponent.getElement().querySelector(`.card__btn--favorites`)),
        isArchive: addTo(this._taskEditComponent.getElement().querySelector(`.card__btn--archive`)),
      };

      this._onDataChange(entry, this._data);

      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    renderElement(this._container.getElement(), this._taskComponent.getElement());
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEditComponent.getElement())) {
      this._replaceConditionTask(this._taskComponent.getElement(), this._taskEditComponent.getElement());
    }
  }
}
