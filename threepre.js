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
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
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

    // const loader = new GLTFLoader();
    // loader.load('models/model4/scene.gltf', function (gltf) {
    //     const model = gltf.scene;
    //     model.position.y = 5; // поднимаем модель на 5 единиц по оси Y
    
    //     // Найти материал модели, который вы хотите сделать светящимся
    //     model.traverse(function(node) {
    //         if (node.isMesh) {
    //             node.material.emissive = new THREE.Color(0x000000); // устанавливаем красный цвет эмиссии
    //         }
    //     });
    
    //     scene.add(model);
    // });


    let icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    let lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0x001DFC,
        wireframe: false
    });
    let ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.x = 0;
    ball.position.y = 5;
    ball.position.z = 0;
    ball.castShadow = true;
    scene.add(ball);

    


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





// const noise = new SimplexNoise();

// function init() {

//     /* scene
//     --------------------------------------*/
//     let scene = new THREE.Scene();

//     /* camera
//     --------------------------------------*/
//     let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.x = 0;
//     camera.position.y = 0;
//     camera.position.z = 50;
//     camera.lookAt(scene.position);
//     scene.add(camera);

//     /* renderer
//     --------------------------------------*/
//     let renderer = new THREE.WebGLRenderer();
//     renderer.setClearColor(new THREE.Color(0x1C1C1C));
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.shadowMap.enabled = true;

//     /* Plane
//     --------------------------------------*/
//     let planeGeometry = new THREE.PlaneGeometry(60, 60, 20, 20);
//     let planeMaterial = new THREE.MeshLambertMaterial({
//         color: 0xFFF2BE,
//         side: THREE.DoubleSide
//     });
//     let plane = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane.receiveShadow = true;
//     plane.rotation.x = -0.5 * Math.PI;
//     plane.position.x = 0;
//     plane.position.y = -15;
//     plane.position.z = 0;
//     scene.add(plane);

//     /* Ball
//     --------------------------------------*/
//     let icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
//     let lambertMaterial = new THREE.MeshLambertMaterial({
//         color: 0x001DFC,
//         wireframe: false
//     });
//     let ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
//     ball.position.x = 0;
//     ball.position.y = 5;
//     ball.position.z = 0;
//     ball.castShadow = true;
//     scene.add(ball);

//     /* AmbientLight
//     --------------------------------------*/
//     let ambientLight = new THREE.AmbientLight(0x999999); //0x999999
//     scene.add(ambientLight);

//     /* SpotLight
//     --------------------------------------*/
//     let spotLight = new THREE.SpotLight(0xaaaaaaa); //0xaaaaaaa
//     spotLight.intensity = 0.8;
//     spotLight.position.set(-10, 40, 20);
//     spotLight.lookAt(ball);
//     spotLight.castShadow = true;
//     scene.add(spotLight);

//     /* OrbitControls
//     --------------------------------------*/
//     let orbitControls = new THREE.OrbitControls(camera);
//     orbitControls.autoRotate = false;

//     /* datGUI
//     --------------------------------------*/
//     let gui = new dat.GUI();
//     let guiControls = new function() {
//         this.amp = 1;
//         this.wireframe = false;
//     }
//     gui.add(guiControls, 'amp', 0, ball.geometry.parameters.radius - 1);
//     gui.add(guiControls, 'wireframe').onChange((e) => {
//         ball.material.wireframe = e;
//     });

//     document.getElementById('WebGL-output').appendChild(renderer.domElement);

//     window.addEventListener('resize', onWindowResize, false);

//     render();

//     function render() {
//         makeRoughGround(plane);
//         makeRoughBall(ball);
//         renderer.render(scene, camera);
//         requestAnimationFrame(render);
//     }

//     function onWindowResize() {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function makeRoughBall(mesh) {
//         mesh.geometry.vertices.forEach(function(vertex, i) {
//             let offset = mesh.geometry.parameters.radius;
//             let amp = guiControls.amp;
//             let time = Date.now();
//             vertex.normalize();
//             let distance = offset + noise.noise3D(
//                 vertex.x + time * 0.0007,
//                 vertex.y + time * 0.0008,
//                 vertex.z + time * 0.0009
//             ) * amp;
//             vertex.multiplyScalar(distance);
//         })
//         mesh.geometry.verticesNeedUpdate = true;
//         mesh.geometry.normalsNeedUpdate = true;
//         mesh.geometry.computeVertexNormals();
//         mesh.geometry.computeFaceNormals();
//     }

//     function makeRoughGround(mesh) {
//         mesh.geometry.vertices.forEach(function(vertex, i) {
//             let amp = 2;
//             let time = Date.now();
//             let distance = noise.noise2D(
//                 vertex.x + time * 0.0003,
//                 vertex.y + time * 0.0001
//             ) * amp;
//             vertex.z = distance;
//         })
//         mesh.geometry.verticesNeedUpdate = true;
//         mesh.geometry.normalsNeedUpdate = true;
//         mesh.geometry.computeVertexNormals();
//         mesh.geometry.computeFaceNormals();
//     }

// }

// window.onload = init;
