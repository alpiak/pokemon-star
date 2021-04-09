import { _decorator, Component, Sprite, SpriteFrame, ImageAsset, Label, Animation, find, resources } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';

import { showTextLikeTypeWriter, startConversation } from "./libraries/utils";

@ccclass('BattleCanvas')
export class BattleCanvas extends Component {
    @property({ type: Context })
    private context!: Context;

    public start() {
        const context = find("context")?.getComponent(Context) || undefined;

        if (!context) {
            throw Error("Not context.");
        }
        
        this.context = context;
        this.showEnemy();
        this.showPlayer();
    }
    
    private showEnemy() {
        if (this.context && this.context.enemyPokemon) {
            const enemyNameLabel = this.node.getChildByPath("hpBarEnemy/enemyName")?.getComponent(Label);

            if (enemyNameLabel) {
                enemyNameLabel.string = this.context.enemyPokemon?.name || "";
            }

            resources.load([`textures/pokemons/${this.context.enemyPokemon.id}_enemy`], ImageAsset, (err: Error | null, imageAssets: ImageAsset[] | null | undefined) => {
                if (err) {
                    throw err;
                }

                if (imageAssets && imageAssets[0]) {
                    const sprite = this.node.getChildByPath("enemy/body")?.getComponent(Sprite);
                    
                    if (sprite) {
                        sprite.spriteFrame = SpriteFrame.createWithImage(imageAssets[0]);
                    }
                }

                this.node.getChildByPath("enemy")?.getComponent(Animation)?.play();
            });
        }

        this.node.getChildByName("enemy")?.on("afterAppear", () => {
            this.node.getChildByPath("hpBarEnemy")?.getComponent(Animation)?.play();
        });
    }

    private showPlayer() {
        if (this.context && this.context.player) {
            resources.load([`textures/characters/${this.context.player.id}`], ImageAsset, (err: Error | null, imageAssets: ImageAsset[] | null | undefined) => {
                if (err) {
                    throw err;
                }
    
                if (imageAssets && imageAssets[0]) {
                    const sprite = this.node.getChildByPath("player/body")?.getComponent(Sprite);
                    
                    if (sprite) {
                        sprite.spriteFrame = SpriteFrame.createWithImage(imageAssets[0]);
                    }
                }

                this.node.getChildByPath("player")?.getComponent(Animation)?.play("playerAppear");

                this.node.getChildByName("player")?.on("afterAppear", () => {
                    const messageLabel = this.node.getChildByPath("actions/dialogBox/message")?.getComponent(Label);

                    if (!messageLabel) {
                        throw Error("UI component to show dialog is not existing.");
                    }

                    startConversation([
                        this.context.getI18nText("battle_opening_conversion__1").replace("?", this.context.enemyPokemon?.name),
                        this.context.getI18nText("battle_opening_conversion__2").replace("?", this.context.playerPokemon?.name),
                    ], async (line: string) => {
                        await showTextLikeTypeWriter(messageLabel, line);
                    }, async () => {
                        this.node.getChildByPath("player/body")?.getComponent(Animation)?.play("throwPokeball");

                        await new Promise((r) => setTimeout(r, 500));
                        
                        this.node.getChildByPath("pokeball")?.getComponent(Animation)?.play("pokeballFly");
                    }, { autoPassTimeout: 1000 });
                });
            });
        }
    }
}
