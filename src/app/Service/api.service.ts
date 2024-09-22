import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
  
})
 
export class ApiService {

  constructor(private http: HttpClient) { }


postProduct(data:any){
  return this.http.post<any>("http://localhost:3000/prouctList", data)
}
getProducts(){
  return this.http.get<any>("http://localhost:3000/prouctList")
}
updateProduct(data:any, id:string){
  return this.http.put<any>("http://localhost:3000/prouctList/" + id, data)
}
removeProduct(id:string){
  return this.http.delete<any>("http://localhost:3000/prouctList/" + id)
}
}
