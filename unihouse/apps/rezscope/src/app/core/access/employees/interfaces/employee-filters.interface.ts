import { GenericFiltersInterface } from "@unihouse/core";


export interface EmployeeFiltersInterface extends GenericFiltersInterface {
  _all?: boolean;
  fullname?: string;
  positionid?: number | number[];
  community?: number | number[];
}