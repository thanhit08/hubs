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
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;
let texture = new THREE.Texture(canvas);
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
    const image_from_img = new Image(60, 45);
    image_from_img.onload = drawImageActualSize;
    image_from_img.src = backgroundColor;
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
  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Create material with texture
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  
  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create mesh
  return new THREE.Mesh(geometry, material);
}

function drawImageActualSize() {
  // Use the intrinsic size of image in CSS pixels for the canvas element
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;

  // Will draw the image as 300x227, ignoring the custom size of 60x45
  // given in the constructor
  context.drawImage(this, 0, 0);

  // To use the custom size we'll have to specify the scale parameters
  // using the element's width and height properties - lets draw one
  // on top in the corner:
  context.drawImage(this, 0, 0, this.width, this.height);
  texture.needsUpdate = true;
}