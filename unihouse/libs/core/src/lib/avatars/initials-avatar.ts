import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiAutoColorPipe } from '@taiga-ui/core';

@Component({
  selector: 'uc-initials-avatar',
  imports: [CommonModule, TuiAvatar, TuiAutoColorPipe],
  templateUrl: './initials-avatar.html',
  styleUrl: './initials-avatar.scss',
})
export class InitialsAvatar implements OnInit {

  protected _initials: string = '01';

  name = input<string>();
  initials = input<string>();
  
  ngOnInit(): void {
    let name: string = this.name() ?? '';
    if (name.length > 0) {
      this._initials = this.get_initials(name);
    }
  }
  

  private get_initials(name: string): string {
    let all_initials = name.split(" ").map(x => x[0]);
    let used_initials = all_initials.length > 2 ? all_initials.splice(1,all_initials.length-2 ) : all_initials
    return used_initials.join("");
  }

}
