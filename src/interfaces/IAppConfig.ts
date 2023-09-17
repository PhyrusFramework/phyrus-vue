import ILanguageConfig from "./ILanguageConfig";
import IRoute from "./IRoute";

export default interface IAppConfig {
    config?: any,
    language?: ILanguageConfig,
    layouts?: any,
    routes: IRoute[],
    primevue?: {
        unstyled?: boolean,
        pt?: any,
        ripple?: boolean,
        inputStyle?: 'outline'|'filled',
        zIndex?: any,
        locale?: any
    }
}