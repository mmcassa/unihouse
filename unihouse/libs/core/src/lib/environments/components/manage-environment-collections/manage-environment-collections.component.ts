import { Component, inject } from '@angular/core';
import { ExtEnvironmentService } from '../../ext-environment.service';
import { TuiButton, TuiHint } from '@taiga-ui/core';
import { TuiButtonClose } from '@taiga-ui/kit';
import { TuiTable } from '@taiga-ui/addon-table';
import { AddCollectionFormComponent } from '../add-collection-form/add-collection-form.component';
import { CollectionEnvironmentListComponent } from '../collection-environment-list/collection-environment-list.component';
import { DialogService } from '../../../dialogs';
import { Collection } from '../../interfaces/environment-interface';

@Component({
  selector: 'app-manage-environment-collections',
  standalone: true,
  imports: [
    TuiButton,
    TuiButtonClose,
    TuiTable,
    TuiHint,
    AddCollectionFormComponent,
    CollectionEnvironmentListComponent
  ],
  templateUrl: './manage-environment-collections.component.html',
  styleUrl: './manage-environment-collections.component.scss'
})
export class ManageEnvironmentCollectionsComponent {
  protected readonly envservice = inject(ExtEnvironmentService);
  protected readonly dialogs = inject(DialogService);
  protected collections: Collection[] = [];
  protected loading_collections: boolean = false;
  protected adding_collection: boolean = false;
  protected editting: boolean = false;
  
  constructor() {
    // Load collections on construction
    this.loading_collections = true;
    this.envservice.getCollections().subscribe({
      next: objs => {
        this.loading_collections = false;
        this.collections = objs;
      } 
    });
  }

  protected push_new_collection(collection: Collection|void) {
    if (collection == null ) return;
    this.collections.push(collection);
    this.adding_collection = false;
  }

  protected delete_collection(collection: Collection) {
    this.dialogs.openApproveDialog('Delete session',{
      details: `Are you sure you would like to delete ${collection.name} collection?`
    }).subscribe({
      next: (approved: boolean|undefined) => {
        if (approved) {
          this.envservice.delCollection(collection.id).subscribe({
            next: res => {
              this.collections.splice(this.collections.indexOf(collection),1);
            }
          });
        }
      }
    })
    
  }
}
