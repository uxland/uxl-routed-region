import {expect} from 'chai';
import {RoutingAdapter} from "../../src/routing-adapter";
import {RoutingRegionBehavior} from "../../src/routing-region-behavior";
describe('Given an instance of RoutingAdapter', () =>{
    it('should return RoutingRegionBehavior in behaviors property', () =>{
       let adapter = new RoutingAdapter(<any>{}, <any>{}, null, null);
       expect(adapter.behaviors.some(x => x.constructor === RoutingRegionBehavior)).true;
    });
    describe('and a view is added', () =>{

    })
})