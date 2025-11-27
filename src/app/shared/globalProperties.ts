import { max, tap } from "rxjs";

export class GlobalProperties {
    public static genericErrorMessage: string = "Something went wrong. Please try again later.";

    public static nameRegex: string = "([a-zA-Z0-9 ]*)";

   public static toastrconfig = {
    maxOpened: 0,
    timeOut: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,    
    closeButton: true,
    progressBar: true,
    easing: 'ease-in',
    toastrClass: 'ngx-toastr',
    titleClass: 'toast-title',
    messageClass: 'toast-message',
    tapToDismiss: true

   }
}