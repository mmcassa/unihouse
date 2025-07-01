import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { TuiAlertService } from "@taiga-ui/core";
import { BehaviorSubject } from "rxjs";

export const PAGINATION_DEFAULT_SIZE = 25;

export interface PaginatedAPIDataInterface<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

/**
 * A templated API response class, where `T` is the data object to be returned through `this.items()` as `T[]`
 */
export abstract class PaginatedAPIDataObject<T> {
    
    private readonly http = inject(HttpClient);
    private readonly alerts = inject(TuiAlertService);

    url: string = '';
    private $count: number = 0;
    private $current_page: number = 0;
    private $size: number = PAGINATION_DEFAULT_SIZE;
    private $size_options: number[] | undefined = [10,25,50];
    private $params: HttpParams = new HttpParams();

    private readonly $results: BehaviorSubject<T[]> = new BehaviorSubject([] as T[]);
    

    constructor() {

    }

    get count() { return this.$count; }
    get page() { return this.$current_page; }
    get items() { return this.$results.asObservable(); }

    set params(params: { [key: string]: string }) {
        Object.entries(params).forEach(([key,value]) => {
            this.$params = this.$params.set(key,value);
        })
    }

    private fetch_page(page: number) {
        let params = this.$params
            .set('page',page);
        
        this.http.get<PaginatedAPIDataInterface<T>>(
            this.url,
            { 
                params: params 
            }
        ).subscribe({
            next: (items) => {
                this.$results.next(items.results);
                this.$current_page = page;
            }, error: (err) => {
                this.alerts.open(
                    `Failed to fetch page ${page} of ${Math.ceil(this.$size/this.$count)}`,
                    {
                        appearance: 'error'
                    }
                )
            }
        });
    }

    set size_options(size: number) {
        if (this.$size_options !== undefined && this.$size_options.indexOf(size) === -1) {
            throw new TypeError('ValueError: size must be in: ' + this.$size_options.join(', '));
        }
    }

    set change_page(page: number) {
        this.fetch_page(page);
    }

    public next() {
        this.fetch_page(this.$current_page+1);
    }

    public previous() {
        this.fetch_page(this.$current_page-1);
    }


}