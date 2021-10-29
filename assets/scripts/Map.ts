
import { _decorator, Animation, AnimationClip, Component, EventKeyboard, find, KeyCode, macro, Mat4, Node, resources, Sprite, SpriteAtlas, SpriteFrame, SystemEvent, systemEvent, TiledMap, TiledObjectGroup, tween, UITransform, Vec2, Vec3, Size, Quat } from "cc";
const { ccclass, property } = _decorator;

import CharacterOnMap from "./libraries/CharacterOnMap";
import Context from "./Context";

const testCollisionBetweenPointAndRect = (point: Vec2, rect: [Vec2, Vec2]) => {
    const clashOnX: boolean = rect[0].x === point.x || rect[1].x === point.x
        || (rect[0].x - point.x > 0 && rect[1].x - point.x < 0)
        || (rect[0].x - point.x < 0 && rect[1].x - point.x > 0);
        
    const clashOnY: boolean = rect[0].y === point.y || rect[1].y === point.y
        || (rect[0].y - point.y > 0 && rect[1].y - point.y < 0)
        || (rect[0].y - point.y < 0 && rect[1].y - point.y > 0);

    return clashOnX && clashOnY;
}

/**
 * Predefined variables
 * Name = Map
 * DateTime = Fri Oct 22 2021 16:22:00 GMT+0800 (China Standard Time)
 * Author = undefined
 * FileBasename = Map.ts
 * FileBasenameNoExtension = Map
 * URL = db://assets/scripts/Map.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Map')
export class Map extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Context })
    private context!: Context;

    private mapMatrix?: Mat4;
    private mapMatrixReverse?: Mat4;
    private tiledMap?: TiledMap;
    private collisionGroup?: TiledObjectGroup;
    private characters: CharacterOnMap[] = [];

    start () {
        // [3]
        const context = find("context")?.getComponent(Context) || undefined;

        if (!context) {
            throw new Error("No context.");
        }
        
        this.context = context;
        this.tiledMap = this.node.getComponent(TiledMap) || undefined;
        
        if (!this.tiledMap) {
            throw new Error("No tiled map.")
        };

        this.collisionGroup = this.tiledMap.getObjectGroup("collision") || undefined;

        this.setUpMapMatrix();
        this.setUpCharacters();
    }

    onDestroy() {
        this.characters.forEach((character) => {
            character.destroy();
        });
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    private setUpMapMatrix() {
        const uiTransform = this.node.getComponent(UITransform);
        const size = uiTransform?.contentSize;
        const anchorPoint = uiTransform?.anchorPoint;
        
        if (!size || !anchorPoint) {
            throw new Error("Map size is not set.");
        }

        const halfTileSize = new Vec2(this.tiledMap?.getTileSize().x, this.tiledMap?.getTileSize().y).multiplyScalar(.5);

        this.mapMatrix = Mat4.fromRT(new Mat4(), new Quat(0, 0, 0, 0), new Vec3(anchorPoint.x * size.x * -1 + halfTileSize.x, anchorPoint.y * size.y * -1 - halfTileSize.y, 0));
        this.mapMatrixReverse = this.mapMatrix.clone().transpose();
        console.log(this.mapMatrixReverse);
    }

    private async setUpCharacters() {
        if (this.characters.length) {
            return;
        }

        return await Promise.all((this.tiledMap?.getObjectGroup("characters")?.getObjects() || []).map(async (object) => {
            if (!this.mapMatrix) {
                throw new Error("No map matrix set.");
            }

            //@ts-ignore
            const { frameheight, framewidth, image, x, y } = object;
            const character = new CharacterOnMap(this.context.player?.name || "", this.node, "", `textures/characters/${image.replace("${trainer}", this.context.player?.id)}`);
            
            this.characters.push(character);
            character.setPosition(new Vec3(x, y, 0).transformMat4(this.mapMatrix));
            character.setSize(new Vec3(framewidth, frameheight));

            character.onMoveBy((node, direction, callback) => {
                const duration = .5;

                if (!this.collisionGroup) {
                    throw new Error("No collision layer found.");
                }
                
                for (const object of this.collisionGroup.getObjects()) {
                    if (!this.mapMatrixReverse) {
                        throw new Error("No map matrix set.");
                    }
                    

                    const collision = testCollisionBetweenPointAndRect(new Vec2(node.position.x + direction.x, node.position.y + direction.y).transformMat4(this.mapMatrixReverse), [
                        new Vec2(object.x, object.y),
                        new Vec2(object.x + object.width, object.y + object.height),
                    ]);

                    if (collision) {
                        if (callback) {
                            callback(false);
                        }

                        return false;
                    }
                }

                tween(node)
                .by(duration, { position: direction }, { easing: "linear" })
                .call(() => {
                    if (callback) {
                        callback(true);
                    }
                })
                .start();

                return true;
            });

            character.playAnimation("stand");
        }));
    }


}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
