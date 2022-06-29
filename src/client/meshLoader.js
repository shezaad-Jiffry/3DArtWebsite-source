import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { DoubleSide, MeshBasicMaterial } from "three";
import { GUI } from "dat.gui";
export default function meshLoader(geo = THREE.Group, mixer = THREE.AnimationMixer){
    //renderer renders out to the canvas tag in the main html
    const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas"), antialias: true});
    //important so scene is rendered only into the canvas element
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    //this has to be set at the start before post processing so its not a blurry mess
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);
    //scene elements
    const scene = new THREE.Scene();
    const backgroundLoader = new THREE.TextureLoader().load('img/sky.jpg');
    //camera  and controls
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth * 0.5 / window.innerHeight * 1, 0.1, 1000 );
    var controls = new OrbitControls(camera, renderer.domElement);
    //post processing 
    const composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    var selectedObjects = [];
    //adds objects to get outlined
    function addSelectedObject( object ) {

        selectedObjects = [];
        selectedObjects.push( object );

    }
    
    //adds the skybox

    //initilizes all the properties needed
    function init(){
        //add the skybox, texture can be changed to whatever is needed
        var skyboxMaterial = new THREE.MeshBasicMaterial
        var skyboxTextures = new THREE.TextureLoader().load('models/textures/sky.png');
        skyboxTextures.flipY = false
        skyboxMaterial.map = skyboxTextures;
        skyboxMaterial.side = DoubleSide
        var gltfLoader = new GLTFLoader();
        gltfLoader.load("models/skybox-night.glb", function(gltf) {
            gltf.scene.traverse(function(child) {
                if (child.isMesh) {
                    var m = child;
                    if (m.name == "SkyBox") {
                        m.material = skyboxMaterial
                    }
                }
            });
            scene.add(gltf.scene)
        }, function(xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        }, function(error) {
            console.log(error);
        });
        

        //camera
        camera.position.set(0.8, 1.4, 1.0);
        //camera controls
        controls.enableDamping = true;
        controls.target.set(0, 1, 0);
        //lights
        var ambientLight = new THREE.AmbientLight( 0xFFFFFFFFF, 0.5);
        var light1 = new THREE.PointLight(0xa6a4a2, 0.2);    
        light1.position.set(1.5, 2.5, 2.5);
        ambientLight.position.set(0, 0, 0);
        light1.position.set(200, 100, 300);
        scene.add(light1)
        scene.add(ambientLight)
        //post process
        composer.addPass( renderPass );
        //adds outlines on mesh
        var outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
        outlinePass.visibleEdgeColor.set( '#061333')
        composer.addPass( outlinePass );
        addSelectedObject(geo);
        outlinePass.selectedObjects = selectedObjects;
        //GUI

        //finally add in the model
        
        scene.add(geo);
        
    }
    init()
    //extremly important function that makes sure the renderer reacts to the canvas componenets CSS and reacts properly
    function resizeCanvasToDisplaySize() {
        //grab the canvas element and its width, height and set the renderer size accordingly

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        renderer.setPixelRatio( window.devicePixelRatio );
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    //dual purpose simply makes the mesh spin while also making the program listen to and react to css/ window sizes being changed
    var clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        
        
        
        mixer.update(clock.getDelta());
        renderer.render(scene, camera);
        composer.render();
        
    }
    //recursive call
    animate()
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