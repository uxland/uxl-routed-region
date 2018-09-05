import {RouterRegionDefinition} from "./router-region-decorator";
import {IRegionHost} from "@uxland/uxl-regions/region";
import {RoutingAdapter} from "./routing-adapter";
import {Router} from "@uxland/uxl-routing/router";
import {Store} from 'redux';
export const routingAdapterFactoryFactory = (router: Router, store: Store<any, any>) =>
    (definition: RouterRegionDefinition, host: Element & IRegionHost) =>
        new RoutingAdapter(host, router, store, definition);