import { GenericFiltersInterface } from "@unihouse/core";


export enum ScheduledChangeTypeEnum {
    "New Hire" = 1,
    "Separation" = 2,
    "Transfer" = 3,
    "Unspecified" = 0
}

export interface ScheduledChangesFiltersInterface extends GenericFiltersInterface {
    overdue?: boolean;
    employmentchangetypeenum?: number;
    changedate_range_after?: Date;
    changedate_range_before?: Date;
    

}