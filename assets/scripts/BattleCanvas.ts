import { _decorator, Component, Sprite, SpriteFrame, ImageAsset, Label, Animation, find, resources } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';

@ccclass('BattleCanvas')
export class BattleCanvas extends Component {
    @property({ type: Context })
    private context?: Context;

    public start() {
        this.context = find("context")?.getComponent(Context) || undefined;
        
        this.showEnemy();
    }
    
    private showEnemy() {
        if (this.context && this.context.enemy) {
            const enemyNameLabel = this.node.getChildByPath("hpBarEnemy/enemyName")?.getComponent(Label);

            if (enemyNameLabel) {
                enemyNameLabel.string = this.context?.enemy?.name || "";
            }

            resources.load([`textures/pokemons/${this.context.enemy.id}`], ImageAsset, (err: Error | null, imageAssets: ImageAsset[] | null | undefined) => {
                if (err) {
                    throw err;
                }

                if (imageAssets && imageAssets[0]) {
                    const sprite = this.node.getChildByPath("enemy/body")?.getComponent(Sprite);
                    
                    if (sprite) {
                        sprite.spriteFrame = SpriteFrame.createWithImage(imageAssets[0]);
                    }
                }
            });
        }

        this.node.getChildByName("enemy")?.on("afterAppear", () => {
            const animation = this.node.getChildByPath("hpBarEnemy")?.getComponent(Animation);

            if (animation) {
                animation.play();
            }
        });
    }
}
