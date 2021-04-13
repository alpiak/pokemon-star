import Gender from "./Gender";
import Pokemon from "./Pokemon";

export default class {
    public readonly id: string;
    public readonly name: string;
    public readonly gender: Gender;
    public readonly pokemons: Array<Pokemon>;

    constructor(id: string, name: string, gender: Gender, pokemons?: Array<Pokemon>) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.pokemons = pokemons || [];
    }
}