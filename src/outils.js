export const compression = (file,callback,width=300) =>{
      
      const fileName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const scaleFactor = width / img.width;
                  canvas.width = width;
                  canvas.height = img.height * scaleFactor;
                  const ctx = canvas.getContext('2d');
                  // img.width and img.height will contain the original dimensions
                  ctx.drawImage(img, 0, 0, width, img.height*scaleFactor);
                  ctx.canvas.toBlob((blob) => {
                      const file = new File([blob], fileName, {
                          type: 'image/jpeg',
                          lastModified: Date.now()
                      });
                      callback(file);
                  }, 'image/jpeg', 0.9);
                  
              },
      reader.onerror = error => console.log(error);
        };
}

export const categories = [{nom:"Entrée",image:""},{nom:"Viande",image:"./viande.jpg"},{nom:"Poisson",image:""}
,{nom:"Végétarien",image:""},{nom:"Dessert",image:""}];