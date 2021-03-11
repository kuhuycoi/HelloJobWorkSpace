export interface PickerDataModel<T> {
    textAlign?: 'start' | 'center' | 'end' | 'justify' | 'left' | 'right' | 'nowrap' | 'wrap'
    weight?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    className?: string

    onClick?: Function
    currentIndex?: number
    list?: Array<T>

    divider?: boolean
    text?: string
}
