import { InjectionToken, Type } from "@angular/core";

export const DRAWER_REGISTRY_TOKEN = new InjectionToken<Record<string, Type<any>>>('Populate this with string keys and Component values to register components with the drawer service')

// export const DrawerRegistry: Record<string, Type<any>> = {
//   employee: EmployeeDetailComponent,
//   position: PositionDetailComponent
// }