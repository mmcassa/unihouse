import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiStringMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiHint, TuiLink, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiCheckbox, TuiChevron, TuiComboBox, TuiDataListWrapper, TuiFilterByInputPipe, TuiInputNumber, TuiTextarea } from '@taiga-ui/kit';

interface ThemeColorOption {
  label: string;
  background: string;
  color: string;
  
}

interface Dimension {
  x: number;
  y: number;
}



@Component({
  selector: 'app-room-availability-page',
  standalone: true,
  imports: [ 
    CommonModule, 
    ReactiveFormsModule,  
    TuiTextarea, 
    TuiTextarea,
    TuiButton,
    TuiTextfield,
    TuiInputNumber,
    TuiFilterByInputPipe,
    TuiCheckbox,
    TuiChevron,
    TuiComboBox,
    TuiDataList,
    TuiDataListWrapper,
    TuiLoader,
    TuiLink,
    TuiHint
  ],
  templateUrl: './room-availability-page.component.html',
  styleUrl: './room-availability-page.component.scss'
})
export class RoomAvailabilityPageComponent {
  something!: any;
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  icon_rendered!: string;
  button_designer_form;
  icon_size = 68;
  icon = 'user';
  button_color_options: ThemeColorOption[] = [
    { 
      "background" : "#000000",
      "color": "#FFFFFF",
      "label": "Arch Black"
    },
    { 
      "background" : "#BA0C2F",
      "color": "#FFFFFF",
      "label": "Bulldog Red"
    },
    { 
      "background" : "#FFFFFF",
      "color": "#000000",
      "label": "Chapel Bell White"
    },
    { 
      "background" : "#E4002B",
      "color": "#FFFFFF",
      "label": "Glory Glory"
    },
    { 
      "background" : "#00A3AD",
      "color": "#FFFFFF",
      "label": "Lake Herrick"
    },
    { 
      "background" : "#000000",
      "color": "#FFFFFF",
      "label": "Hedges"
    },
    { 
      "background" : "#B4BD00",
      "color": "#FFFFFF",
      "label": "Olympic"
    },
    { 
      "background" : "#554F47",
      "color": "#FFFFFF",
      "label": "Sanford"
    },
    { 
      "background" : "#594A25",
      "color": "#FFFFFF",
      "label": "Herty Field"
    },
    { 
      "background" : "#66435A",
      "color": "#FFFFFF",
      "label": "Athens"
    },
  ]
  button_dimensions: Dimension = { x: 600, y: 150 }
  protected updating_icon: boolean = false;
  protected fetching_icon: boolean = false;
  private last_form_values: any;
  protected last_time_icon_value_updated: number = Date.now();

  svg_element = viewChild<ElementRef>('svgElement');

  constructor() {
      this.button_designer_form = this.fb.group({
        "label" : new FormControl('Your text here',[Validators.maxLength(20)]),
        "icon" : new FormControl('user',{validators: [Validators.pattern('[a-z][a-z\-]*[a-z]'),Validators.required]}),
        "color" : new FormControl(this.button_color_options[1]),
        "icon_size" : new FormControl<number>(68),
        "icon_ring" : new FormControl<boolean>(true)
      });
      this.button_designer_form.get('icon')?.value;
      this.on_form_changes();
  }

  private async update_icon(icon: string | null | undefined) {
    if (typeof icon === 'string' && icon.length > 0) {
      
      setTimeout(() => {
        if (icon === this.button_designer_form.get('icon')?.value && !this.fetching_icon) {
          this.fetching_icon = true;
          this.http.get(
            'assets/taiga-ui/icons/'+ icon + '.svg', 
            { responseType: 'text'}
          ).subscribe({
            next: (svg) => {
              this.fetching_icon = false;
              
              if (this.last_time_icon_value_updated <= ( Date.now()-1000)) {
                this.updating_icon = false;
              }
              
            }, error: (err) => {  
              this.fetching_icon = false;
              if (this.last_time_icon_value_updated >( Date.now()-1100)) {
                this.updating_icon = false;
              }
            }
          })
        }
      },1000);

    }
  }

  /** Detect changes on any field changes */
  private on_form_changes() {
    this.last_form_values = this.button_designer_form.value;
    this.button_designer_form.valueChanges.subscribe({
      next: (change) => {
        const tmp_icon = change.icon;
        if (change.label && change.label.length > 20) {
          this.button_designer_form.get('label')?.setValue(change.label.slice(0,20));
        }
        if (change.icon != this.last_form_values?.icon) {
          this.last_time_icon_value_updated = Date.now();
          this.updating_icon = true;
          this.update_icon(tmp_icon);
        }
        this.last_form_values = change;
      }
    })

  }

  /**
   * Used in the export functions to replace <use> tags with a canvas version of themself
   * @param svg 
   */
  private replaceInlineUseElements(svg: SVGSVGElement): void {
    const uses = svg.querySelectorAll('use');

    uses.forEach(use => {
      const href = use.getAttribute('href') || use.getAttribute('xlink:href');
      if (!href || !href.startsWith('#')) return;

      const symbolId = href.slice(1);
      const symbol = document.getElementById(symbolId);

      if (symbol) {
        const cloned = symbol.cloneNode(true);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.appendChild(cloned);

        // Copy attributes from <use> to the <g>
        for (const attr of Array.from(use.attributes)) {
          if (!['href', 'xlink:href'].includes(attr.name)) {
            g.setAttribute(attr.name, attr.value);
          }
        }

        use.replaceWith(g);
        
      }
    });
  }

  /** Used to download file */
  private download_export_file(contents: string,filename: string): void {
      const link = document.createElement("a");
      link.href = contents;
      link.download = filename;
      link.click();
  }


  /** Exports button as JPEG */
  protected export_to_jpeg(): void {
    const obj = this.svg_element();
    if (obj == undefined) {
      alert('error while trying to find the svg object')
    }
    const svg = obj?.nativeElement ?? `<svg></svg>`;
    this.replaceInlineUseElements(svg);
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Add XML declaration
    const svgData = `<?xml version="1.0" standalone="no"?>\r\n${svgString}`;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const jpegData = canvas.toDataURL('image/jpeg');

      this.download_export_file(
        jpegData,
        `${this.button_designer_form.get('label')?.value ?? 'custom'}-button.jpg`
      );
    };

    img.src = url;
  }


  protected export_to_svg(): void {
    const obj = this.svg_element();
    if (obj == undefined) {
      alert('error while trying to find the svg object')
    }
    const svg = obj?.nativeElement ?? `<svg></svg>`;
    this.replaceInlineUseElements(svg);
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Add XML declaration
    const svgData = `<?xml version="1.0" standalone="no"?>\r\n${svgString}`;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const jpegData = canvas.toDataURL('image/jpeg');

      this.download_export_file(
        jpegData,
        `${this.button_designer_form.get('label')?.value ?? 'custom'}-button.jpg`
      );
    };

    img.src = url;
  }


  protected readonly matcher: TuiStringMatcher<ThemeColorOption> = (item, value) => {
        return (
            item.label.toLowerCase().includes(value.toLowerCase()) ||
            item.background.includes(value)
        )
    };
 
    protected readonly stringify: TuiStringHandler<ThemeColorOption> = (x) => x.label;


}
