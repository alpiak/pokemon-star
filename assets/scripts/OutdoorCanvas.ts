import { _decorator, Component, Node, director, game } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';
import Gender from './entities/Gender';

@ccclass('OutdoorCanvas')
export class OutdoorCanvas extends Component {
    @property({ type: Node })
    private contextNode!: Node;
    public start() {
        game.addPersistRootNode(this.contextNode);

        this.enterBattle();
    }
    
    private enterBattle() {
        const context = this.contextNode.getComponent(Context);

        if (!context) {
            throw Error("No context.");
        }

        context.enemy = context.getPokemon(25, Gender.Female, 1);
        director.preloadScene("battle");
        director.loadScene("battle");
    }
}
