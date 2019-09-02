import AbstractComponent from '../components/abstract-component.js';

import {COLORS} from '../constants.js';

export default class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = new Date(dueDate);
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;
    this._isRepeat = Object.values(this._repeatingDays).some((it) => it === true);
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeat ? `card--repeat` : ``}">
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
              >${this._description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${this._dueDate.toDateString() ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline ${this._dueDate.toDateString() ? `` : `visually-hidden`}">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${this._dueDate.toDateString()} ${this._dueDate.getHours()}:${this._dueDate.getMinutes()}"
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
