import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js";


var container3d = document.querySelector('.container3d');

var w = container3d.offsetWidth;
var h = container3d.offsetHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 200;


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.id = "canvasfirst";
renderer.domElement.classList.add("canvasfirst");
const canvas = renderer.domElement;
container3d.appendChild(renderer.domElement);
renderer.setSize(w, h);

renderer.setClearColor(0xefefef, 1);

function main() {



    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(2,5,0.5);
    camera.lookAt(0, 0, 0); // направление камеры на объект


    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#B798CD");

    // {
    //     const planeSize = 40;

    //     const loader = new THREE.TextureLoader();
    //     const texture = loader.load(
    //         "https://threejsfundamentals.org/threejs/resources/images/checker.png"
    //     );
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    //     texture.magFilter = THREE.NearestFilter;
    //     const repeats = planeSize / 2;
    //     texture.repeat.set(repeats, repeats);

    //     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    //     const planeMat = new THREE.MeshPhongMaterial({
    //         map: texture,
    //         side: THREE.DoubleSide
    //     });
    //     const mesh = new THREE.Mesh(planeGeo, planeMat);
    //     mesh.rotation.x = Math.PI * -0.5;
    //     scene.add(mesh);
    // }
    // {

    const loader = new GLTFLoader();
    loader.load('models/model4/scene.gltf', function (gltf) {
        const model = gltf.scene;
        model.position.y = 5; // поднимаем модель на 5 единиц по оси Y
    
        // Найти материал модели, который вы хотите сделать светящимся
        model.traverse(function(node) {
            if (node.isMesh) {
                node.material.emissive = new THREE.Color(0x000000); // устанавливаем красный цвет эмиссии
            }
        });
    
        scene.add(model);
    });


    {
        const color = 0xffffff;
        const intensity = 5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 200, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

    function onContainerResize() {
        const canvas = renderer.domElement;
        const container = canvas.parentNode;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onContainerResize);
    onContainerResize();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        return needResize;

    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();






