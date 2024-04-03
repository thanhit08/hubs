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
export function createMyButton(options: CreateUIButtonOptions): THREE.Mesh {
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
    const ctx = canvas.getContext('2d')!;

    // Button properties
    const buttonWidth = 128 * width;
    const buttonHeight = 128 * height;
    const cornerRadius = 40;
    const buttonColor = backgroundColor;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.arcTo(buttonWidth, 0, buttonWidth, cornerRadius, cornerRadius);
    ctx.arcTo(buttonWidth, buttonHeight, buttonWidth - cornerRadius, buttonHeight, cornerRadius);
    ctx.arcTo(0, buttonHeight, 0, buttonHeight - cornerRadius, cornerRadius);
    ctx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
    ctx.closePath();
    ctx.fillStyle = buttonColor;
    ctx.fill();

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, buttonWidth / 2, buttonHeight / 2);

    // Create a texture from the canvas
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Create a plane geometry with the same dimensions as the canvas
    const geometry = new THREE.PlaneGeometry(width, height);

    // Create a material using the canvas texture
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // Create a mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'button';
    // Create mesh
    return mesh; 
}