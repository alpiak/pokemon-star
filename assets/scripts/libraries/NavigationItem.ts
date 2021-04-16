import { Node } from "cc";

export default class menuItem {
    public readonly uiNode?: Node;
    public top?: menuItem;
    public right?: menuItem;
    public bottom?: menuItem;
    public left?: menuItem;

    constructor(uiNode?: Node) {
        this.uiNode = uiNode;
    }
}