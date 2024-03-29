import * as THREE from 'three';


interface CreateUISliderOptions {
    width: number;
    height: number;
    currentSteps: number;
    minSteps: number;
    maxSteps: number;
}

export function createUISlider(options: CreateUISliderOptions): THREE.Mesh {
    const {
        width,
        height,
        currentSteps,
        minSteps,
        maxSteps
    } = options;

    const progress = (currentSteps - minSteps) / (maxSteps - minSteps);

    // Create canvas for text texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128 * width; // Texture width (power of 2)
    canvas.height = 128 * height; // Texture height (power of 2)

    // Draw background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the progress bar
    context.fillStyle = '#ff0000'; // Progress bar color
    context.fillRect(0, 0, canvas.width * progress, canvas.height);

    // Draw text
    const text = `Steps: ${currentSteps} / ${maxSteps}`;
    context.font = '32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000000';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Create a plane geometry with the same dimensions as the canvas
    const geometry = new THREE.PlaneGeometry(width, height);

    // Create a material using the canvas texture
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide});

    // Create a mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    // Create mesh
    return mesh;
}
