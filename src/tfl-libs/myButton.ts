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

  // Create canvas for text texture
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 128 * width; // Texture width (power of 2)
  canvas.height = 128 * height; // Texture height (power of 2)

  // Draw background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = `${fontSize}px ${font}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = textColor;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Create material with texture
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  
  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create mesh
  return new THREE.Mesh(geometry, material);
}