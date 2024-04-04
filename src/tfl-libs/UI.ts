import * as THREE from 'three';

export function createRoundedButton(roundedButtonInfo: any): THREE.Group {
    const baseInfo = {
        position: new THREE.Vector3(0, 0, 0),
        width: 90,
        height: 50,
        radius: 10,
        backgroundColor: '#000000',
        backgroundTransparent: true,
        backgroundOpacity: 1,

        text: 'Button',
        textColor: '#ffffff',
        fontSize: 16,
        font: 'Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        fontWeight: 'normal',

        borderColor: '#ffffff',
        borderTransparent: true,
        borderOpacity: 1,
        thickness: 0.01,
    };
    Object.assign(baseInfo, roundedButtonInfo);

    const roundedButton = new THREE.Group();
    const roundedButtonBackground = new THREE.Shape();
    roundedButtonBackground.moveTo(baseInfo.position.x, baseInfo.position.y + baseInfo.radius);
    roundedButtonBackground.lineTo(baseInfo.position.x, baseInfo.position.y + baseInfo.height - baseInfo.radius);
    roundedButtonBackground.quadraticCurveTo(baseInfo.position.x, baseInfo.position.y + baseInfo.height, baseInfo.position.x + baseInfo.radius, baseInfo.position.y + baseInfo.height);
    roundedButtonBackground.lineTo(baseInfo.position.x + baseInfo.width - baseInfo.radius, baseInfo.position.y + baseInfo.height);
    roundedButtonBackground.quadraticCurveTo(baseInfo.position.x + baseInfo.width, baseInfo.position.y + baseInfo.height, baseInfo.position.x + baseInfo.width, baseInfo.position.y + baseInfo.height - baseInfo.radius);
    roundedButtonBackground.lineTo(baseInfo.position.x + baseInfo.width, baseInfo.position.y + baseInfo.radius);
    roundedButtonBackground.quadraticCurveTo(baseInfo.position.x + baseInfo.width, baseInfo.position.y, baseInfo.position.x + baseInfo.width - baseInfo.radius, baseInfo.position.y);
    roundedButtonBackground.lineTo(baseInfo.position.x + baseInfo.radius, baseInfo.position.y);
    roundedButtonBackground.quadraticCurveTo(baseInfo.position.x, baseInfo.position.y, baseInfo.position.x, baseInfo.position.y + baseInfo.radius);

    const roundedButtonBackgroundMaterial = new THREE.MeshBasicMaterial({
        color: baseInfo.backgroundColor,
        side: THREE.DoubleSide,
        transparent: baseInfo.backgroundTransparent,
        opacity: baseInfo.backgroundOpacity
    });

    const roundedButtonBackgroundGeometry = new THREE.ShapeBufferGeometry(roundedButtonBackground);
    const roundedButtonBackgroundMesh = new THREE.Mesh(roundedButtonBackgroundGeometry, roundedButtonBackgroundMaterial);
    roundedButton.add(roundedButtonBackgroundMesh);

    // Create canvas for text texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = baseInfo.width; // Texture width (power of 2)
    canvas.height = baseInfo.height; // Texture height (power of 2)

    // Draw background
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = `${baseInfo.fontSize}px ${baseInfo.font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = baseInfo.textColor;
    context.fillText(baseInfo.text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Create material with texture
    const textMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // Create geometry
    const textGeometry = new THREE.PlaneGeometry(baseInfo.width, baseInfo.height);

    // Create mesh
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    roundedButton.add(textMesh);

    // const borderPositionX = baseInfo.position.x - baseInfo.thickness;
    // const borderPositionY = baseInfo.position.y - baseInfo.thickness;
    // const borderWidth = baseInfo.width + baseInfo.thickness * 2;
    // const borderHeight = baseInfo.height + baseInfo.thickness * 2;

    // const roundedButtonBorder = new THREE.Shape();
    // roundedButtonBorder.moveTo(borderPositionX, borderPositionY + baseInfo.radius);
    // roundedButtonBorder.lineTo(borderPositionX, borderPositionY + borderHeight - baseInfo.radius);
    // roundedButtonBorder.quadraticCurveTo(borderPositionX, borderPositionY + borderHeight, borderPositionX + baseInfo.radius, borderPositionY + borderHeight);
    // roundedButtonBorder.lineTo(borderPositionX + borderWidth - baseInfo.radius, borderPositionY + borderHeight);
    // roundedButtonBorder.quadraticCurveTo(borderPositionX + borderWidth, borderPositionY + borderHeight, borderPositionX + borderWidth, borderPositionY + borderHeight - baseInfo.radius);
    // roundedButtonBorder.lineTo(borderPositionX + borderWidth, borderPositionY + baseInfo.radius);
    // roundedButtonBorder.quadraticCurveTo(borderPositionX + borderWidth, borderPositionY, borderPositionX + borderWidth - baseInfo.radius, borderPositionY);
    // roundedButtonBorder.lineTo(borderPositionX + baseInfo.radius, borderPositionY);
    // roundedButtonBorder.quadraticCurveTo(borderPositionX, borderPositionY, borderPositionX, borderPositionY + baseInfo.radius);

    // const roundedButtonBorderMaterial = new THREE.MeshBasicMaterial({
    //     color: baseInfo.borderColor,
    //     side: THREE.DoubleSide,
    //     transparent: baseInfo.borderTransparent,
    //     opacity: baseInfo.borderOpacity
    // });

    // const roundedButtonBorderGeometry = new THREE.ShapeBufferGeometry(roundedButtonBorder);
    // const roundedButtonBorderMesh = new THREE.Mesh(roundedButtonBorderGeometry, roundedButtonBorderMaterial);
    // roundedButton.add(roundedButtonBorderMesh);

    return roundedButton;

}