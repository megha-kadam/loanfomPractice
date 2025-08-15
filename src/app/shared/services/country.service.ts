import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";

@Injectable({
    providedIn : 'root'
})
export class CountryService{
    stateURL = `${environment.countryURL}/countries/states`

    constructor(private http : HttpClient){

    }

    fetchStateByCountry(country : string) : Observable<any>{
      return  this.http.post(this.stateURL, {country : country})
    }
}