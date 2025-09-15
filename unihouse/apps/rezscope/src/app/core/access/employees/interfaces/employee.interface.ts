  
export interface EmployeeInterface {
  id: number;
  secuserid?: number;
  username: string;
  is_normal: boolean;
  fullname: string;
  description: string;
  positionid?: number;
//   position?: EmploymentPosition;
  position_confirmed: boolean;
  is_test_user: boolean;
}

export interface EmployeePositionHistory {
  id: number;
  startdate: Date;
  enddate: Date | null;
  endreason: string | null;
  employeeid: number;
  position: number;
}

// export class Employee implements EmployeeInterface {
//   id?: number;
//   secuserid?: number;
//   username?: string;
//   is_normal: boolean;
//   fullname?: string;
//   description?: string;
//   positionid?: number;
//   position_confirmed: boolean;
//   is_test_user: boolean;

//   private accessService = inject(StarrezAccessService);

//   constructor(data: Partial<EmployeeInterface> = {}) {
//     this.id = data.id;
//     this.secuserid = data.secuserid;
//     this.username = data.username;
//     this.is_normal = data.is_normal ?? false;
//     this.fullname = data.fullname;
//     this.description = data.description;
//     this.positionid = data.positionid;
//     // this._position = data.position ?? undefined;
//     this.position_confirmed = data.position_confirmed ?? false;
//     this.is_test_user = data.is_test_user ?? false;
//   }

// }