import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import meshLoader from "./meshLoader.js";
//boolean variables that are hooked up to the html as listeners so they change on a button click
var seamstress = false;
var cape = false;
//loads seamstress model, cannot be made generic since models are very specific and have varying parameters
function seamstressLoader() {
	var gltfLoader = new GLTFLoader();
	var mainMaterial = new THREE.MeshToonMaterial();
	var hairMaterial = new THREE.MeshToonMaterial();
    var faceMaterial = new THREE.MeshToonMaterial();

	var faceTexture = new THREE.TextureLoader().load('models/toon face.png');
	faceTexture.flipY = false;
	
	var mainTexture = new THREE.TextureLoader().load('models/clothing_Base_color.png');
	mainTexture.flipY = false;
	var hairTexture = new THREE.TextureLoader().load('models/hair_Base_color.png');
	hairTexture.flipY = false;

	mainMaterial.map = mainTexture;
	hairMaterial.map = hairTexture;
	faceMaterial.map = faceTexture;

	gltfLoader.load("models/mari.glb", function(gltf) {

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
		var mesh = gltf.scene;
		var display = meshLoader(mesh)
		display;
		console.log(mesh)
	}, function(xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}, function(error) {
		console.log(error);
	});

}
//very similar to seamstress loader but with cape model, again cannot be made generic due to specificity 
function capeLoader() {
	var gltfLoader = new GLTFLoader();

	var mainMaterial = new THREE.MeshToonMaterial();
	var capeMaterial = new THREE.MeshToonMaterial();
    var faceMaterial = new THREE.MeshToonMaterial();
    var eyesMaterial = new THREE.MeshToonMaterial();

	var faceTexture = new THREE.TextureLoader().load('models/plane_face.png');
	faceTexture.flipY = false;
	
	var mainTexture = new THREE.TextureLoader().load('models/fake_shading.png');
	mainTexture.flipY = false;

	var capeTexture = new THREE.TextureLoader().load('models/cape.png');
	capeTexture.flipY = false;

    var eyesTexture = new THREE.TextureLoader().load('models/eye_different.png');
	eyesTexture.flipY = false;

	mainMaterial.map = mainTexture;
	capeMaterial.map = capeTexture;
	faceMaterial.map = faceTexture;
    eyesMaterial.map = eyesTexture;
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
				}
				if (n.name == "CAPE") {
					m.material = capeMaterial;
				}
                if (n.name == "EYES") {
					m.material = eyesMaterial;
				}
			}
		});
		var mesh = gltf.scene;
		var display = meshLoader(mesh)
		display;
		console.log(mesh)
	}, function(xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}, function(error) {
		console.log(error);
	});

}

seamstress = true;

if (seamstress){
    seamstressLoader();
}
else if (cape){
    capeLoader();
}

