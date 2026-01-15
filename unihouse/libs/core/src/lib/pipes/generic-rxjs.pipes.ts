import { TuiAlertService } from "@taiga-ui/core";
import { pipe, tap } from "rxjs";

const DEFAULT_ALERT_CLOSE_MS = 3000;

export interface GenericAlertOptions {
  on_success_label?: string;
  on_fail_label?: string;
  on_fail_http_error_details?: boolean;
  on_fail_error_message?: any;
  on_success_message?: any;
  autoclose_success?: number | undefined;
}

/**
 * Updates provided `paging_options` and returns the results
 * @param paging_options existing set of paging data
 * @returns 
 */
export function alertsPipe<T>(
    alertService: any,
    on_success_label: string = "Success",
    on_fail_label: string = "Error",
    on_fail_http_error_details: boolean = true,
    on_fail_error_message: any = "Action returned with an error.",
    on_success_message: any = "Action completed successfully.",
    autoclose_success: number | undefined = 3000
  ) {
    return pipe(
            tap<T>({
              next: (res) => {
                alertService.open(on_success_message,{
                    label: on_success_label,
                    appearance: 'success', autoClose: autoclose_success}).subscribe();
              }, error: err => {
                alertService.open(`${on_fail_http_error_details ? err.error : on_fail_error_message}`,{
                  label: on_fail_label,
                  appearance: 'error'}).subscribe();
              }
            })
    );
}

/**
 * Updates provided `paging_options` and returns the results
 * @param paging_options existing set of paging data
 * @returns 
 */
export function alertsPipe2<T>(
    alertService: TuiAlertService,
    options: GenericAlertOptions = {}
  ) {
    return pipe(
            tap<T>({
              next: (res) => {
                alertService.open(
                  options.on_success_message ?? 'Action completed successfully.',
                  {
                    label: options.on_success_label ?? 'Success',
                    appearance: 'success', 
                    autoClose: options.autoclose_success ?? DEFAULT_ALERT_CLOSE_MS
                  }
                ).subscribe();
              }, error: err => {
                alertService.open(
                  `${(options.on_fail_http_error_details == undefined || options.on_fail_http_error_details) ? err.error : (options.on_fail_error_message ?? 'Action returned with an error.')}`,
                  {
                  label: options.on_fail_label ?? 'Error',
                  appearance: 'error'}
                ).subscribe();
              }
            })
    );
}