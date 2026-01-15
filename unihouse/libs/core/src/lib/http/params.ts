import { HttpParams } from "@angular/common/http";


export function add_filters_to_params(filters: any,params?: HttpParams): HttpParams {
    if (params == undefined) {params = new HttpParams();}
    for (let k in filters) {
      if (filters[k] != null)
        params = params.set(k,filters[k]);
    }
    return params;
  }