import Gender from "./Gender";

export default class {
    public readonly id: string;
    public readonly name: string;
    public readonly gender: Gender;

    constructor(id: string, name: string, gender: Gender) {
        this.id = id;
        this.name = name;
        this.gender = gender;
    }
}