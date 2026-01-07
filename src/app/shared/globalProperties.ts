import { max, tap } from "rxjs";

export class GlobalProperties {
    public static genericErrorMessage: string = "Something went wrong. Please try again later.";

    public static nameRegex: string = "([a-zA-Z0-9 ]*)";

    public static secret_key: string = '0e6ac86d198450e54717edd800dad660124a4a56512b64a4873b8880ad00837430488d7a2ff58bdc98e1f7fffbd109fffad2eb2976cfb74387623cf7597024878b80cec738fc210d46fb988d00e6e15ef803cf9b8b5db7320483ed7c3ad842b888c28ba106932b8e968bc1020304e9429af9102fd21c4a1a506696390a9f56ce';

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