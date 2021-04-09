import Gender from "./Gender";

export default class {
    public readonly id: number;
    public readonly name: string;
    public readonly gender: Gender;
    public readonly level: Number;

    constructor(id: number, name: string, gender: Gender, level: number) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.level = level;
    }
}