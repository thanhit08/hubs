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
    const canvasWidth = 128 * width;
    const canvasHeight = 128 * height;
    const margin = 40;
    canvas.width = 128 * width + margin; // Texture width (power of 2)
    canvas.height = 128 * height; // Texture height (power of 2)

    // set background transparent
    context.fillStyle = '#D3D3D4';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background
    context.fillStyle = '#000000';
    context.fillRect(margin / 2, canvas.height / 2 - 10, canvasWidth, 20);

    // Draw the progress bar
    context.fillStyle = '#ED5B21'; // Progress bar color
    context.fillRect(margin / 2, canvas.height / 2 - 10, canvasWidth * progress, 20);

    // Draw text
    // const text = `Steps: ${currentSteps} / ${maxSteps}`;
    // context.font = '32px Arial';
    // context.textAlign = 'center';
    // context.textBaseline = 'middle';
    // context.fillStyle = '#000000';
    // context.fillText(text, canvasWidth / 2, canvas.height / 2);

    // Draw a circle at the current progress
    // The circle has border in white and fill in red
    context.beginPath();
    context.arc(canvasWidth * progress + margin / 2, canvas.height / 2, 15, 0, Math.PI * 2);
    context.strokeStyle = '#000000';
    context.lineWidth = 10;
    context.stroke();
    context.fillStyle = '#ffffff';
    context.fill();



    // Create a texture from the canvas
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Create a plane geometry with the same dimensions as the canvas
    const geometry = new THREE.PlaneGeometry(width, height);

    // Create a material using the canvas texture
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // Create a mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'slider';
    // Create mesh
    return mesh;
}
