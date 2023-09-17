export default interface IButton {
    content: string,
    icon?: string,
    iconPosition?: 'left'|'right',
    onClick: () => void|boolean,
    disabled?: () => boolean,
    loading?: () => boolean,
    class?: string,
    style?: string
}