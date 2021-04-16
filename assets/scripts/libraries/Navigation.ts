import { Node, systemEvent, SystemEventType, EventKeyboard, macro } from "cc";

import NavigationItem from "./NavigationItem";

export default class {
    private readonly menuItems: Array<NavigationItem>;
    private active: NavigationItem;
    private onKeyDown?: (event?: EventKeyboard) => void;

    constructor(menuItems: Array<NavigationItem>, active = 0) {
        this.menuItems = menuItems;
        this.active = this.menuItems[active];
    }

    public listenToKeyboard(onFocus: (item: NavigationItem) => void, onLeave: (item: NavigationItem) => void) {
        onFocus(this.active);

        this.onKeyDown = (event?: EventKeyboard) => {
            if (!event) {
                return;
            }

            switch(event.keyCode) {
                case macro.KEY.up:
                    onLeave(this.active);
                    this.setActive(this.active.top);
                    onFocus(this.active);

                    break;
                case macro.KEY.right:
                    onLeave(this.active);
                    this.setActive(this.active.right);
                    onFocus(this.active);
                    
                    break;
                case macro.KEY.down:
                    onLeave(this.active);
                    this.setActive(this.active.bottom);
                    onFocus(this.active);
                    
                    break;
                case macro.KEY.left:
                    onLeave(this.active);
                    this.setActive(this.active.left);
                    onFocus(this.active);
                    
                    break;
            }
        };

        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    }

    public listenToMouse(onFocus: (item: NavigationItem) => void, onLeave: (item: NavigationItem) => void) {
        this.menuItems.forEach((menuItem: NavigationItem) => {
            menuItem.uiNode?.on(Node.EventType.MOUSE_UP, () => {
                onLeave(this.active);
                this.setActive(menuItem);
                onFocus(this.active);
            }, this);
        });
    }
    
    public listenToTouch(onFocus: (item: NavigationItem) => void, onLeave: (item: NavigationItem) => void) {
        this.menuItems.forEach((menuItem: NavigationItem) => {
            menuItem.uiNode?.on(Node.EventType.TOUCH_END, () => {
                onLeave(this.active);
                this.setActive(menuItem);
                onFocus(this.active);
            }, this);
        });
    }

    public destroy() {
        if (this.onKeyDown) {
            systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        }
        
        this.menuItems.forEach((menuItem: NavigationItem) => {
            menuItem.uiNode?.off(Node.EventType.MOUSE_DOWN);
        });
    }

    private setActive(menuItem?: NavigationItem) {
        if (!menuItem) {
            return;
        }

        
        this.active = menuItem;
    }
}