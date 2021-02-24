import {readAndCompressImage} from 'browser-image-resizer';

export const compression = (file,callback) =>{
      
    const fileName = file.name;
    
    readAndCompressImage(file,{maxHeight:400,quality:0.9})
    .then(blob=>{console.log(blob)
        const newFile = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
        });
        callback(newFile);
    })
}



export const compressions = (file,callback) =>{
      
      const fileName = file.name;
      const reader = new FileReader();
      
      reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          console.log('scr',event.target.result);
          console.log('event',event)
          //console.log('scr',event.target.result);
          img.onloadeddata = ()=>{console.log("loaded");}
          img.onload = () => {
                resizeMe(img,callback,fileName);    
            /*
            console.log("load");
                    console.log("scr",img.scr);
                  const canvas = document.createElement('canvas');
                  const scaleFactor = width / img.width;
                  canvas.width = width;
                  canvas.height = img.height * scaleFactor;
                  const ctx = canvas.getContext('2d');
                  // img.width and img.height will contain the original dimensions
                  ctx.drawImage(img, 0, 0, width, img.height*scaleFactor);
                  ctx.canvas.toBlob((blob) => {
                        console.log('blob',blob);
                        const file = new File([blob], fileName, {
                          type: 'image/jpeg',
                          lastModified: Date.now()
                      });
                      callback(file);
                  }, 'image/jpeg', 0.9);
                  */
              },
      reader.onerror = error => console.log(error);
        };
    reader.readAsDataURL(file);
}



// === RESIZE ====

function resizeMe(img,callback,fileName,width=300) {
  
  var canvas = document.createElement('canvas');

    const scaleFactor = width / img.width;
    canvas.width = width;
    canvas.height = img.height * scaleFactor;
    const ctx = canvas.getContext('2d');
                  
    ctx.drawImage(img, 0, 0, width, img.height*scaleFactor);
    ctx.canvas.toBlob((blob) => {
        console.log('blob',blob);
        const file = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
        callback(file);
    }, 'image/jpeg', 0.9); 

}



export const categories = [{nom:"Entrée",image:"./entree.jpeg"},{nom:"Viande",image:"./viande.jpeg"},{nom:"Poisson",image:"./poisson.jpg"}
,{nom:"Végétarien",image:"./vegetarien.jpeg"},{nom:"Dessert",image:"./dessert.jpeg"},{nom:"Boisson",image:"./boisson.jpeg"},{nom:"Plat tune",image:"./tune.jpeg"}];