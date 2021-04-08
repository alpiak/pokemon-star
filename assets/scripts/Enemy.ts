import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    afterAppear() {
        this.node.emit("afterAppear", this.node);
    }
}
