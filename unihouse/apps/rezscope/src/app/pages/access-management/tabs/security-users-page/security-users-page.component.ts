import {  Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiButton, TuiDropdown, TuiLabel, TuiLoader, TuiTextfield } from '@taiga-ui/core';

import { TuiDataListWrapper,
  tuiItemsHandlersProvider, TuiSwitch, TuiTiles} from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';
import { ObservableButton, PaginationOptions, PaginationWrapperComponent } from '@unihouse/core';
import { PositionCardComponent, PositionService, StarrezAccessService } from 'apps/rezscope/src/app/core/access'; 
import { EmploymentPositionInterface } from 'apps/rezscope/src/app/core/access/positions/position.interface';

interface AutoDetectedStarRezGroupDescription {
  label: string;
  count: number;
  matchesKnownGroup?: boolean;
  knownGroupIDs?: number[];
}

interface AutoDetectedStarRezGroupSecGroup {
  name: string;
  id: number;
  
}
interface AutoDetectedStarRezTitleOption {
  title: string;
  rank: number;
}
export interface AutoDetectedStarRezGroupCoverted {
  securitygroups: AutoDetectedStarRezGroupSecGroup[]
  groupdescriptions: AutoDetectedStarRezGroupDescription[];
  titleoptions: AutoDetectedStarRezTitleOption[];
  selectedTitle: AutoDetectedStarRezTitleOption;
  title: string;
  editing: boolean;
  isAutoDetect?: boolean;
  saved?: boolean;
  
}

@Component({
  selector: 'starrez-security-users-page',
  standalone: true,
  imports: [
    TuiDropdown,
    TuiButton,
    TuiDataListWrapper,
    TuiTextfield,
    FormsModule,
    TuiTiles,
    TuiLoader,
    TuiLabel,
    TuiSwitch,
    PositionCardComponent,
    TuiSearch,
    ReactiveFormsModule,
    ObservableButton,
    PaginationWrapperComponent
  ],
  templateUrl: './security-users-page.component.html',
  styleUrl: './security-users-page.component.scss',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: any) => `${item.title} (${item.rank})`,
  }),
  ]
})
export class StarRezSecurityUsersPageComponent {
  private readonly accessService = inject(StarrezAccessService);
  private readonly positionService = inject(PositionService);
  private fb = inject(FormBuilder);
  protected paging_options: PaginationOptions = {
    page: 0,
    page_size: 10,
    total_items: -1,
    total_pages: 1
  }

  positions: EmploymentPositionInterface[] = [];

  protected loading_positions: boolean = false;
  protected order = new Map();
  protected searchForm: FormGroup;
  
  protected last_search_str: string = '';
  protected editing = false;

  protected staged_only = false;


  constructor() {
    this.searchForm = this.fb.group({
      "search" : ['',]
    })
  }

  ngOnInit() {
    this.fetchData();
  }

  protected fetchData() {
    const search_init = this.searchForm.get("search")?.value;
    setTimeout(() => {
      const search_str = this.searchForm.get("search")?.value;
      let filters: any = {
        search: [search_str],
      };
      if (search_init != search_str) {
        return;
      }
      this.loading_positions = true;
      if (search_str != this.last_search_str) {
        this.paging_options.page = 0;
      }
      if (this.staged_only) {
        filters['staged'] = true;
      }
      this.positionService.get_positions(
        filters,
        this.paging_options
        )
        .subscribe({
          next : res => {
            this.positions = res;
            this.last_search_str = search_str;
          }, complete: () => {
            this.loading_positions = false;
          }
        });
    }, 500);
    
  }

  protected positionRemoved(id:number,mergeTo: number) {
    // remove id from list
    this.positions.splice(id,1)
    // refresh mergeTo if exists
    if (mergeTo !== 0) {
      this.fetchData();
    }
  }

  protected goToPage() {
    this.fetchData();
    
  }

  protected auto_detect_users() {
    return () => this.accessService.autodetect();
  }


}
