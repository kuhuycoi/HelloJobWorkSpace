export class RangeSliderConfig {
    connect = true;
    behaviour = 'drag';
    keyboard = true;
    step = 1;
    pageSteps = 10;
    range = {};
    pips: any = {
        mode: 'count',
        density: 10,
        values: 5,
        stepped: true,
    };
    tooltips = [true, true];
    constructor(min, max) {
        this.range['min'] = min;
        this.range['max'] = max;
    }
}
