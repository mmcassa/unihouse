import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { TuiAlertService } from "@taiga-ui/core";
import { BehaviorSubject, map, pipe, tap } from "rxjs";


export const PAGINATION_DEFAULT_SIZE = 20;

export const DEFAULT_PAGING_OPTIONS: PaginationOptions = {
    page: 0,
    page_size: PAGINATION_DEFAULT_SIZE,
}


export interface PaginatedAPIDataInterface<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}


export interface PaginationOptions {
    page: number;
    page_size: number;
    total_pages?: number;
    total_items?: number;
    fetch_all?: boolean;
}



/**
 * Updates provided `paging_options` and returns the results
 * @param paging_options existing set of paging data
 * @returns 
 */
export function parsePagedData(paging_options?: Partial<PaginationOptions>) {
    return pipe(
        tap((paged_data: PaginatedAPIDataInterface<any>) => {
            if (paging_options) {
                paging_options.total_items = paged_data.count;
                paging_options.total_pages = paging_options.page_size ? Math.ceil(paged_data.count / paging_options.page_size) : 1;
            }
            }),
        map( i => { return i.results })
    );
}

/**
 * Returns a new or updated `HttpParams` object with paging information updated based on the rezscope paging configuration
 * @param paging_options A partial set of `PaginationOptions` to be used in an HttpClient call
 * @param params A pre-existing set of params to be updated and returned with the updated paging options
 * @returns `HttpParams` object with `page` and `page_size` set
 */
export function set_paging_params(paging_options?: Partial<PaginationOptions>,params?: HttpParams) {
    if (params == undefined) {params = new HttpParams();}
    if (paging_options) {
      params = params.set('page',paging_options.page ? ( paging_options.page + 1 ): 1);

      params = params.set('page_size',paging_options.page_size ?? PAGINATION_DEFAULT_SIZE);
    }
    return params;
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