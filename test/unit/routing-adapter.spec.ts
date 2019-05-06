import {expect} from 'chai';
import {RoutingAdapter} from "../../src/routing-adapter";
import {RoutingRegionBehavior} from "../../src/routing-region-behavior";
import createMockStore from "redux-mock-store";
describe('Given an instance of RoutingAdapter', () =>{
    it('should return RoutingRegionBehavior in behaviors property', () =>{
        let store: any = createMockStore([])();
       let adapter = new RoutingAdapter(<any>{}, <any>{}, store, null);
       expect(adapter.behaviors.some(x => x.constructor === RoutingRegionBehavior)).true;
    });
    describe('and a view is added', () =>{

    })
});