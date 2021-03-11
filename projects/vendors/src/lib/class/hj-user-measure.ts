export class HJUserMeasure implements Object {
    measure: number;
    unit: string
    constructor(measure, unit) {
        this.measure = measure;
        this.unit = unit;
    }

    toString() {
        return `${this.measure} ${this.unit}`;
    }

}
