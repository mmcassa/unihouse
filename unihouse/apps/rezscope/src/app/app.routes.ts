import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RoomAvailabilityPageComponent } from './pages/room-availability-page/room-availability-page.component';
import { ManageEnvironmentsPageComponent } from './pages/manage-environments-page/manage-environments-page.component';
import { StarRezSecurityUsersPageComponent } from './pages/access-management/tabs/security-users-page/security-users-page.component';
import { AccessManagementComponent } from './pages/access-management/access-management.component';
import { UsersListComponent } from './pages/access-management/tabs/users-list/users-list.component';
import { PositionsListComponent } from './pages/access-management/tabs/positions-list/positions-list.component';
import { MsalGuard } from '@azure/msal-angular';
import { SecUserHistoryPageComponent } from './pages/access-management/tabs/sec-user-history-page/sec-user-history-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { CleanUpPageComponent } from './pages/clean-up-page/clean-up-page.component';
import { ScheduledChangesPageComponent } from './pages/access-management/tabs/scheduled-changes-page/scheduled-changes-page.component';
import { GeneralCleanUpPageComponent } from './pages/clean-up-page/tabs/general-clean-up-page/general-clean-up-page.component';

/**
 * Authentication Configuration
 */
const authenticated_guards: any[] = [MsalGuard];
const unauthenticated_guards: any[] = [];

export const routes: Routes = [
    {path:'home', 
        component: HomePageComponent,
        title:'Home',
        data: {
            breadcrumb: 'Home'
        },
        canActivate: authenticated_guards
        
    },
    {path:'room-availability', 
        component: RoomAvailabilityPageComponent,
        title:'Room Availability',
        data: {
            breadcrumb: 'Room Availability'
        },
    },
    {path:'clean-up', 
        component: CleanUpPageComponent,
        title:'Clean Up',
        data: {
            breadcrumb: 'Clean Up'
        },
        canActivate: authenticated_guards
        , children: [
            {
                path:'general',
                component: GeneralCleanUpPageComponent,
                title: 'Clean Up - General',
                data: {
                    breadcrumb: 'General'
                }
            }
        ]
    },
    {
        path:'access-manager', 
        component: AccessManagementComponent,
        title:'Employee Access Manager',
        data: {
            breadcrumb: 'Access Manager',
        },
        canActivate: authenticated_guards
        , children: [
            {
                path:'positions',
                component: PositionsListComponent,
                title: 'Positions',
                data: {
                    breadcrumb: 'Positions'
                }
            },{
                path:'users',
                component: UsersListComponent,
                title: 'Users',
                data: {
                    breadcrumb: 'Users'
                }
            },{
                path:'setup', 
                component: StarRezSecurityUsersPageComponent,
                title:'Access Manager Setup',
                data: {
                    breadcrumb: 'Setup'
                },
                canActivate: authenticated_guards
            },{
                path:'scheduled-changes',
                component: ScheduledChangesPageComponent,
                title: 'Scheduled Changes',
                data: {
                    breadcrumb: 'Schedule'
                }
            },{
                path:'history',
                component: SecUserHistoryPageComponent,
                title: 'History',
                data: {
                    breadcrumb: 'History'
                }
            },
        ]
    },
    {
        path:'settings', 
        component: SettingsPageComponent,
        title:'Settings',
        data: {
            breadcrumb: 'Settings',
        },
        canActivate: authenticated_guards
        , children: [
            {
                path:'environments',
                component: ManageEnvironmentsPageComponent,
                title: 'Environments',
                data: {
                    breadcrumb: 'Environments'
                }
            }
        ]
    }
    
];
