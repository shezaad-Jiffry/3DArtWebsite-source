import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default function meshLoader(geo = THREE.Group){
    //renderer renders out to the canvas tag in the main html
    const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});
    //camera size and position
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth * 0.5 / window.innerHeight * 1, 0.1, 1000 );
    const scene = new THREE.Scene();
    const backgroundLoader = new THREE.TextureLoader().load('img/sky.jpg');
    const texture = new THREE.TextureLoader().load( 'img/checker.png' );
    scene.background = backgroundLoader



    //we load the geometry from an external file so this file is reusable
    scene.add(geo);
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);
    const geometry = new THREE.BoxGeometry(500, 2, 500);
    const material = new THREE.MeshPhongMaterial({
    map:texture,
    color: 0xaaaa,
    specular: 0xffffff,
    shininess: 50,
    shading: THREE.SmoothShading,
    
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.y = -10
    //scene.add(floor)
    //TODO make lights more dynamic or change on each model, whichever comes first
    var light1 = new THREE.PointLight(0xa6a4a2, 0.2);
    light1.position.set(1.5, 2.5, 2.5);
    var ambientLight = new THREE.AmbientLight( 0xFFFFFFFFF, 0.5);
    ambientLight.position.set(0, 0, 0);
    //initilizes all the properties needed
    function init(){
        camera.position.set(0.8, 1.4, 1.0);
        light1.position.set(200, 100, 300);
        scene.add(light1)
        scene.add(ambientLight)
    }
    init()
    //extremly important function that makes sure the renderer reacts to the canvas componenets CSS and reacts properly
    function resizeCanvasToDisplaySize() {
        //grab the canvas element and its width, height and set the renderer size accordingly
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    //dual purpose simply makes the mesh spin while also making the program listen to and react to css/ window sizes being changed
    function animate(time) {



        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    //recursive call
    requestAnimationFrame(animate);
    //resize the screen by getting the button and the editor section and resizing
    const editorElem = document.querySelector("#editor");
    document.querySelectorAll('button').forEach(elem => {
    elem.addEventListener('click', () => {
        editorElem.style.flexBasis = elem.dataset.size;
    });
    });

    //observer that listens to the page being changed
    const resizeObserver = new ResizeObserver(resizeCanvasToDisplaySize);
    resizeObserver.observe(renderer.domElement, {box: 'content-box'});
}