import config from "../../config/config";

import en_US from "../../i18n/en-US";
import en from "../../i18n/en";
import ja_JP from "../../i18n/ja-JP";
import zh_CN from "../../i18n/zh-CN";
import zh from '../../i18n/zh';

export default class I18n {
    private lang: string = "en";

    constructor (lang = config.language) {
        this.lang = lang;
    }
    
    public getText(key: string, lang = this.lang) {
        const dict: any = this.getDict(lang);

        return dict[key];
    }

    private getDict(lang = this.lang) {
        switch (lang) {
            case "en-US":
                return en_US;
                
            case "en":
                return en;

            case "ja-JP":
                return ja_JP;
            
            case "zh-CN":
                return zh_CN;

            case "zh":
                return zh;
        }
    }
}
