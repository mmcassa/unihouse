import { Component, input } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { ObservableButton } from '../../buttons/observable-response-button';
import { GenericAction } from '../actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-action-card',
  imports: [
    ObservableButton,
    TuiAvatar,
    TuiCardLarge,
    TuiTitle,
    TuiHeader,
  ],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss'
})
export class ActionCardComponent {
  action = input.required<GenericAction>();
  
  protected default_callback = () => { return new Observable() }
}
