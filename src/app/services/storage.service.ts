import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  deleteImage(path: string, fileName: string) {
    this.storage.ref(path).child(fileName).delete();
  }
}
