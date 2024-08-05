import * as THREE from 'three';

let cube;
let isDragging = false;

function model3D() {
    let dampingFactor = 0.05;
    let previousMousePosition = { x: 0, y: 0 }
    let angularVelocity = { x: 0, y: 0 };
    let zoomlevel = 100;
    let startRotation = null;
    let isColorPickerActive = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;
    document.getElementById('main-container').appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const geometry = new THREE.SphereGeometry(1, 8, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.castShadow = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 15, 5);
    light.castShadow = true;
    scene.add(light);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.addEventListener('mousedown', function (event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object === cube) {
                isDragging = true;
                break;
            }
        }
    });

    document.addEventListener('mousemove', function (event) {
        if (!isDragging || isColorPickerActive) {
            return;
        }

        var deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        }

        angularVelocity.x = deltaMove.y * 0.01;
        angularVelocity.y = deltaMove.y * 0.01;

        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.5), // Điều chỉnh hệ số nhân để thay đổi tốc độ xoay
                toRadians(deltaMove.x * 0.5),
                0,
                'XYZ'
            ));

        previousMousePosition = {
            x: event.offsetX,
            y: event.offsetY
        }
        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    })

    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        const minZoomLevel = 50;
        const maxZoomLevel = 200;
        if (event.deltaY > 0) {
            if (zoomlevel + 10 <= maxZoomLevel) {
                camera.position.z += 0.5;
                zoomlevel += 10;
            }
        } else {
            if (zoomlevel - 10 >= minZoomLevel) {
                camera.position.z -= 0.5;
                zoomlevel -= 10;
            }
        }
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }, { passive: false });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'r' || event.key === 'R') {
            const duration = 500;
            const start = performance.now();
            const endQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
            const animate = (time) => {
                let timeFraction = (time - start) / duration;
                if (timeFraction > 1) timeFraction = 1;
                const tempQuaternion = cube.quaternion.clone().slerp(endQuaternion, timeFraction);
                cube.quaternion.copy(tempQuaternion);
                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                    startRotation = null;
                }
            }
            requestAnimationFrame(animate);
        }
    });

    document.addEventListener('colorSelected', function (e) {
        const selectedColor = e.detail;
        cube.material.color.set(selectedColor);
    })

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += angularVelocity.x;
        cube.rotation.y += angularVelocity.y;
        angularVelocity.x *= dampingFactor;
        angularVelocity.y *= dampingFactor;
        cube.castShadow = true;
        renderer.render(scene, camera);
    }
    animate();
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

model3D();
