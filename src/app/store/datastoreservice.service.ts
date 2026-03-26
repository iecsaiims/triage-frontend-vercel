import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  private store: { [key: string]: any } = {};

  set(key: string, value: any) {
    this.store[key] = value;
  }

  get(key: string): any {
    return this.store[key];
  }

  clear(key: string) {
    delete this.store[key];
  }

  clearAll() {
    this.store = {};
  }
}