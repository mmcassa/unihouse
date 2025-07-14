import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";


class Transaction {
    private http = inject(HttpClient);
    id: number = -1;

    constructor() {

    }

    delete() {
        return this.http.post(`https://uga.starrezhousing.com/StarRezREST/services/delete/${this.id}`,null).pipe();
    }




}