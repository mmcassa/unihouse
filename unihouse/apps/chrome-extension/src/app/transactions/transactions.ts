import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";


export class Transaction {
    private http = inject(HttpClient);
    id: number = -1;

    constructor(options?: { [key: string]: any}) {
        if (options) {
            if (Object.keys(options).includes('id')) {
                this.id = options['id'];
            }
        }
    }

    delete() {
        return this.http.post(`https://uga.starrezhousing.com/StarRezREST/services/delete/${this.id}`,null).pipe();
    }
    
}