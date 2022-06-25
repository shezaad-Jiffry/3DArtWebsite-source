import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

var scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));
var light1 = new THREE.PointLight(0xdb7dd5, 0.5);
light1.position.set(1.5, 2.5, 2.5);
var ambientLight = new THREE.AmbientLight(0xdb7dd5, 0.4);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth * 0.5 / window.innerHeight * 1, 0.1, 1000 );
camera.position.set(0.8, 1.4, 1.0);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 1);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
var mixer;
var modelReady = false;
var animationActions = [];
var activeAction;
var lastAction;
var gltfLoader = new GLTFLoader();
var mainMaterial = new THREE.MeshToonMaterial();
var hairMaterial = new THREE.MeshToonMaterial();
var faceMaterial = new THREE.MeshToonMaterial();
var mainTexture = new THREE.TextureLoader().load('models/clothing_Base_color.png');
mainTexture.encoding = THREE.sRGBEncoding;
mainTexture.flipY = false;
var hairTexture = new THREE.TextureLoader().load('models/hair_Base_color.png');
hairTexture.encoding = THREE.sRGBEncoding;
hairTexture.flipY = false;
var faceTexture = new THREE.TextureLoader().load('models/toon face.png');
faceTexture.encoding = THREE.sRGBEncoding;
faceTexture.flipY = false;
mainMaterial.map = mainTexture;
hairMaterial.map = hairTexture;
faceMaterial.map = faceTexture;

renderer.setClearColor( 0xafffff, 0);
gltfLoader.load("models/mari.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            var m = child;
            var n = m.material;
            if (n.name == "MAIN") {
                m.material = mainMaterial;
            }
            if (n.name == "FACE") {
                m.material = faceMaterial;
            }
            if (n.name == "HAIR") {
                m.material = hairMaterial;
            }
        }
    });
    // gltf.scene.scale.set(.01, .01, .01)
    mixer = new THREE.AnimationMixer(gltf.scene);
    var animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];
    scene.add(gltf.scene);
    gltf.parser.getDependencies('material').then(function (materials) {
        //materials[0] = mainMaterial
        //console.log(materials[0])
    });
    //add an animation from another file
    gltfLoader.load("models/mari-idle.glb", function (gltf) {
        console.log("loaded idle");
        var animationAction = mixer.clipAction(gltf.animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "idle");
        //add an animation from another file
        gltfLoader.load("models/mari-run.glb", function (gltf) {
            console.log("run");
            var animationAction = mixer.clipAction(gltf.animations[0]);
            animationActions.push(animationAction);
            animationsFolder.add(animations, "run");
            //add an animation from another file
            gltfLoader.load("models/mari-throw.glb", function (gltf) {
                console.log("loaded throw");
                gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                var animationAction = mixer.clipAction(gltf.animations[0]);
                animationActions.push(animationAction);
                animationsFolder.add(animations, "spin_throw");
                modelReady = true;
                gltfLoader.load("models/mari-attack.glb", function (gltf) {
                    console.log("loaded attack");
                    gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                    var animationAction = mixer.clipAction(gltf.animations[0]);
                    animationActions.push(animationAction);
                    animationsFolder.add(animations, "attack");
                    modelReady = true;
                    gltfLoader.load("models/mari-dash.glb", function (gltf) {
                        console.log("loaded dash");
                        gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                        var animationAction = mixer.clipAction(gltf.animations[0]);
                        animationActions.push(animationAction);
                        animationsFolder.add(animations, "dash");
                        modelReady = true;
                        gltfLoader.load("models/mari-snap.glb", function (gltf) {
                            console.log("loaded snap");
                            gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                            var animationAction = mixer.clipAction(gltf.animations[0]);
                            animationActions.push(animationAction);
                            animationsFolder.add(animations, "snap");
                            modelReady = true;
                        }, function (xhr) {
                            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                        }, function (error) {
                            console.log(error);
                        });
                    }, function (xhr) {
                        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                    }, function (error) {
                        console.log(error);
                    });
                }, function (xhr) {
                    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                }, function (error) {
                    console.log(error);
                });
            }, function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }, function (error) {
                console.log(error);
            });
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        }, function (error) {
            console.log(error);
        });
    }, function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, function (error) {
        console.log(error);
    });
}, function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
}, function (error) {
    console.log(error);
});
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth * 0.5 / window.innerHeight * 1;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 1);
    render();
}
//var stats = Stats();
//document.body.appendChild(stats.dom);
var animations = {
    default: function () {
        setAction(animationActions[0]);
        scene.traverse(function (node) {
            if (node.type = "SkinnedMesh") {
                console.log(node.getObjectByName("KaoruSakaki-Head012"));
            }
        });
    },
    idle: function () {
        setAction(animationActions[1]);
    },
    run: function () {
        setAction(animationActions[2]);
    },
    spin_throw: function () {
        setAction(animationActions[3]);
    },
    attack: function () {
        setAction(animationActions[4]);
    },
    dash: function () {
        setAction(animationActions[5]);
    },
    snap: function () {
        setAction(animationActions[6]);
    }
};
var setAction = function (toAction) {
    if (toAction != activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        //lastAction.stop()
        lastAction.fadeOut(0);
        activeAction.reset();
        activeAction.fadeIn(0);
        activeAction.play();
    }
};
var lights = {
    enabled: function () {
        setLight(true);
    },
    disabled: function () {
        setLight(false);
    },
};
var setLight = function (enabled) {
    if (enabled) {
        scene.add(light1);
    }
    else {
        scene.remove(light1);
    }
};
var gui = new GUI({});
var animationsFolder = gui.addFolder("Animations");

var lighting = gui.addFolder("Lighting");
animationsFolder.open();
lighting.open();
lighting.add(lights, "enabled");
lighting.add(lights, "disabled");
var clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (modelReady)
        mixer.update(clock.getDelta());
    render();
    //stats.update();
}
function render() {
    renderer.render(scene, camera);
}
const canvas = renderer.domElement



animate();
