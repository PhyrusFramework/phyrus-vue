import Utils from './utils';
import { locales as def } from './locales/locales';
import Config from './config';

class Translator {

    locales: any;
    currentLanguage = 'en';
    translations : any = {}

    cache: any = {}

    initialize(locales: any) {

        let defaultLanguage = Config.get('language.default');
        if (!defaultLanguage) {
            defaultLanguage = 'en';
        }

        Object.keys(locales).forEach((lang: string) => {
            if (!def[lang]) return;
            locales[lang] = Utils.merge(def[lang], locales[lang]);
        });
        this.locales = locales;

        const userLang = navigator.language.substr(0, 2);
        this.currentLanguage = (Object.keys(locales)).includes(userLang) ?
            userLang : defaultLanguage;

        this.translations = locales[this.currentLanguage];
    }

    get supportedLanguages() : string[] {
        return Object.keys(this.translations);
    }

    changeLanguage(language: string) {
        if (!(Object.keys(this.locales)).includes(language)) return;
        this.cache = {};
        this.currentLanguage = language;
        this.translations = this.locales[this.currentLanguage];
    }

    get(key: string, parameters?: any) {
        let trans = 
        this.cache[key] ? this.cache[key] :
        Utils.dotNotation(this.translations, key);

        this.cache[key] = trans;

        if (parameters) {
            Object.keys(parameters).forEach((k: string) => {
                trans = trans.replace('{{' + k + '}}', parameters[k]);
            });
        }

        return trans;
    }

}
const translate = new Translator();
export default translate;