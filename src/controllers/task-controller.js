import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import Task from '../components/task.js';
import TaskEdit from '../components/task-edit.js';

import {renderElement, Position, Key} from '../util.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const {BEFOREEND, AFTERBEGIN} = Position;
const {ESCAPE, ESCAPE_IE} = Key;
const {ADDING, DEFAULT} = Mode;

export default class TaskController {
  constructor(container, data, mode, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);

    this.init(mode);
  }

  _replaceConditionTask(condition1, condition2) {
    this._container.replaceChild(condition1, condition2);
  }

  init(mode) {
    let renderPosition = BEFOREEND;
    let currentView = this._taskView;

    if (mode === ADDING) {
      renderPosition = AFTERBEGIN;
      currentView = this._taskEdit;
    }

    flatpickr(this._taskEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `j F G:i K`,
      dateFormat: `Y j F G:i K`,
      defaultDate: this._data.dueDate !== null ? this._data.dueDate : `today`,
    });

    const onEscKeyDown = (evt) => {
      if (this._container.contains(this._taskEdit.getElement()) && (evt.key === ESCAPE_IE || evt.key === ESCAPE)) {
        this._replaceConditionTask(this._taskView.getElement(), this._taskEdit.getElement());
      }

      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const addTo = (container) => container.classList.contains(`card__btn--disabled`) ? true : false;

    const dateStatus = this._taskEdit.getElement().querySelector(`.card__date-status`);

    this._taskView.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onChangeView();
      this._replaceConditionTask(this._taskEdit.getElement(), this._taskView.getElement());

      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEdit.getElement().querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEdit.getElement().querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEdit.getElement().querySelector(`.card__form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: dateStatus.innerText === `YES` ? new Date(isFinite(formData.get(`date`)) ? parseInt(formData.get(`date`), 10) : formData.get(`date`)) : null,
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
        isFavorite: addTo(this._taskEdit.getElement().querySelector(`.card__btn--favorites`)),
        isArchive: addTo(this._taskEdit.getElement().querySelector(`.card__btn--archive`)),
      };

      this._onDataChange(entry, mode === DEFAULT ? this._data : null);

      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEdit.getElement().querySelector(`.card__delete`).addEventListener(`click`, () => {
      if (mode === ADDING) {
        this._taskEdit.removeElement();
        this._onDataChange(null, null);
      } else {
        this._onDataChange(null, this._data);
      }
    });

    renderElement(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._replaceConditionTask(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
