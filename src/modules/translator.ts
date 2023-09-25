import Utils from './utils';
import { locales as def } from './locales/locales';
import Config from './config';
import PackageState from './PackageState';

class Translator {

    initialize(locales: any) {

        let obj = PackageState.get('translations');
        if (obj) return;

        obj = {
            cache: {}
        }

        let defaultLanguage = Config.get('language.default');
        if (!defaultLanguage) {
            defaultLanguage = 'en';
        }

        Object.keys(locales).forEach((lang: string) => {
            if (!def[lang]) return;
            locales[lang] = Utils.merge(def[lang], locales[lang]);
        });

        obj['locales'] = locales;

        const userLang = navigator.language.substr(0, 2);
        obj['currentLanguage'] = (Object.keys(locales)).includes(userLang) ?
            userLang : defaultLanguage;

        obj['translations'] = locales[obj['currentLanguage']];

        PackageState.set('translations', obj);
    }

    get supportedLanguages() : string[] {
        const obj = PackageState.get('translations');
        if (!obj) return [Config.get('language.default')];
        return Object.keys(obj.translations);
    }

    changeLanguage(language: string) {
        const obj = PackageState.get('translations');
        if (!obj) return;

        if (!(Object.keys(obj.locales)).includes(language)) return;
        obj.cache = {};
        obj.currentLanguage = language;
        obj.translations = obj.locales[obj.currentLanguage];
    }

    get(key: string, parameters?: any) : string {
        const obj = PackageState.get('translations');
        if (!obj) return '';

        let trans = 
        obj.cache[key] ? obj.cache[key] :
        Utils.dotNotation(obj.translations, key);

        obj.cache[key] = trans;

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