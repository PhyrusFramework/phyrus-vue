interface IAppConfig {
    [key: string]: any,
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