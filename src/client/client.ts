import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";


const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.PointLight(0xdb7dd5, 0.5);
light1.position.set(1.5, 2.5, 2.5);

const ambientLight = new THREE.AmbientLight(0xdb7dd5, 0.4);
ambientLight.position.set(0,0,0);

scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

let mixer: THREE.AnimationMixer;
let modelReady = false;
const animationActions: THREE.AnimationAction[] = [];
let activeAction: THREE.AnimationAction;
let lastAction: THREE.AnimationAction;
const gltfLoader = new GLTFLoader();
const mainMaterial: THREE.MeshToonMaterial = new THREE.MeshToonMaterial()
const hairMaterial: THREE.MeshToonMaterial = new THREE.MeshToonMaterial()
const faceMaterial: THREE.MeshToonMaterial = new THREE.MeshToonMaterial()

const mainTexture = new THREE.TextureLoader().load('models/clothing_Base_color.png');
mainTexture.encoding = THREE.sRGBEncoding;
mainTexture.flipY = false;
const hairTexture = new THREE.TextureLoader().load('models/hair_Base_color.png')
hairTexture.encoding = THREE.sRGBEncoding;
hairTexture.flipY = false;
const faceTexture = new THREE.TextureLoader().load('models/toon face.png')
faceTexture.encoding = THREE.sRGBEncoding;
faceTexture.flipY = false;

mainMaterial.map = mainTexture;
hairMaterial.map = hairTexture;
faceMaterial.map = faceTexture;
gltfLoader.load(
  "models/mari.glb",
  (gltf) => {

    gltf.scene.traverse(function(child){
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh
        let n = m.material as THREE.Material
        if(n.name == "MAIN"){
          m.material = mainMaterial
        }
        if(n.name == "FACE"){
          m.material = faceMaterial
        }
        if(n.name == "HAIR"){
          m.material = hairMaterial
        }
      }})
    // gltf.scene.scale.set(.01, .01, .01)

    mixer = new THREE.AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction((gltf as any).animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];

    scene.add(gltf.scene);
    gltf.parser.getDependencies('material').then((materials) =>{
      //materials[0] = mainMaterial
      //console.log(materials[0])
    })
    
    //add an animation from another file
    gltfLoader.load(
      "models/mari-idle.glb",
      (gltf) => {
        console.log("loaded idle");
        const animationAction = mixer.clipAction((gltf as any).animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "idle");
        
        //add an animation from another file
        gltfLoader.load(
          "models/mari-run.glb",
          (gltf) => {
            console.log("run");
            const animationAction = mixer.clipAction(
              (gltf as any).animations[0]
            );
            animationActions.push(animationAction);
            animationsFolder.add(animations, "run");
 

            //add an animation from another file
            gltfLoader.load(
              "models/mari-throw.glb",
              (gltf) => {
                console.log("loaded throw");
                (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                const animationAction = mixer.clipAction(
                  (gltf as any).animations[0]
                );
                animationActions.push(animationAction);
                animationsFolder.add(animations, "spin_throw");

                modelReady = true;

                gltfLoader.load(
                  "models/mari-attack.glb",
                  (gltf) => {
                    console.log("loaded attack");
                    (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                    const animationAction = mixer.clipAction(
                      (gltf as any).animations[0]
                    );
                    animationActions.push(animationAction);
                    animationsFolder.add(animations, "attack");

                    modelReady = true;

                    gltfLoader.load(
                      "models/mari-dash.glb",
                      (gltf) => {
                        console.log("loaded dash");
                        (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                        const animationAction = mixer.clipAction(
                          (gltf as any).animations[0]
                        );
                        animationActions.push(animationAction);
                        animationsFolder.add(animations, "dash");

                        modelReady = true;

                        gltfLoader.load(
                          "models/mari-snap.glb",
                          (gltf) => {
                            console.log("loaded snap");
                            (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                            const animationAction = mixer.clipAction(
                              (gltf as any).animations[0]
                            );
                            animationActions.push(animationAction);
                            animationsFolder.add(animations, "snap");

                            modelReady = true;
                          },
                          (xhr) => {
                            console.log(
                              (xhr.loaded / xhr.total) * 100 + "% loaded"
                            );
                          },
                          (error) => {
                            console.log(error);
                          }
                        );
                      },

                      (xhr) => {
                        console.log(
                          (xhr.loaded / xhr.total) * 100 + "% loaded"
                        );
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                  },
                  (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const animations = {
  default: function () {
    setAction(animationActions[0]);
    scene.traverse((node) => {
      if (node.type = "SkinnedMesh"){
        console.log(node.getObjectByName("KaoruSakaki-Head012"))
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

const setAction = (toAction: THREE.AnimationAction) => {
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
const lights = {
  enabled: function () {
    setLight(true);
  },
  disabled: function () {
    setLight(false);
  },
};
const setLight = (enabled: boolean) => {
  if (enabled) {
    scene.add(light1);
  } else {
    scene.remove(light1);
  }
};

const gui = new GUI();
const animationsFolder = gui.addFolder("Animations");
const lighting = gui.addFolder("Lighting");
animationsFolder.open();
lighting.open();
lighting.add(lights, "enabled");
lighting.add(lights, "disabled");
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (modelReady) mixer.update(clock.getDelta());

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
