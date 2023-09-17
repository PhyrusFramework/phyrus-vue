import IAppConfig from "../interfaces/IAppConfig";
import ILanguageConfig from "../interfaces/ILanguageConfig";
import utils from "./utils";

export default class Config {

    private static _config : IAppConfig;
    public static values() : any { return Config._config ? Config._config.config : {} }
    public static layouts() : any { return Config._config && Config._config.layouts ? Config._config.layouts : {} }
    public static languageConfig() : ILanguageConfig {
        const c = Config._config.language;
        return c ? c : {
            default: 'en'
        }
    }

    static init(config: IAppConfig) {
        Config._config = config;
    }

    public static get(key: string) : any {
        return utils.dotNotation(Config.values(), key);
    }
}