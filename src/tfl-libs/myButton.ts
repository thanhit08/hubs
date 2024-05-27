import * as THREE from 'three';

interface CreateUIButtonOptions {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  text: string;
  fontSize: number;
  font: string;
}
// const canvas = document.createElement('canvas');
// const context = canvas.getContext('2d')!;
// let texture = new THREE.Texture(canvas);
export function createUIButton(options: CreateUIButtonOptions): THREE.Mesh {
  const {
    width,
    height,
    backgroundColor,
    textColor,
    text,
    fontSize,
    font,
  } = options;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 128 * width; // Texture width (power of 2)
  canvas.height = 128 * height; // Texture height (power of 2)

  // Draw background
  // if backgroundColor is not contant # -> load image
  if (backgroundColor[0] !== '#') {
    canvas.width = 2048; // Texture width (power of 2)
    canvas.height = 512; // Texture height (power of 2)
    // const image = document.getElementById("milling_source");
    // if (image instanceof HTMLImageElement) {
    //   context.drawImage(image, 0, 0, canvas.width, canvas.height);      
    // }
    switch (text) {
      case "cnc":
        const cnc_image = document.getElementById("cnc_btn_img");
        if (cnc_image instanceof HTMLImageElement) {
          context.drawImage(cnc_image, 0, 0, canvas.width, canvas.height);
        }
        console.log("cnc_image");
        break;
      case "math":
        const math_image = document.getElementById("math_btn_img");
        if (math_image instanceof HTMLImageElement) {
          context.drawImage(math_image, 0, 0, canvas.width, canvas.height);
        }
        console.log("math_image")
        break;
      case "science":
        const science_image = document.getElementById("science_btn_img");
        if (science_image instanceof HTMLImageElement) {
          context.drawImage(science_image, 0, 0, canvas.width, canvas.height);
        }
        console.log("science_image")
        break;
      case "btn":
        canvas.width = 400; // Texture width (power of 2)
        canvas.height = 400; // Texture height (power of 2)
        const btn_image = document.getElementById("circle_btn_img");
        if (btn_image instanceof HTMLImageElement) {
          context.drawImage(btn_image, 0, 0, canvas.width, canvas.height);
        }
        console.log("btn_image")
        break;
      case "screen":
        canvas.width = 560; // Texture width (power of 2)
        canvas.height = 420; // Texture height (power of 2)
        const screen_image = document.getElementById("screen_btn_img");
        if (screen_image instanceof HTMLImageElement) {
          context.drawImage(screen_image, 0, 0, canvas.width, canvas.height);
        }
        console.log("screen_image")
        break;
    }
    // const image_from_img = new Image(60, 45);
    // image_from_img.onload = drawImageActualSize;
    // image_from_img.src = backgroundColor;
  } else {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw text
    context.font = `${fontSize}px ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = textColor;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  // Create texture from canvas
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Create material with texture
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
  if (text === "screen") {
    material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  }

  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create mesh
  return new THREE.Mesh(geometry, material);
}

// function drawImageActualSize() {
//   // Use the intrinsic size of image in CSS pixels for the canvas element
//   canvas.width = this.naturalWidth;
//   canvas.height = this.naturalHeight;

//   // Will draw the image as 300x227, ignoring the custom size of 60x45
//   // given in the constructor
//   context.drawImage(this, 0, 0);

//   // To use the custom size we'll have to specify the scale parameters
//   // using the element's width and height properties - lets draw one
//   // on top in the corner:
//   context.drawImage(this, 0, 0, this.width, this.height);
//   texture.needsUpdate = true;
// }