import {
    IRegion,
    IRegionBehavior,
    IRegionHost,
    SelectableAdapter,
    ViewComponent,
    ViewDefinition
} from "@uxland/uxl-regions";
import {Handler, Router} from "@uxland/uxl-routing";
import {RoutingRegionBehavior} from "./routing-region-behavior";
import {Store} from "redux";
import {RouterRegionDefinition} from "./router-region-decorator";

export interface RoutedViewDefinition extends ViewDefinition{
    route: string;
}
export const getParentRoutedRegion: (element: any) => IRegion = element => {
    if(!element.host && ! element.parentNode)
        return null;
    let host = element.host || element.parentNode.host || element.parentNode;
    if(host.uxlRegion){
        let region: IRegion = host.uxlRegion;
        if(region.adapter.constructor === RoutingAdapter)
            return region;
    }
    return getParentRoutedRegion(host);
};
export const getFullRoute = (host: any, regionDefinition: RouterRegionDefinition, trailerRoute?: string) =>{
    let routes = [regionDefinition.route];
    if(trailerRoute)
        routes.push(trailerRoute);
    let current = regionDefinition.route;
    while (current != '') {
        let parent = getParentRoutedRegion(host);
        if(parent)
            current = (parent.adapter as RoutingAdapter).regionDefinition.route;
        else current = '';
        routes.unshift(current);
    }
    return routes.join('/');

};
class RoutedViewHandler implements Handler{
    public view: HTMLElement & ViewComponent & Handler;

    canNavigateFrom (url: string, params?: any, query?: string) : boolean | Promise<boolean>{
        if(this.view && this.view.canNavigateFrom)
            return this.view.canNavigateFrom(url, params, query);
        return true;
    }
    navigatedFrom(url: string, params?: any, query?: string): boolean{
        if(this.view && this.view.navigatedFrom)
            return this.view.navigatedFrom(url, params, query);
        return true;
    }
}
export class RoutingAdapter extends SelectableAdapter{
    constructor(host: IRegionHost & Element, protected router: Router, protected store: Store<any, any>, public regionDefinition: RouterRegionDefinition){
        super(host);
    }
    private handlers = new WeakMap<ViewDefinition, RoutedViewHandler>();
    get behaviors(): IRegionBehavior[]{
        return [...super.behaviors, new RoutingRegionBehavior(this.host, this.router, this.store, this.regionDefinition)]
    }
    viewAdded(view: RoutedViewDefinition){
        let p = super.viewAdded(view);
        let handler = new RoutedViewHandler();
        this.handlers.set(view, handler);
        this.router.register({route: getFullRoute(this.host, this.regionDefinition, view.route), handler});
        return p;
    }
    activateView(view: HTMLElement & ViewComponent){
        let handler = this.handlers.get(view.view);
        if(handler && !handler.view)
            handler.view = view;
        super.activateView(view);
    }
}
