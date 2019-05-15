import {RouterRegionDefinition} from "./router-region-decorator";
import {IRegionHost, DynamicFactory} from "@uxland/uxl-regions";
import {RoutingAdapter} from "./routing-adapter";
import {Router} from "@uxland/uxl-routing";
import {Store} from 'redux';

export const routingAdapterFactoryFactory = (router: Router, store: Store<any, any>) =>
    (definition: RouterRegionDefinition, host: Element & IRegionHost) =>
        new RoutingAdapter(host, router, store, definition);

export const routingAdapterFactory: (router: Router, store: Store<any, any>) => DynamicFactory = (router, store) =>{
    const adapterFactory = routingAdapterFactoryFactory(router, store);
    return host => host['router-region'] ? adapterFactory : undefined;
};