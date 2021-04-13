import { _decorator, Component, Node, director, game } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';
import Gender from './libraries/Gender';

@ccclass('OutdoorCanvas')
export class OutdoorCanvas extends Component {
    @property({ type: Node })
    private contextNode!: Node;
    public start() {
        this.initContext(this.contextNode);

        this.enterBattle();
    }

    private initContext(contextNode: Node) {
        game.addPersistRootNode(contextNode);

        const context = this.contextNode.getComponent(Context);

        if (!context) {
            throw Error("No context.");
        }

        context.player = context.getPlayer("lucas", Gender.Male, [context.getPokemon(25, Gender.Female, 1)]);
    }
    
    private enterBattle() {
        const context = this.contextNode.getComponent(Context);

        if (!context) {
            throw Error("No context.");
        }

        context.enemyPokemon = context.getPokemon(25, Gender.Female, 1);
        director.preloadScene("battle");
        director.loadScene("battle");
    }
}
