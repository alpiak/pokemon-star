// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import config from "../config/config";
import pokemons from "../config/pokemons";

import I18N from "./entities/I18N";
import Pokemon from "./entities/Pokemon";
import Gender from "./entities/Gender";

@ccclass('Context')
export default class Context extends Component {
    private i18n: I18N;
    @property
    private lang: string = "en";
    @property
    public enemy?: Pokemon;

    constructor() {
        super();

        this.lang = config.language;
        this.i18n = new I18N(this.lang);
    }
    
    getPokemon(id: number, gender: Gender, level: number) {
        const pokemonData = (pokemons as any)[id];
        const name = this.i18n.getText(`pokemon_name__${id}`);

        if (!pokemonData || !name) {
            throw Error(`Pokemon not exists. id: ${id}`);
        }

        return new Pokemon(id, name, gender, level);
    }
}
