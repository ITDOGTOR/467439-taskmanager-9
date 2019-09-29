import moment from 'moment';
import AbstractComponent from '../components/abstract-component.js';

import {Key, unrenderElement} from '../util.js';
import {COLORS} from '../constants.js';

export default class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = dueDate !== null ? new Date(dueDate) : null;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;

    this._isRepeat = Object.values(this._repeatingDays).some((it) => it === true);
    this._isDeadLine = moment(Date.now()).subtract(1, `days`).isAfter(this._dueDate);

    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const dateContainer = this.getElement().querySelector(`.card__date-deadline`);
    const dateInput = this.getElement().querySelector(`.card__date`);
    const dateStatus = this.getElement().querySelector(`.card__date-status`);

    const repeatContainer = this.getElement().querySelector(`.card__repeat-days`);
    const repeatInputs = this.getElement().querySelectorAll(`.card__repeat-day-input`);
    const repeatStatus = this.getElement().querySelector(`.card__repeat-status`);

    const addToArchive = this.getElement().querySelector(`.card__btn--archive`);
    const addToFavorite = this.getElement().querySelector(`.card__btn--favorites`);

    this.getElement().querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
      if (evt.key === Key.ENTER) {
        evt.preventDefault();

        this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${evt.target.value}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${evt.target.value}
          </p>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`);

        evt.target.value = ``;
      }
    });

    this.getElement().querySelector(`.card__hashtag-list`).addEventListener(`click`, (evt) => {
      if (evt.target.classList.contains(`card__hashtag-delete`)) {
        unrenderElement(evt.target.parentNode);
      }
    });

    this.getElement().querySelector(`.card__colors-wrap`).addEventListener(`change`, (evt) => {
      this.getElement().classList.remove(`card--black`, `card--yellow`, `card--blue`, `card--pink`, `card--green`);
      this.getElement().classList.add(`card--${evt.target.value}`);
    });

    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      if (!(repeatContainer.classList.contains(`visually-hidden`))) {
        this.getElement().classList.remove(`card--repeat`);
        repeatStatus.textContent = `no`;
        this._setDefaultDayValue(repeatInputs);
        repeatContainer.classList.add(`visually-hidden`);
      }

      if (dateContainer.classList.contains(`visually-hidden`)) {
        dateContainer.classList.remove(`visually-hidden`);
        dateStatus.textContent = `yes`;
        dateInput.value = this._dueDate !== null ? this._dueDate : Date.now();
      } else {
        dateContainer.classList.add(`visually-hidden`);
        dateStatus.textContent = `no`;
        dateInput.value = null;
      }
    });

    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this.getElement().classList.toggle(`card--repeat`);

      if (!(dateContainer.classList.contains(`visually-hidden`))) {
        dateStatus.textContent = `no`;
        dateContainer.classList.add(`visually-hidden`);
        dateInput.value = null;
      }

      if (repeatContainer.classList.contains(`visually-hidden`)) {
        repeatContainer.classList.remove(`visually-hidden`);
        repeatStatus.textContent = `yes`;
      } else {
        repeatContainer.classList.add(`visually-hidden`);
        repeatStatus.textContent = `no`;
        this._setDefaultDayValue(repeatInputs);
      }
    });

    addToArchive.addEventListener(`click`, () => {
      addToArchive.classList.toggle(`card__btn--disabled`);
    });

    addToFavorite.addEventListener(`click`, () => {
      addToFavorite.classList.toggle(`card__btn--disabled`);
    });
  }

  _setDefaultDayValue(days) {
    days.forEach((day) => {
      day.checked = false;
    });
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeat ? `card--repeat` : ``} ${this._isDeadLine ? `card--deadline` : ``}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--archive ${this._isArchive ? `card__btn--disabled` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${this._isFavorite ? `card__btn--disabled` : ``}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
                maxlength="140"
                required
              >${this._description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${this._dueDate ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline ${this._dueDate ? `` : `visually-hidden`}">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${this._dueDate ? moment(this._dueDate).format(`DD MMMM`) : ``} ${this._dueDate ? moment(this._dueDate).format(`LT`) : ``}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._isRepeat ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days ${this._isRepeat ? `` : `visually-hidden`}">
                  <div class="card__repeat-days-inner">
                    ${Object.keys(this._repeatingDays).map((day) => `<input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-${day}-4"
                      name="repeat"
                      value="${day}"
                      ${this._repeatingDays[day] ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-${day}-4"
                      >${day}</label
                    >`).join(``)}
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                    <input
                      type="hidden"
                      name="hashtag"
                      value="${tag}"
                      class="card__hashtag-hidden-input"
                    />
                    <p class="card__hashtag-name">
                      #${tag}
                    </p>
                    <button type="button" class="card__hashtag-delete">
                      delete
                    </button>
                  </span>`).join(``)}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${COLORS.map((color) => `<input
                  type="radio"
                  id="color-${color}-4"
                  class="card__color-input card__color-input--${color} visually-hidden"
                  name="color"
                  value="${color}"
                  ${this._color === color ? `checked` : ``}
                />
                <label
                  for="color-${color}-4"
                  class="card__color card__color--${color}"
                  >${color}</label
                >`).join(``)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
  }
}
