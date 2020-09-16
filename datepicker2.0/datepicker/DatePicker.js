import prev from '../img/prev.png'
import next from '../img/next.png'

const getTemplate = () => {
    return `
    <div class="backdrop" data-type="backdrop"></div>
    <div class="input" data-type="input"></div>
        <div class="dropdown">
            <div class="header">
                <button class="before" data-type="before"><img src=${prev} data-type="before"></button>
                <div class="mounth" data-type="mounth">April</div>
                <button class="next" data-type="next"><img src=${next} data-type="next"></button>
            </div>
        <div class="content" data-type="content"></div>
    </div>
    `
}

const mounts = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
]

export class DatePicker {
    // это конструктор класса. То есть он вызывается при создании объекта
    constructor(selector, options) {
        // $ - это значит, что это node элемент DOM
        this.$el = document.querySelector(selector)

        this.options = options

        //текущие значения
        const d = new Date()
        this.year = d.getFullYear()
        this.mounth = d.getUTCMonth()
        this.day = d.getDate()

        this.calcDates()

        //Послк того, как создали, нарисовали
        //ВАЖНО! Написовали != видно пользователю
        this.#render()
        this.#setup()
    }

    //Метод открывающий/показывающий календарь
    open() {
        //то есть мы обращаемся к нашему элементу
        //у него к параметру классов(стилей/селекторов)
        //и добавляем туда open
        this.$el.classList.add('open')

        //
    }

    //Метод закрывающий/скрывающий календарь
    close() {
        //то есть мы обращаемся к нашему элементу
        //у него к параметру классов(стилей/селекторов)
        //и убираем оттуда open
        this.$el.classList.remove('open')
    }

    select() {
        //
        const m = ('0' + (this.mounth + 1)).slice(-2)
        const d = ('0' + this.day).slice(-2)
        this.$input.textContent = `${d}.${m}.${this.year}`
        this.options.onSelect ? this.options.onSelect(`${d}.${m}.${this.year}`) : null
    }

    //приватный метод, который рисует
    //приватный, это значит что только изнутри может быть вызван
    #render() {
        //добавить класс
        this.$el.classList.add('datepicker')
        //Ты кладешь внуть этого тега/node нужный тебе хэтэмэль
        this.$el.innerHTML = getTemplate()
    }

    #setup() {
        //Это нужно, чтобы this в handleClick работало коректно
        this.handleClick = this.handleClick.bind(this)
        //вешаем слушателя кликов по нашему элементу
        this.$el.addEventListener('click', this.handleClick)

        this.$mounth = this.$el.querySelector('[data-type="mounth"]')
        this.$mounth.textContent = `${mounts[this.mounth]}, ${this.year}`

        this.$input = this.$el.querySelector('[data-type="input"]')
        const m = ('0' + (this.mounth + 1)).slice(-2)
        const d = ('0' + this.day).slice(-2)
        this.$input.textContent = `${d}.${m}.${this.year}`

        this.$content = this.$el.querySelector('[data-type="content"]')

        // this.$mounth.addEventListener('click' this.handle)

        this.#renderDates()
    }

    #renderDates() {
        let str = ``
        //name days
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        for (let i = 0; i < 7; i++) {
            str += `<div class="days">${days[i]}</div>`
        }

        for (let i = 0; i < this.first_wday - 1; i++) {
            str += `<div class="disabled"> </div>`
        }
        for (let i = 1; i < this.last_date; i++) {
            str += `<div data-type="date">${i}</div>`
        }
        this.$content.innerHTML = `<div class="days_grid">` + str + `</div>`
        this.$vis = 0
    }

    #renderMounth() {
        let template = ``
        template = mounts
            .map((m) => {
                return `<div data-type="mounth_m">${m}</div>`
            })
            .join('')
        this.$content.innerHTML = `<div class="mounth_grid">` + template + `</div>`
        this.$vis = 1
    }

    #renderYears() {
        let template = ``
        template = Array(100)
            .fill()
            .map((e, i) => i + 1930)
            .map((m) => {
                return `<div data-type="year_m">${m}</div>`
            })
            .join('')
        this.$content.innerHTML = `<div class="year_grid">` + template + `</div>`
        this.$vis = 2
    }

    //Обработка клика по корневому элеементу
    handleClick(event) {
        // {} - это вытяшивание нужных значений. Можно так const type = event.target.dataset.type Но уже обычно так не делают из-за привычки, когда несколько переменных надо вытащить
        const { type } = event.target.dataset
        //console.log(type, event) //ДЕБАГ кликов
        if (type === 'input') {
            this.toogle()
        }
        if (type === 'before') {
            this.mounth -= 1
            if (this.mounth <= -1) {
                this.mounth = 11
                this.year -= 1
            }
            this.calcDates()
            this.#renderDates()
            this.$mounth.textContent = `${mounts[this.mounth]}, ${this.year}`
        }
        if (type === 'next') {
            this.mounth += 1
            if (this.mounth >= 12) {
                this.mounth = 0
                this.year = +this.year + 1
            }
            this.calcDates()
            this.#renderDates()
            this.$mounth.textContent = `${mounts[this.mounth]}, ${this.year}`
        }

        if (type === 'date') {
            this.day = event.target.textContent
            this.select()
            this.toogle()
        }

        if (type === 'backdrop') {
            this.#renderDates()
            this.close()
        }
        if (type === 'mounth_m') {
            this.mounth = mounts.indexOf(event.target.textContent)
            this.select()
            this.calcDates()
            this.#renderYears()
        }
        if (type === 'year_m') {
            this.year = event.target.textContent
            this.$mounth.textContent = `${mounts[this.mounth]}, ${this.year}`
            this.select()
            this.calcDates()
            this.toogle()
            this.#renderDates()
        }
        if (type === 'mounth') {
            if (this.$vis === 0) {
                this.#renderMounth()
            } else if (this.$vis === 1) {
                this.#renderYears()
            } else if (this.$vis === 2) {
                this.#renderDates()
            }
        }
    }

    //
    destroy() {
        //Убираем клик. Напрмер, когда открывается другая страничка, где нет нашего элемента
        this.$el.removeEventListener('click', this.handleClick)
    }

    toogle() {
        this.isOpen ? this.close() : this.open()
    }

    get isOpen() {
        return this.$el.classList.contains('open')
    }

    calcDates() {
        let first_day = new Date(this.year, this.mounth, 1) // устанавливаем дату первого числа текущего месяца
        console.log(first_day)
        this.first_wday = first_day.getDay() // из нее вычисляем день недели первого числа текущего месяца
        const oneHour = 1000 * 60 * 60 // вычисляем количество миллисекунд в 1 часе
        const oneDay = oneHour * 24 // вычисляем количество миллисекунд в одних сутках
        const nextMonth = new Date(this.year, this.mounth + 1, 1) // устанавливаем дату первого числа следующего месяца
        this.last_date =
            Math.ceil((nextMonth.getTime() - first_day.getTime() - oneHour) / oneDay) + 1 // вычисляем крайний день текущего месяца
        console.log('DEBUG: ', this.first_wday)
    }
}
