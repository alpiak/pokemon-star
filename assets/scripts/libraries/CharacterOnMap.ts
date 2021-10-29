import { Animation, AnimationClip, EventKeyboard, KeyCode, Node, resources, Size, Sprite, SpriteAtlas, SpriteFrame, systemEvent, SystemEvent, TiledMap, TiledObjectGroup, tween, UITransform, Vec2, Vec3 } from "cc";

export default class CharacterOnMap {
    private static createAnimation(name: string, spriteFrames: SpriteFrame[] = []) {
        const animationClip = AnimationClip.createWithSpriteFrames(spriteFrames, 5);

        animationClip.name = name;
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;

        return animationClip;
    }

    private readonly node: Node;
    private readonly parent: Node;
    private size?: Vec3;
    private onMoveByCallback?: (node: Node, direction: Vec3, callback: (success: boolean) => void) => boolean;
    private animationSetUpPromise: Promise<Animation> = new Promise(() => {});
    private keyDown = false;
    private tweening = false;
    private delayedKeyDownEvent : EventKeyboard|null = null;
    private delayedKeyUpEvent : EventKeyboard|null = null;
    
    constructor(name: string, parent: Node, texturePath: string, animationTexturePath: string) {
        (async() => {
            try {
                this.animationSetUpPromise = Promise.reject("Animation is not ready.");
                
                await this.animationSetUpPromise;
            } catch { /**/ }
        })();
        
        this.node = new Node(name);
        this.setUpCharacterAnimation(animationTexturePath);
        this.setUpTexture(texturePath);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.parent = parent;
        this.parent.addChild(this.node);
    }

    public setPosition(position: Vec3) {
        this.node.setPosition(position);
    }

    public setSize(size: Vec3) {
        this.size = size;
        this.node.getComponent(UITransform)?.setContentSize(new Size(size.x, size.y));
    }

    public async playAnimation(id: string) {
        await this.animationSetUpPromise;

        const animation = this.node.getComponent(Animation);

        if (!animation?.getState(id).isPlaying) {
            animation?.play(id);
        }
    }

    public onMoveBy(onMoveByCallback: (node: Node, direction: Vec3, callback: (success: boolean) => void) => boolean) {
        this.onMoveByCallback = onMoveByCallback;
    }

    public destroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    private setUpTexture(texturePath: string) {
        return new Promise((resolve) => {
            resolve(this.node.addComponent(Sprite));
        });
    }

    private setUpCharacterAnimation(texturePath: string) {
        this.animationSetUpPromise = new Promise((resolve, reject) => {
            resources.load([texturePath], SpriteAtlas, (err: Error | null, [spriteAtlas]: SpriteAtlas[] = []) => {
                if (err) {
                    return reject(err);
                }
    
                if (!spriteAtlas) {
                    return reject(new Error("No texture loaded."))
                }

                const animation = this.node.addComponent(Animation);
                const spriteFrames = spriteAtlas.getSpriteFrames();

                animation.createState(CharacterOnMap.createAnimation("stand", [spriteFrames[9] as SpriteFrame].filter(s => s !== null)), "stand");
                animation.createState(CharacterOnMap.createAnimation("stand_back", [spriteFrames[1] as SpriteFrame].filter(s => s !== null)), "stand_back");
                animation.createState(CharacterOnMap.createAnimation("stand_right", [spriteFrames[6] as SpriteFrame].filter(s => s !== null)), "stand_right");
                animation.createState(CharacterOnMap.createAnimation("stand_left", [spriteFrames[2] as SpriteFrame].filter(s => s !== null)), "stand_left");
                animation.createState(CharacterOnMap.createAnimation("walk_up", [spriteFrames[0], spriteFrames[1], spriteFrames[4], spriteFrames[1]].filter(s => s !== null) as SpriteFrame[]), "walk_up");
                animation.createState(CharacterOnMap.createAnimation("walk_right", [spriteFrames[7], spriteFrames[6], spriteFrames[5], spriteFrames[6]].filter(s => s !== null) as SpriteFrame[]), "walk_right");
                animation.createState(CharacterOnMap.createAnimation("walk_down", [spriteFrames[10], spriteFrames[9], spriteFrames[8], spriteFrames[9]].filter(s => s !== null) as SpriteFrame[]), "walk_down");
                animation.createState(CharacterOnMap.createAnimation("walk_left", [spriteFrames[3], spriteFrames[2], spriteFrames[11], spriteFrames[2]].filter(s => s !== null) as SpriteFrame[]), "walk_left");

                resolve(animation);
            });
        });

        return this.animationSetUpPromise;
    }

    private onKeyDown(event?: EventKeyboard) {
        this.keyDown = true;

        if (this.tweening) {
            this.delayedKeyDownEvent = event || null;
            return;
        }

        if (!event) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.ARROW_UP:
                this.playAnimation("walk_up");
                this.moveBy(new Vec3(0, this.size?.y || 0, 0));

                break;
            case KeyCode.ARROW_RIGHT:
                this.playAnimation("walk_right");
                this.moveBy(new Vec3(this.size?.x || 0, 0, 0));
                
                break;
            case KeyCode.ARROW_DOWN:
                this.playAnimation("walk_down");
                this.moveBy(new Vec3(0, -(this.size?.y || 0), 0));
                
                break;
            case KeyCode.ARROW_LEFT:
                this.playAnimation("walk_left");
                this.moveBy(new Vec3(-(this.size?.x || 0), 0, 0));
                
                break;
        }
    };

    private onKeyUp(event?: EventKeyboard) {
        this.keyDown = false;

        if (this.tweening) {
            this.delayedKeyUpEvent = event || null;
            return;
        }

        if (!event) {
            return;
        }

        switch(event.keyCode) {
            case KeyCode.ARROW_UP:
                this.playAnimation("stand_back");

                break;
            case KeyCode.ARROW_RIGHT:
                this.playAnimation("stand_right");
                
                break;
            case KeyCode.ARROW_DOWN:
                this.playAnimation("stand");
                
                break;
            case KeyCode.ARROW_LEFT:
                this.playAnimation("stand_left");
                
                break;
        }
    }

    private moveBy(direction: Vec3) {
        if (this.onMoveByCallback) {
            this.tweening = true;

            this.onMoveByCallback(this.node, direction, (success) => {
                this.tweening = false;

                const delayedKeyDownEvent  = this.delayedKeyDownEvent;
                const delayedKeyUpEvent  = this.delayedKeyUpEvent;

                this.delayedKeyDownEvent = null;
                this.delayedKeyUpEvent = null;

                if (this.keyDown) {
                    if (delayedKeyDownEvent) {
                        return this.onKeyDown(delayedKeyDownEvent);
                    }

                    if (!success) {
                        return;
                    }

                    return this.moveBy(direction);
                }
                
                if (delayedKeyUpEvent) {
                    return this.onKeyUp(delayedKeyUpEvent);
                }
            });
        }
    }
}