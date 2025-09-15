import { Component, inject } from '@angular/core';
import { ManageEnvironmentCollectionsComponent } from '../manage-environment-collections/manage-environment-collections.component';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { ExtEnvironmentService } from '../../ext-environment.service';
import { TuiNavigation } from '@taiga-ui/layout';
import { DialogService } from '../../../dialogs';
import { Collection } from '../../interfaces/environment-interface';

interface CollectionSelection extends Collection {
  active?: boolean;
}
@Component({
  selector: 'app-environment-collection-dropdown',
  standalone: true,
  imports: [
		TuiDataList,
		TuiDropdown,
		TuiNavigation,
    TuiAppearance,
		TuiIcon,
		TuiButton
  ],
  templateUrl: './environment-collection-dropdown.component.html',
  styleUrl: './environment-collection-dropdown.component.scss'
})
export class EnvironmentCollectionDropdownComponent {
  private readonly dialogs = inject(DialogService);
  protected readonly envservice = inject(ExtEnvironmentService);

  // List of existing StarRez environments 
  activeEnvironment: string = '';
  environmentsList: CollectionSelection[] = [  ];

  constructor() {
  this.envservice.getCollections().subscribe({
      next: objs => {
        this.environmentsList = objs;
      }
    })
  }

  protected set_active_env(name: string) {
    this.activeEnvironment = name;
  }

  protected openCollectionsManager() {
    this.dialogs.openDialog(ManageEnvironmentCollectionsComponent).subscribe();
  }
}
