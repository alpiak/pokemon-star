import { _decorator, Component, Sprite, SpriteFrame, ImageAsset, Label, Animation, UIOpacity, ParticleSystem2D, find, resources } from 'cc';
const { ccclass, property } = _decorator;

import Context from "./Context";
import Navigation from "./libraries/Navigation";
import NavigationItem from "./libraries/NavigationItem";

import { showTextLikeTypeWriter, startConversation } from "./libraries/utils";

@ccclass('BattleCanvas')
export class BattleCanvas extends Component {
    private static NoDialogUIComponentError = Error("UI component to show dialog is not existing.");

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
            this.node.getChildByPath("hpBarEnemy")?.getComponent(Animation)?.play("hpBarEnemyShow");
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
                        throw BattleCanvas.NoDialogUIComponentError;
                    }

                    startConversation([
                        this.context.getI18nText("battle_opening_conversion__1").replace("?", this.context.enemyPokemon?.name),
                        this.context.getI18nText("battle_opening_conversion__2").replace("?", this.context.player?.pokemons[0]?.name),
                    ], async (line: string) => {
                        await showTextLikeTypeWriter(messageLabel, line);
                    }, async () => {
                        this.node.getChildByPath("player/body")?.getComponent(Animation)?.play("throwPokeball");

                        await new Promise((r) => setTimeout(r, 500));

                        this.node.getChildByPath("pokeball")?.getComponent(Animation)?.play("pokeballFly");
                    }, { autoPassTimeout: 1000 });
                });
            });
            
            const pokemonNameLabel = this.node.getChildByPath("hpBarPlayer/pokemonName")?.getComponent(Label);

            if (pokemonNameLabel) {
                pokemonNameLabel.string = this.context.player?.pokemons[0]?.name || "";
            }

            resources.load([`textures/pokemons/${this.context.player?.pokemons[0]?.id}_player`], ImageAsset, (err: Error | null, imageAssets: ImageAsset[] | null | undefined) => {
                if (err) {
                    throw err;
                }
    
                if (imageAssets && imageAssets[0]) {
                    const sprite = this.node.getChildByPath("player/pokemon")?.getComponent(Sprite);
                    
                    if (sprite) {
                        sprite.spriteFrame = SpriteFrame.createWithImage(imageAssets[0]);
                    }
                }

                this.node.getChildByPath("pokeball")?.on("afterAppear", () => {
                    this.node.getChildByPath("player/pokemon")?.getComponent(Animation)?.play("pokemonAppear");
                    this.node.getChildByPath("player/pokemon/spark")?.getComponent(ParticleSystem2D)?.resetSystem();
                });

                this.node.getChildByPath("player/pokemon")?.on("afterAppear", () => {
                    this.node.getChildByPath("hpBarPlayer")?.getComponent(Animation)?.play("hpBarPlayerShow");
                    this.showNavigation();
                });
            });
        }
    }
    
    private showNavigation() {
        const fight = new NavigationItem(this.node.getChildByPath("actions/menu/fight") || undefined);
        const bag = new NavigationItem(this.node.getChildByPath("actions/menu/bag") || undefined);
        const pokemon = new NavigationItem(this.node.getChildByPath("actions/menu/pokemon") || undefined);
        const run = new NavigationItem(this.node.getChildByPath("actions/menu/run") || undefined);

        fight.right = bag;
        fight.bottom = pokemon;
        bag.left = fight;
        bag.bottom = run;
        pokemon.top = fight;
        pokemon.right = run;
        run.top = bag;
        run.left = pokemon;

        const menu = new Navigation([fight, bag, pokemon, run]);

        const onFocus = (item: NavigationItem) => {
            const uiOpacity = item.uiNode?.getChildByPath("cursor")?.getComponent(UIOpacity);

            if (!uiOpacity) {
                return;
            }
            
            uiOpacity.opacity = 255;
        };
        
        const onLeave = (item: NavigationItem) => {
            const uiOpacity = item.uiNode?.getChildByPath("cursor")?.getComponent(UIOpacity);

            if (!uiOpacity) {
                return;
            }
            
            uiOpacity.opacity = 0;

        }

        menu.listenToKeyboard(onFocus, onLeave);
        menu.listenToMouse(onFocus, onLeave);
        menu.listenToTouch(onFocus, onLeave);

        this.node.getChildByPath("actions/menu")?.getComponent(Animation)?.play("menuShow");

        const messageLabel = this.node.getChildByPath("actions/dialogBox/message")?.getComponent(Label);

        if (!messageLabel) {
            throw BattleCanvas.NoDialogUIComponentError;
        }
        
        messageLabel.string = this.context.getI18nText("battle_conversion__1").replace("?", this.context.player?.pokemons[0]?.name);
    }
}
