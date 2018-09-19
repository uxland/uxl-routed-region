import {LitElement, html} from "@polymer/lit-element";
import {customElement} from '@uxland/uxl-polymer2-ts';
import '@polymer/iron-pages/iron-pages';
import {RegionHost} from "@uxland/uxl-regions/region-host-mixin";
import {region} from "@uxland/uxl-regions/region-decorator";
import {IRegion} from "@uxland/uxl-regions";
import * as uxlRedux from "@uxland/uxl-redux";
import {reducer, Route} from '@uxland/uxl-routing/reducer';
import {Router} from "@uxland/uxl-routing/router";
import {initializeLinkClickSupport} from '@uxland/uxl-routing/link-click-support';
import * as redux from 'redux';
import {regionAdapterRegistry} from "@uxland/uxl-regions/region-adapter-registry";
import {RoutingAdapter} from "../src/routing-adapter";
import {regionManager} from "@uxland/uxl-regions/region-manager";
import {IRoutingMixin, routingMixin} from '@uxland/uxl-routing/routing-mixin';
import {routingSelectors} from '@uxland/uxl-routing/selectors'
import {routingAdapterFactoryFactory} from "../src/routing-adapter-factory-factory";
import {routerRegion} from "../src/router-region-decorator";
import {actionNameBuilder} from "@uxland/uxl-redux/action-name-builder";
const store = redux.createStore(redux.combineReducers({routing: reducer}));
const Redux = uxlRedux.reduxMixin(store);
const Routing: <T, P>(p: any) => IRoutingMixin<LitElement, P> = routingMixin(Redux, routingSelectors);
const router = new Router(store.dispatch, document.baseURI, false);
initializeLinkClickSupport(router);
regionAdapterRegistry.registerAdapterFactory('iron-pages', routingAdapterFactoryFactory(router, store));

const viewFactory = (text: string) => () =>{
  let h1 = document.createElement('h1');
  h1.innerText = text;
  return <any>h1;
};

regionManager.registerViewWithRegion('router1', 'view1', {htmlTag: 'module-a', route: 'view1'} );
regionManager.registerViewWithRegion('router1', 'view2', {htmlTag: 'module-b', route: 'view2'} );

regionManager.registerViewWithRegion('router11', 'view1', {factory: viewFactory('view-1.1'), route: 'view1'} );
regionManager.registerViewWithRegion('router11', 'view2', {factory: viewFactory('view-1.2'), route: 'view2'} );

regionManager.registerViewWithRegion('router12', 'view1', {factory: viewFactory('view-2.1'), route: 'view1'} );
regionManager.registerViewWithRegion('router12', 'view2', {htmlTag: 'items-list', route: 'view2'} );

regionManager.registerViewWithRegion('router12', 'item-detail', {htmlTag: 'item-detail', route: 'view2/:id'})


@customElement('demo-app')
export class DemoApp extends RegionHost(Routing(LitElement)){
    subroute = '/';
    render(){
        return html `
            <div>
            <a href="view1">View1</a>
             <a href="view2">View2</a>
            </div>
            <iron-pages id="routed-region"></iron-pages>
        `
    }
    connectedCallback(){
        super.connectedCallback();
        console.log('connected callback invoked');
    }
    @routerRegion({name: 'router1', targetId: 'routed-region', route: ''})
    region: IRegion;
    routeChanged(current: Route, previous: Route){
        console.log('route changed')
    }
    isRouteActiveChanged(current: boolean, previous: boolean): void {
        console.log('active changed')
    }

    paramsChanged(current: Object, previous: object){

    }

    queryChanged(current: string, previous: string){

    }

    pageChanged(current: string, previous: string){

    }
}
@customElement('module-a')
export class ModuleA extends RegionHost(Routing(LitElement)){
    render(){
        return html `
            <h1>Module A</h1>
            <div>
             <a href="view1/view1">View1.1</a>
             <a href="view1/view2">View1.2</a>
</div>
           <iron-pages id="routed-region"></iron-pages>
        `
    }
    @routerRegion({name: 'router11', targetId: 'routed-region', route: 'view1'})
    region: IRegion;
    routeChanged(current: Route, previous: Route){
        console.log('route changed')
    }
    isRouteActiveChanged(current: boolean, previous: boolean): void {
        console.log('active changed')
    }

    paramsChanged(current: Object, previous: object){

    }

    queryChanged(current: string, previous: string){

    }

    pageChanged(current: string, previous: string){

    }

}
@customElement('module-b')
export class ModuleB extends RegionHost(Routing(LitElement)){
    render(){
        return html `
            <h1>Module B</h1>
            <div>
             <a href="view2/view1">View2.1</a>
             <a href="view2/view2">View2.2</a>
</div>
           <iron-pages id="routed-region" route="view2"></iron-pages>
        `
    }
    @routerRegion({name: 'router12', targetId: 'routed-region', route: 'view2'})
    region: IRegion;
    routeChanged(current: Route, previous: Route){
        console.log('route changed')
    }
    isRouteActiveChanged(current: boolean, previous: boolean): void {
        console.log('active changed')
    }

    paramsChanged(current: Object, previous: object){

    }

    queryChanged(current: string, previous: string){

    }

    pageChanged(current: string, previous: string){

    }
}
@customElement('items-list')
export class ItemsList extends LitElement{
    render(){
        return html `
        <ul>
            <li><a href="view2/view2/0001?desc=hello">Item1</a> </li>
            <li><a href="view2/view2/0002?desc=good">Item2</a> </li>
            <li><a href="view2/view2/0003?desc=bye">Item3</a> </li>
</ul>
        `
    }
}

interface Aux {
    id: string;
}

@customElement('item-detail')
export class ItemDetail extends Routing(LitElement){

    _render(props: IRoutingMixin<any, Aux>){
        return html `
        <div>
            <span>${props.params.id}</span>
            <h1>${props.query}</h1>
</div>
        `
    }
}
router.navigate(window.location.href).then(() =>{
    document.body.appendChild(document.createElement('demo-app'));
});
//document.body.appendChild(document.createElement('demo-app'));