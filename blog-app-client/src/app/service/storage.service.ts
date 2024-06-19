import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(label:any,data:any){
      localStorage.setItem(label,JSON.stringify(data))
  }
  getStorage(label:any){
    // return localStorage.getItem(label)? JSON.parse(localStorage.getItem(label)): null;
    const storedData = localStorage.getItem(label);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing JSON from localStorage', e);
        return null;
      }
    }
    return null;
    // return JSON.parse(localStorage.getItem(label) ?? "")
  }
  removeStorage(label:any){
      localStorage.removeItem(label)
  }
}
