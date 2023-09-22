import IRoute from "./IRoute";

export default interface IRouter {
    layouts?: any,
    routes: IRoute[],
}