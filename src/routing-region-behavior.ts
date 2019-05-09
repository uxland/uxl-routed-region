import {IRegionBehavior} from '@uxland/uxl-regions';
import {Store} from 'redux';
import {Router} from "@uxland/uxl-routing";
import {IRegionHost} from "@uxland/uxl-regions";
import {RouterRegionDefinition} from "./router-region-decorator";
import {routingSelectors} from '@uxland/uxl-routing';
import {isRouteActive} from "@uxland/uxl-routing";
import {findMatchingRoutes} from "@uxland/uxl-routing";
import {Route} from '@uxland/uxl-routing';
import {getFullRoute, RoutedViewDefinition} from "./routing-adapter";
import {computePage} from '@uxland/uxl-routing';
import {unbind, bind, watch, PropertyWatch, getWatchedProperties} from "@uxland/lit-redux-connect";

const getActiveView: (currentRoute: Route, defaultPage: string, isRouteActive: boolean, availableViews: RoutedViewDefinition[]) => RoutedViewDefinition = (currentRoute, defaultPage, isRouteActive, availableViews) => {
    if(isRouteActive && currentRoute){
        let matching = findMatchingRoutes(currentRoute.href, availableViews.map(v => ({route: defaultPage + '/' + v.route, view: v})));
        if(matching.length){
            return matching[0].route.view as RoutedViewDefinition;
        }
    }
    return null;
};

export class RoutingRegionBehavior implements IRegionBehavior{
    constructor(private host: IRegionHost & Element, private router: Router, private store: Store<any,any>, private definition: RouterRegionDefinition){
        let properties: {[key: string]: PropertyWatch} = getWatchedProperties(RoutingRegionBehavior.prototype);
        Object.values(properties)
            .filter(x => x.store === null || x.store === undefined)
            .forEach(x => x.store = store);
        bind(<any>this);
    }


    private fullRoute: string;

    attach(): void {
        this.fullRoute = getFullRoute(this.host, this.definition);
        if(!this.definition.route || this.definition.route === '/')
            this.router.register({route: '/'})
    }

    detach(): void {
        unbind(this);
    }

    @watch(routingSelectors.routingSelector)
    route: any;
    requestUpdate(){
        let routeActive = isRouteActive(this.route, this.fullRoute);
        if(routeActive){
            let activeView = getActiveView(this.route, this.fullRoute, true, this.host.uxlRegion.currentViews as RoutedViewDefinition[]);
            let page = activeView ? this.host.uxlRegion.getKey(<any>activeView) :
                computePage(this.route, this.definition.defaultPage, routeActive, this.fullRoute) || this.definition.defaultPage;
            if(page)
                this.host.uxlRegion.activate(page);
            else
                this.host.uxlRegion.deactivate(this.host.uxlRegion.currentActiveViews[0]);
        }
    }
}
