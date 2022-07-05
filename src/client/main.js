import * as THREE from "three";
import { DoubleSide } from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {meshLoader} from "./meshLoader.js";
import { GUI } from "dat.gui";
//boolean variables that are hooked up to the html as listeners so they change on a button click
var seamstress = false;
var cape = false;
var modelReady = false;
//animation refs
var animationActions = [];
var activeAction;
var lastAction;
var mixer
//gui elems
var gui = new GUI({});
var animationsFolder = gui.addFolder("Animations");
var shapeKeysFolder = gui.addFolder("Face controls")
//var materialsFolder = gui.addFolder("Materials");
var customContainer = document.getElementById('my-gui-container');
var switchMaterial = {unshaded: true};
//materialsFolder.add(switchMaterial, 'unshaded')
customContainer.appendChild(gui.domElement);
customContainer.hidden = true;
//Statistic elements that replace HTML
var name
var stats
var description
//loads seamstress model, cannot be made generic since models are very specific and have varying parameters
function seamstressLoader() {
	//reset GUI for bug purposes
	customContainer.hidden = false;
	animationActions = []
	gui.removeFolder(animationsFolder)
	gui.removeFolder(shapeKeysFolder)
	animationsFolder = gui.addFolder("Animations");
	shapeKeysFolder = gui.addFolder("Face controls")
	
	animationsFolder.open();
	$(gui.domElement).attr("hidden", false)
	var gltfLoader = new GLTFLoader();
	//textures
	var faceTexture = new THREE.TextureLoader().load('models/textures/toon face.png');
	faceTexture.flipY = false;
	var mainTexture = new THREE.TextureLoader().load('models/textures/clothing_Base_color.png');
	mainTexture.flipY = false;
	var hairTexture = new THREE.TextureLoader().load('models/textures/hair_Base_color.png');
	hairTexture.flipY = false;
	//materials and mapping textures
	var mainMaterial = new THREE.MeshToonMaterial({map: mainTexture});
	mainMaterial.side = DoubleSide
	var hairMaterial = new THREE.MeshToonMaterial({map: hairTexture});
	var faceMaterial = new THREE.MeshToonMaterial({map: faceTexture});
	//set the html writting elements
	name = "Development name: seamstress"
	document.getElementById("name").textContent = name
	stats = "tris = 2000 (unoptimized), 3 textures and materials with only albedo mapping used. The rig consists of all the primary bones save for facial bones and a skirt rig + hair. The model is intended for view in a toon shader as seen in the view port as well with a outline shader."
	document.getElementById("details").textContent = stats
	description = "Starting development in the month of May around the 5th and ending around the 21st this model was the first to be designed with outside input on the design. The animation and design was made with the main thought being this is going to be put into a topdown game, So lots of squash and stretch is used in the animations to clearly show movement. As for the design, It was agreed upon that the character would be a tailor/seamstress of sorts so a X mark motif is used throughout the design with a subdued color pallette of blue white and gold with orange accents to make the eyes really pop. As for the clothing, we wanted something that was exotic enough to stand out while also translating well onto the top down view so a skirt was decided upon along with baggy sleaves to sell the arm movements"
	document.getElementById("rundown").textContent = description
	//loads all the animations and sets the material to the model
	gltfLoader.load("models/mari.glb", function(gltf) {
		console.log("loaded mari default")
		gltf.scene.traverse(function(child) {
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
		//variables that are sent to the meshLoader.js 
		var mesh = gltf.scene;
		var mixer = new THREE.AnimationMixer(gltf.scene);
		//everything past here is adding in animations
		var animationAction = mixer.clipAction(gltf.animations[0]);
		animationActions.push(animationAction);
		animationsFolder.add(animations, "default");
		activeAction = animationActions[0];
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
		//load up the meshLoader.js script
		var display = meshLoader(mesh, mixer, gui)
		display;
	}, 
	function (xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}, function (error) {
		console.log(error);
	});
}
//very similar to seamstress loader but with cape model, again cannot be made generic due to specificity 
function capeLoader() {
	//gui elements to be reloaded
	animationActions = []
	gui.removeFolder(animationsFolder)
	gui.removeFolder(shapeKeysFolder)
	animationsFolder = gui.addFolder("Animations");
	shapeKeysFolder = gui.addFolder("Face controls")
	animationsFolder.open();
	customContainer.hidden = false;
	//textures
	var faceTexture = new THREE.TextureLoader().load('models/textures/plane_face.png');
	faceTexture.flipY = false;
	var mainTexture = new THREE.TextureLoader().load('models/textures/fake_shading.png');
	mainTexture.flipY = false;
	var capeTexture = new THREE.TextureLoader().load('models/textures/cape.png');
	capeTexture.flipY = false;
    var eyesTexture = new THREE.TextureLoader().load('models/textures/eye_different.png');
	eyesTexture.flipY = false;
	//materials
	var mainMaterial = new THREE.MeshToonMaterial({map: mainTexture});
	
	var capeMaterial = new THREE.MeshToonMaterial({map: capeTexture});
	var faceMaterial = new THREE.MeshToonMaterial({map: faceTexture});
	faceMaterial.side = DoubleSide
	var eyesMaterial = new THREE.MeshToonMaterial({map: eyesTexture});
	//html elements to be changed
	name = "Development name: Hooded"
	document.getElementById("name").textContent = name
	stats = "tris = 2000 (unoptimized), 4 textures and materials with only albedo mapping used. Using shape keys all the facial features are avalaible without the use of a rig. The rig itsself has all the neccesarry bones including the cape and the hair. The model is intended for view with a toon shader and outline shader as it has custom normals applied percicly for these reasons"
	document.getElementById("details").textContent = stats
	description = "Starting development near Febuary and ending development near March due to school , the model is the first project that I have worked on, on and off with the intention of making a clean model shading and texture wise. The result is close to what I wanted but not exactly, while the texturing is clean and the shading for the most part is smooth it can still be improved in parts, especially in the normals. That being said, the animations are what I am most proud of, having plenty of complicated animation made to look energetic and satisfying. This is the first time i rigged clothing and animated it and while the cape may not follow physics exactly it reacts as you would think without using any physics engine. Design wise I was just looking for something with autumn colors and cute which is where the cloak design came from à la red riding hood. This is also the first model I added shape keys for the facial expression and it is probably how I will continue to model from here on out as it is less taxing performance wise but also makes much more sense design wise especially for toon shaded models"
	document.getElementById("rundown").textContent = description
	//gltf loader
	let shapeKey
	let shapeKey_eyes
	var gltfLoader = new GLTFLoader();
	gltfLoader.load("models/Sylv.glb", function(gltf) {
		gltf.scene.traverse(function(child) {
			if (child.isMesh) {
				
				var m = child;
		
				var n = m.material;
				if (n.name == "MAIN") {
					m.material = mainMaterial;
				}
				if (n.name == "FACE") {
					m.material = faceMaterial;
					shapeKey = m
				}
				if (n.name == "CAPE") {
					m.material = capeMaterial;
				}
                if (n.name == "EYES") {
					m.material = eyesMaterial;
					shapeKey_eyes = m
				}
			}
		});
		
		//variables that are passed into meshloader.js
		mixer = new THREE.AnimationMixer(gltf.scene);
		var mesh = gltf.scene;
		//shape key controller
		let options={
			eye_close_l:0,
			eye_close_r:0,
			open_mouth:0,
			close_mouth:0.558,
			eye_down_l: 0,
			eye_down_r: 0,
			eyebrow_down_l: 0,
			eyebrow_down_r: 0,
			frown: 0,
			smile: 0,
			grin: 0,
			toungue_out: 0,
			suprised: 0,
			close_together: 0
		};
		let morphChange=()=>{
			shapeKey.morphTargetInfluences[0]=options.eye_close_l;
			shapeKey.morphTargetInfluences[1]=options.eye_close_r;
			shapeKey.morphTargetInfluences[2]=options.open_mouth;
			shapeKey.morphTargetInfluences[3]=options.close_mouth;
			shapeKey.morphTargetInfluences[4]=options.eye_down_l;
			shapeKey.morphTargetInfluences[5]=options.eye_down_r;
			shapeKey.morphTargetInfluences[6]=options.eyebrow_down_l;
			shapeKey.morphTargetInfluences[7]=options.eyebrow_down_r;
			shapeKey.morphTargetInfluences[8]=options.frown;
			shapeKey.morphTargetInfluences[9]=options.smile;
			shapeKey.morphTargetInfluences[10]=options.grin;
			shapeKey.morphTargetInfluences[11]=options.toungue_out;
			shapeKey_eyes.morphTargetInfluences[0]=options.suprised;
			shapeKey_eyes.morphTargetInfluences[1]=options.close_together;
		};
		shapeKeysFolder.add(options,'eye_close_l',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'eye_close_r',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'open_mouth',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'close_mouth',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'eye_down_l',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'eye_down_r',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'eyebrow_down_l',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'eyebrow_down_r',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'frown',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'smile',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'grin',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'toungue_out',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'suprised',0,1).onChange(morphChange);
		shapeKeysFolder.add(options,'close_together',0,1).onChange(morphChange);
		//animations past here
		var animationAction = mixer.clipAction(gltf.animations[0]);
		animationActions.push(animationAction);
		animationsFolder.add(animations, "default");
		activeAction = animationActions[0];
	
		//add an animation from another file
		gltfLoader.load("models/sylv-idle.glb", function (gltf) {
			console.log("loaded idle");
			var animationAction = mixer.clipAction(gltf.animations[0]);
			animationActions.push(animationAction);
			animationsFolder.add(animations_Hooded, "idle");
				gltfLoader.load("models/sylv-run.glb", function (gltf) {
					console.log("loaded run");
					var animationAction = mixer.clipAction(gltf.animations[0]);
					animationActions.push(animationAction);
					animationsFolder.add(animations_Hooded, "run");
						gltfLoader.load("models/sylv-sprint.glb", function (gltf) {
							console.log("loaded sprint");
							var animationAction = mixer.clipAction(gltf.animations[0]);
							animationActions.push(animationAction);
							animationsFolder.add(animations_Hooded, "sprint");
								gltfLoader.load("models/sylv-stop.glb", function (gltf) {
									console.log("loaded stop");
									var animationAction = mixer.clipAction(gltf.animations[0]);
									animationActions.push(animationAction);
									animationsFolder.add(animations_Hooded, "stop");
										gltfLoader.load("models/sylv-dash.glb", function (gltf) {
											console.log("loaded dash");
											var animationAction = mixer.clipAction(gltf.animations[0]);
											animationActions.push(animationAction);
											animationsFolder.add(animations_Hooded, "dash");
											gltfLoader.load("models/sylv-land.glb", function (gltf) {
												console.log("loaded land");
												var animationAction = mixer.clipAction(gltf.animations[0]);
												animationActions.push(animationAction);
												animationsFolder.add(animations_Hooded, "land");
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
			
		var display = meshLoader(mesh, mixer, gui)
		display;
		}, function(xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		}, function(error) {
			console.log(error);
		});
}	
//sets actions so they become active when the animation buttons on gui are pressed
var setAction = function (toAction) {
    if (toAction != activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        lastAction.fadeOut(0);
        activeAction.reset();
        activeAction.fadeIn(0);
        activeAction.play();
    }
};
// a list of animations that are added to our array and called set action to activate the gui
var animations = {
	default: function () {
        setAction(animationActions[0]);
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
    },
	sprint: function (){
		setAction(animationActions[7]);
	}
};
//another list of animations unique to hooded
var animations_Hooded = {
	default: function () {
        setAction(animationActions[0]);
    },
    idle: function () {
        setAction(animationActions[1]);
    },
    run: function () {
        setAction(animationActions[2]);
    },
    sprint: function () {
        setAction(animationActions[3]);
    },
    stop: function () {
        setAction(animationActions[4]);
    },
    dash: function () {
        setAction(animationActions[5]);
    },
    land: function () {
        setAction(animationActions[6]);
    }
};
//here is where we listen to the html elements and on click load the model
document.getElementById("seamstress").addEventListener("click",function(){
	seamstress = true;
	cape = false;
	seamstressLoader();
	
})
document.getElementById("hood").addEventListener("click",function(){
	seamstress = false;
	cape = true;
	capeLoader();
})


