export class Paciente {

    constructor(_id = '', position = 0, name = '', weight = '', symbol = '') {
        this._id = _id;
        this.position = position;
        this.name = name;
        this.weight = weight;
        this.symbol = symbol;
    }

    _id: string;
    position: number;
    name: string;
    weight: string;
    symbol: string;
}
