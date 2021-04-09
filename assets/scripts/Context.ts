import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import config from "../config/config";
import pokemons from "../config/pokemons";

import I18n from "./libraries/I18n";
import Gender from "./libraries/Gender";
import Pokemon from "./libraries/Pokemon";
import Player from "./libraries/Player";

@ccclass('Context')
export default class Context extends Component {
    private i18n: I18n;
    @property
    private lang: string = "en";
    @property
    public enemyPokemon?: Pokemon;
    @property
    public player?: Player;
    @property
    public playerPokemon?: Pokemon;

    constructor() {
        super();

        this.lang = config.language;
        this.i18n = new I18n(this.lang);
    }

    public getI18nText(id: string) {
        return this.i18n.getText(id);
    }
    
    public getPlayer(id: string, gender: Gender) {
        const name = this.i18n.getText(id);

        if (!name) {
            throw Error(`Player not exists. id: ${id}`);
        }

        return new Player(id, name, gender);
    }
    
    public getPokemon(id: number, gender: Gender, level: number) {
        const pokemonData = (pokemons as any)[id];
        const name = this.getI18nText(`pokemon_name__${id}`);

        if (!pokemonData || !name) {
            throw Error(`Pokemon not exists. id: ${id}`);
        }

        return new Pokemon(id, name, gender, level);
    }
}
