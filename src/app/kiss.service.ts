import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KissService {

  constructor() { }

  kiss () {
    console.log('Kiss')
  }
}
