import { _decorator, Animation, Component, director, game, ImageAsset, Node, resources, Sprite, SpriteFrame, TextAsset, TiledMap, UIStaticBatch, UITransform, Vec3, Rect } from 'cc';
const { ccclass, property } = _decorator;

import Context from './Context';
import Gender from './libraries/Gender';
// import RPGUltimate from "rpg-ultimate";

@ccclass("OutdoorCanvas")
export class OutdoorCanvas extends Component {
    @property(Node)
    private contextNode!: Node;
    // private director: RPGUltimate.Director;

    public start() {
        this.initContext(this.contextNode);
        // this.init();
        
        // this.enterBattle();
    }

    private initContext(contextNode: Node) {
        game.addPersistRootNode(contextNode);

        const context = this.contextNode.getComponent(Context);

        if (!context) {
            throw Error("No context.");
        }

        context.player = context.getPlayer("lucas", Gender.Male, [context.getPokemon(25, Gender.Female, 1)]);
    }

    private async init() {
        // const tiledMapData: string = await new Promise<string>((resolve, reject) => {
        //     resources.load(["maps/first_town"], TextAsset, (err, textAsset) => {
        //         if (err) {
        //             reject(err);
        //         }

        //         resolve(textAsset[0].text);
        //     });
        // });

        // await this.director.loadTiledMapData(tiledMapData);

        // this.initMap();
    }

    // private initMap() {
    //     // const tiledMap = this.director?.tiledMap;
    //     const tileWidth = tiledMap?.tileWidth;
    //     const halfTileWidth = tileWidth / 2;
    //     const tileHeight = tiledMap?.tileHeight;
    //     const halfTileHeight = tileHeight / 2;
    //     const canvasWidth = tileWidth * tiledMap.width;
    //     const canvasHeight = tileHeight * tiledMap.height;
    //     const tilesNode = this.node?.getChildByPath("tiles");
    //     const tilesNodeUITransform = tilesNode?.getComponent(UITransform);

    //     tilesNodeUITransform && (tilesNodeUITransform.width = canvasWidth);
    //     tilesNodeUITransform && (tilesNodeUITransform.height = canvasHeight);
            
    //     resources.load(["textures/pokemons/25_player"], ImageAsset, (err: Error | null, imageAssets: ImageAsset[] | null | undefined) => {
    //         if (err) {
    //             throw err;
    //         }

    //         if (imageAssets && imageAssets[0]) {
    //             const imageAsset = imageAssets[0];

    //             this.director.getTileLayers().forEach(({ name, height, width, tiles }) => {
    //                 const layerPixelWidth = tileWidth * width;
    //                 const layerPixelHeight = tileHeight * height;
    //                 const xCoordStart = layerPixelWidth / 2 * -1;
    //                 const yCoordStart = layerPixelHeight / 2 * -1;

    //                 tiles.forEach((value, i) => {
    //                     const node = new Node(name + i);

    //                     const width = tiledMap.width;

    //                     if (!node) {
    //                         return;
    //                     }

    //                     const x = i % width;
    //                     const y = Math.floor(i / width);
    //                     const textureX = value / width;
    //                     const textureY = Math.floor(value / width);

    //                     node.setPosition(new Vec3(xCoordStart + x * tileWidth + halfTileWidth, yCoordStart + y * tileHeight + halfTileHeight, 0));
                        
    //                     const sprite = node.addComponent(Sprite);
        
    //                     sprite.type = Sprite.Type.TILED;

    //                     const spriteFrame = SpriteFrame.createWithImage(imageAsset);

    //                     spriteFrame.rect = new Rect(textureX * tileWidth, textureY * tileHeight, tileWidth, tileHeight);
    //                     sprite.spriteFrame = spriteFrame;

    //                     const uiTransform = node?.getComponent(UITransform);
                
    //                     uiTransform && (uiTransform.width = tileWidth);
    //                     uiTransform && (uiTransform.height = tileHeight);
    //                     tilesNode?.addChild(node);
    //                 });
    //             });
    //         }

    //         tilesNode?.getComponent(UIStaticBatch)?.markAsDirty();
    //     });
    // }
    
    // private async enterBattle() {
    //     const context = this.contextNode.getComponent(Context);

    //     if (!context) {
    //         throw Error("No context.");
    //     }

    //     context.enemyPokemon = context.getPokemon(483, Gender.Female, 1);
    //     director.preloadScene("battle");
    //     await this.fadeOut();
    //     director.loadScene("battle");
    // }

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
