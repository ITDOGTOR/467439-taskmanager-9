import AbstractComponent from '../components/abstract-component.js';

export default class Task extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isArchive, isFavorite}) {
    super();
    this._description = description;
    this._dueDate = new Date(dueDate);
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;
    this._isRepeat = Object.values(this._repeatingDays).some((it) => it === true);
  }

  getTemplate() {
    // Временное решение для дедлайна карточки
    return `<article class="card card--${this._color} ${this._isRepeat ? `card--repeat` : ``} ${this._dueDate > Date.now() + 399999999 ? `card--deadline` : ``}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
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
            <p class="card__text">${this._description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${this._dueDate.toDateString()}</span>
                    <span class="card__time">${this._dueDate.getHours()}:${this._dueDate.getMinutes()}</span>
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #${tag}
                    </span>
                  </span>`.trim()).join(``)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
  }
}
