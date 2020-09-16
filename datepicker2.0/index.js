import { DatePicker } from './datepicker/DatePicker'
import './datepicker/index.css'

const picker = new DatePicker('#datepicker', {
    onSelect(item) {
        console.log('Selected date: ', item)
    },
})
