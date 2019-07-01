import { Injectable } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'my_images';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(
    private file: File, private http: HttpClient,
    private storage: Storage, 
    private toastController: ToastController
    ) { }



async presentToast(text) {
  const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
  });
  toast.present();
}





  deleteImage(imgEntry, position, imgs) {
    imgs.splice(position, 1);
 
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
 
        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
 
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.presentToast('File removed.');
        });
    });
  }


  convertToBase64(imgs){
    this.file.resolveLocalFilesystemUrl(imgs.filePath)
    .then(entry => {
        ( < FileEntry > entry).file(file => this.readFile(file))
    })
    .catch(err => {
        this.presentToast('Error while reading file.');
    });
  }

  readFile(file: any) {
    console.log("fileReader");
    var fileReader = new FileReader();
    var fileToLoad =file;
    fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileReader.result+''; // <--- data: base64
        console.log("Converted Base64 version is " + srcData);
        var comoLoQuiereJuancito = srcData.split(',');
        return comoLoQuiereJuancito;
    }

    fileReader.readAsDataURL(fileToLoad);
    console.log("func readAsDataURL");
    console.log(fileToLoad);
  }

  convertirAb64yBorrarImgsEnMemoria(images){
    let imgs64=[];
    while (images.length!=0){
      let img = images.pop();
      let img64= this.convertToBase64(img);
      imgs64.push(img64);
      this.deleteImage(img, 0, images);
    }

    return imgs64;
  }
  

}
