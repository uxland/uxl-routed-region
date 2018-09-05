import {region} from "@uxland/uxl-regions/region-decorator";
import {RegionDefinition} from "@uxland/uxl-regions";
export interface RouterRegionDefinition extends RegionDefinition{
    route: string;
    defaultPage?: string;
}
export const routerRegion = <T = any>(definition: RouterRegionDefinition) => region(definition);