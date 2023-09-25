import ILanguageConfig from "./ILanguageConfig";

interface IAppConfig {
    [key: string]: any,
    language?: ILanguageConfig,
    primevue?: {
        unstyled?: boolean,
        pt?: any,
        ripple?: boolean,
        inputStyle?: 'outline'|'filled',
        zIndex?: any,
        locale?: any
    }
}
export default IAppConfig;