import { _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("EventEmitter")
export class EventEmitter extends Component {
    afterAppear() {
        this.node.emit("afterAppear", this.node);
    }
}
