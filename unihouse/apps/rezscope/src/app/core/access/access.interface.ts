import { EmployeeInterface } from "./employees/employee";
import { EmploymentPositionInterface } from "./positions/position.interface";

export interface SecurityUserGroup {
  id: number;
  secgroupid: number;
  extenvid: any;
  name: string;
  details: string;
}

export interface SecurityUserGroupCompare extends SecurityUserGroup {
  exists_on_merge: boolean;
  apply_change?: boolean;

}


export interface Community {
  name: string;
  code?: string;
  description: string;
}


export interface ScheduledPositionChangeInterface {
  id: number;
  username?: string;
  fullname?: string;
  employee?: EmployeeInterface;
  positionname?: string;
  position?: EmploymentPositionInterface | number;
  communityname?: string;
  community?: Community;
  term?: any;
  typename?: string;
  employmentchangetypeenum?: number | string;
  actiondatestart?: Date | string;
  actiondateend?: Date;
  status?: number | string;
  datedetected?: Date;
  datecreated: Date;
}