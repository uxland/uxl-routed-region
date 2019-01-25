import {IRegionBehavior} from '@uxland/uxl-regions';
import {Store} from 'redux';
import {Router} from "@uxland/uxl-routing/router";
import {IRegionHost} from "@uxland/uxl-regions/region";
import {RouterRegionDefinition} from "./router-region-decorator";
import {routingSelectors} from '@uxland/uxl-routing/selectors';
import {bind, unbind} from "@uxland/uxl-redux/redux-binding";
import {collect} from '@uxland/uxl-utilities/collect'
import {isRouteActive} from "@uxland/uxl-routing/is-route-active";
import {findMatchingRoutes} from "@uxland/uxl-routing/helpers/find-matching-routes";
import {Route} from '@uxland/uxl-routing/reducer';
import {getFullRoute, RoutedViewDefinition} from "./routing-adapter";
import {computePage} from '@uxland/uxl-routing/compute-page';
import {statePath} from '@uxland/uxl-redux/state-path';

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

    }
    private fullRoute: string;

    attach(): void {
        this.fullRoute = getFullRoute(this.host, this.definition);
        bind(this, collect(this.constructor, 'properties'), this.store);
        if(!this.definition.route || this.definition.route === '/')
            this.router.register({route: '/'})
    }

    detach(): void {
        unbind(this);
    }

    @statePath(routingSelectors.routeSelector)
    route: any;

    requestUpdate(){
        let routeActive = isRouteActive(this.route, this.fullRoute);
        if(routeActive){
            let activeView = getActiveView(this.route, this.fullRoute, true, this.host.uxlRegion.currentViews as RoutedViewDefinition[]);
            let page = activeView ? this.host.uxlRegion.getKey(activeView) :
                computePage(this.route, this.definition.defaultPage, routeActive, this.fullRoute) || this.definition.defaultPage;
            if(page)
                this.host.uxlRegion.activate(page);
            else
                this.host.uxlRegion.deactivate(this.host.uxlRegion.currentActiveViews[0])
        }
    }

}
