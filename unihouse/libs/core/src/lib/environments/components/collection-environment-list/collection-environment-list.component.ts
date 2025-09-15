import { Component, inject, input, OnInit } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { ExtEnvironmentService } from '../../ext-environment.service';
import { TuiButton, TuiLoader, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { ExternalEnvironment, ExternalEnvironmentType } from '../../interfaces/environment-interface';

interface EnvironmentsMap {
  type_id: number;
  type_name: string;
  current_environment: ExternalEnvironment | undefined;
  environment_options: ExternalEnvironment[];
}

@Component({
  selector: 'app-collection-environment-list',
  standalone: true,
  imports: [
    FormsModule,
    TuiLoader,
    TuiTable,
    TuiTitle,
    TuiButton,
    TuiTextfield,
    TuiSelect,
    TuiInputModule,
    TuiDataListWrapper,
    TuiChevron
  ],
  templateUrl: './collection-environment-list.component.html',
  styleUrl: './collection-environment-list.component.scss'
})
export class CollectionEnvironmentListComponent implements OnInit {
  private env_service = inject(ExtEnvironmentService);

  collection_id = input<number>(-1);
  protected editting: boolean = false;

  protected types: ExternalEnvironmentType[] = [];
  protected loaded_types: boolean = false;

  protected all_environments: ExternalEnvironment[] = [];
  protected collection_environments: ExternalEnvironment[] = [];

  protected environments_map: EnvironmentsMap[] = [];

  protected loading: boolean = false;

  // form for editting mode

  ngOnInit(): void {
    this.env_service.get_external_environment_types().subscribe({
      next: types => {
        this.types = types;
      }
    })
    // Load all environments
    this.env_service.getExternalEnvironments().subscribe({
      next: envs => {
        this.all_environments = envs;
        // Load the collection's environments
        this.env_service.getCollectionEnvironments(this.collection_id()).subscribe({
          next: coll_envs => {
            // Convert coll_envs into type ExternalEnvironments[] using all_environments
            this.collection_environments = coll_envs.map(
              x => this.all_environments.find(
                s => x.environment_id === s.id
              )
            ).filter(x => x !== undefined);            
            this.buildMap(); // Build the display map
          }
        });
      }
    })
  }

  private buildMap() {
    this.loading = true;
    this.environments_map = this.types.map(t => {
      return {
        type_id: t.id,
        type_name: t.name,
        environment_options: this.all_environments.filter(e => e.type === t.name),
        current_environment: this.collection_environments.find(e => e.type === t.name)
      }
    });
    this.loading = false;
  }
}
