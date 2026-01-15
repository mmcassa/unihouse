import { Component, input, OnInit } from '@angular/core';
import { TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-name-avatar',
  imports: [
    TuiAvatar,
    TuiInitialsPipe,
  ],
  templateUrl: './name-avatar.component.html',
  styleUrls: ['./name-avatar.component.scss'],
})
export class NameAvatarComponent implements OnInit {
  name = input.required<string>();

  protected background: string = '#0000009c';
  protected color: string = '#f6f6f6e3';
  
  protected get initials(): string {
    const n = this.name() ?? '';
    return n
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // optional: limit to 2 letters
  }

  ngOnInit(): void {
    const pipe = new TuiAutoColorPipe();
    this.background = pipe.transform(this.name());
    this.color = this.bg_to_txt(this.background);
  }

  private bg_to_txt(val: string) {
    const hsl_matcher = /\([-0-9]+,[0-9]+%,([0-9]+)%\)/;
    if (val.length === 0) {
      return 'white';
    }
    let matches = val.match(hsl_matcher);
    if (matches == null || matches.length == 1 || matches.length > 2) {
      console.error({
        error:'Failed to parse hsl() light value.',
        input: val,
        matches: matches, 

      })
      return 'white';
    }

    let inv_light = (Number(matches[1])+50)%100;
    const hsl = 'hsl(0,0%,' + inv_light.toString() + '%)';
    return hsl;
  }
}
