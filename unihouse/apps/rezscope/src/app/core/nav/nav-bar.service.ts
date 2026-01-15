import { Component, inject, Injectable, Type } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';


export interface NavTabOptions {
  name: string;
  icon?: string;
  component?: any;
  ext?: string;
}
@Component({ template: ''})
export abstract class BasePageContent {
  protected abstract  _tabs: NavTabOptions[];
  protected abstract _cls?: Type<any>;
  protected readonly navbarsrv = inject(NavBarService);

  constructor() { }

  protected update_tabs() {
    if (this._cls) {
      this.navbarsrv.updateSubPages(this._cls,this._tabs); 
    }

  }

  get tabs(): NavTabOptions[] {
    return this._tabs;
  }

  get cls(): Type<any> | undefined{
    return this._cls;
  }
}


@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private _buttonA: any;
  private _buttonB: any;
  private _buttons: any;
  private _tabs: BehaviorSubject<NavTabOptions[]|null|undefined> = new BehaviorSubject<NavTabOptions[]|null|undefined>(undefined);
  private _activeTabIndex: BehaviorSubject<number> = new BehaviorSubject(0);
  private _activeTab: BehaviorSubject<any> = new BehaviorSubject(null);
  private _baseUrl: string = '';
  
  
  constructor() {
    this.listenForChanges();
   }

  private listenForChanges() {
    
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: (res) => {

        if (! res.url.includes(this._baseUrl)) {
          this.clearTabs();
          return;
        }
        
        let ext = res.url.substring(res.url.lastIndexOf('/')+1);
        if (ext == this._baseUrl)
          ext = '';
        if (this._tabs.value == null)
          return
        this._tabs.value.forEach( (t,index) => {
          if (ext == t.ext) {
            this._activeTabIndex.next(index);
            return;
          }
        });
      }
    });
  }

  public set buttonA(value:any) {

  }

  /**
   * Sets the tabs that are available on the Nav Bar
   * @param baseComponent Component check to make sure the component is a route
   * @param tabs list of tabs to have on the nav bar for this page
   */
  public updateSubPages(baseComponent:Type<any>,tabs: NavTabOptions[]|null) {
    let configs = this.router.config.filter((route) => route.component == baseComponent);
    if (configs.length != 1) {
      this.clearTabs();
    } else {
      this._baseUrl = configs[0].path?.toString() || '';
    }
    this._tabs.next(tabs);
  } 

  public clearTabs() {
    this._tabs.next(null);
    this._baseUrl = '';
    this._activeTabIndex.next(0);
  }

  public updateTabs(lst: NavTabOptions[]|null) {
    this._tabs.next(lst);
  }

  public get tabs() {
    return this._tabs.asObservable();
  }

  public get activeTabIndex() {
    return this._activeTabIndex.asObservable();
  }


  public set tab(name:string) {
    if (name.length > 0)
      this.router.navigate([this._baseUrl,name]);
    else 
      this.router.navigate([this._baseUrl]);
  }


  public get activeTab() {
    return this._activeTab.asObservable();
  }
}
