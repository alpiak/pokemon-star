import { _decorator, Animation, Camera, Color, Component, Node, Sprite, SpriteFrame, RenderTexture, UITransform, director, game, renderer, view } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';
import Gender from './libraries/Gender';

@ccclass('OutdoorCanvas1')
export class OutdoorCanvas1 extends Component {
    @property(Node)
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
    
    private async enterBattle() {
        const context = this.contextNode.getComponent(Context);

        if (!context) {
            throw Error("No context.");
        }

        context.enemyPokemon = context.getPokemon(483, Gender.Female, 1);
        director.preloadScene("battle");
        await this.fadeOut();
        director.loadScene("battle");
    }

    private async fadeOut() {
        const maskNode = this.node.getChildByPath("mask");
        const sprite = maskNode?.getComponent(Sprite);

        if (!sprite) {
            return;
        }

        const node = new Node();
        
        director.getScene()?.addChild(node);
        node.layer = this.node.layer;
        
        // const camera = node.addComponent(Camera);
        
        // camera.projection = renderer.scene.CameraProjection.ORTHO;
        // camera.clearColor = Color.GRAY;
        // camera.visibility = 4294967295;

        // const renderTexture = new RenderTexture();

        // renderTexture.reset({
        //     width: (maskNode || this.node).getComponent(UITransform)?.width || 960,
        //     height: (maskNode || this.node).getComponent(UITransform)?.height || 640,
        //     colorFormat: RenderTexture.PixelFormat.RGBA8888,
        //     depthStencilFormat: RenderTexture.DepthStencilFormat.DEPTH_24_STENCIL_8
        // });

        // const spriteFrame = new SpriteFrame();
        
        // spriteFrame.reset({
        //     originalSize: sprite.spriteFrame?.originalSize,
        //     rect: sprite.spriteFrame?.rect,
        //     offset: sprite.spriteFrame?.offset,
        //     isRotate: sprite.spriteFrame?.isRotated(),
        //     borderTop: sprite.spriteFrame?.insetTop,
        //     borderLeft: sprite.spriteFrame?.insetLeft,
        //     borderBottom: sprite.spriteFrame?.insetBottom,
        //     borderRight: sprite.spriteFrame?.insetRight,
        // });

        // camera.targetTexture = renderTexture;

        // await new Promise((r) => setTimeout(r, 0));

        // spriteFrame.texture = renderTexture;
        // sprite.spriteFrame = spriteFrame;
        sprite.spriteFrame = this.node.getChildByPath("background")?.getComponent(Sprite)?.spriteFrame || null; // TODO: remove

        const animation = this.node.getChildByPath("mask")?.getComponent(Animation);

        animation?.play("sceneFadeOut");
        
        await new Promise((r) => setTimeout(r, (animation?.clips?.filter((clip) => clip?.name === "sceneFadeOut")[0]?.duration || 0) * 1000));
        
        // camera?.destroy();
    }
}
