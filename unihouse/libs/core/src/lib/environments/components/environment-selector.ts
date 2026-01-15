import { Component, inject, input, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { ExtEnvironmentService } from '../ext-environment.service';
import { ExternalEnvironment } from '../interfaces/environment-interface';

@Component({
  selector: 'uc-environment-selector',
  imports: [
    CommonModule,
    TuiTextfield,
    TuiDataListWrapper,
    TuiSelect,
    TuiChevron
  ],
  templateUrl: './environment-selector.html',
  styleUrl: './environment-selector.scss',
})
export class EnvironmentSelector implements OnInit {
  private readonly envService = inject(ExtEnvironmentService);
  
  environments = model<ExternalEnvironment[]>();
  placeholder = input<string>('Select Environment');
  ne = input<number>();

  ngOnInit(): void {
    if (this.environments()) {
      this.environments.set([]);
    } else {
      this.get_envs();
    }
  }

  private get_envs() {
    const filters:any = {}
    if (this.ne() != null) {
      filters['id_ne'] = this.ne();
    }
    this.envService.getExternalEnvironments(filters).subscribe({
      next: (envs) => {
        this.environments.set(envs);
      }
    })
  }
}
