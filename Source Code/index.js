import { Scene, Shape, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

// Global Variables
function globalInit()
{
	window.viewMatrix = mat4.create();
	window.projMatrix = mat4.create();
	window.eye = [3,3,3];
	window.up = [0,1,0];
	mat4.lookAt(viewMatrix,eye,[0,0,0],up);
	mat4.perspective(projMatrix,45*Math.PI/180,1,0.1,1000);
}
globalInit();

const gui = new dat.GUI();

let transformSettings = {
	translateX: 0.0,
	rotationAngle: 0.0
}

// Don't use .then use await
async function importingObjFiles(name)
{
	let data = await fetch('./models/'+name);
	data = await data.text();
	let meshdata = await new objLoader.Mesh(data);
	return meshdata;
}

let arrow_x = await importingObjFiles("arrow.obj");
let arrow_y = await importingObjFiles("arrow.obj");
let arrow_z = await importingObjFiles("arrow.obj");
let object1 = await importingObjFiles("Object1.obj");
let object2 = await importingObjFiles("Object2.obj");

let render_X = 600;
let render_Y = 600;
let m = 0;

let scene = new Scene();
AddElementsToScene(scene);

// Renderer generation
const renderer = new WebGLRenderer();
renderer.setSize( render_X, render_Y );
document.body.appendChild( renderer.domElement );

// Generating shader and drawing the shapes on the canvas
const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();
renderer.setAnimationLoop( animation );
function animation()
{
	renderer.clear(0.8,0.8,0.8,1);
	renderer.render(scene, shader,m);
}

function AddElementsToScene(scene)
{
	const arrowX = new Shape(arrow_x,[1,0,0,1],false,"ArrowX");
	scene.add(arrowX);

	const arrowY = new Shape(arrow_y,[0,1,0,1],false,"ArrowY");
	let current = arrowY.transform.getRotationAngleZ();
	current += 3.142/2;
	arrowY.transform.setRotationAngleZ(current);
	scene.add(arrowY);

	const arrowZ = new Shape(arrow_z,[0,0,1,1],false,"ArrowZ");
	current = arrowZ.transform.getRotationAngleY();
	current -= 3.142/2;
	arrowZ.transform.setRotationAngleY(current);
	scene.add(arrowZ);

	const monkeyWithCap = new Shape(object1,[0.2,0.4,0.3,1],true,"Monkey With a cap");
	
	current = monkeyWithCap.transform.getScale().slice();
	current[0] -= 0.75;
	current[1] -= 0.75;
	current[2] -= 0.75;
	monkeyWithCap.transform.setScale(current);

	current = monkeyWithCap.transform.getTranslateX();
	console.log(current);
	current[0] -= 1;
	monkeyWithCap.transform.setTranslateX(current);
	
	scene.add(monkeyWithCap);

	const ballWithRing = new Shape(object2,[0.5,0.5,1,1],true,"Ball With Ring");
	
	current = ballWithRing.transform.getTranslateX();
	console.log(current);
	current[0] += 1;
	ballWithRing.transform.setTranslateX(current);
	
	scene.add(ballWithRing);

}

// Canvas created
// Adding Events to it
let canvas = renderer.domElement;
let nearestShape = scene.primitives[0];
canvas.addEventListener('mousedown', function(event){ onmousedown(event);});
const data = new Uint8Array(4);

let gl = renderer.gl;
let mouseX = -1;
let mouseY = -1;

function onmousedown(event)
{
	const rect = canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
	const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

	renderer.render(scene,shader);
	renderer.gl.readPixels(
		pixelX,            // x
		pixelY,            // y
		1,                 // width
		1,                 // height
		gl.RGBA,           // format
		gl.UNSIGNED_BYTE,  // type
		data);             // typed array to hold result

	let temp = nearestShape;
	nearestShape = scene.selectionByColor(data);

	if(temp != undefined)
		temp.color = temp.original_color;

	if(nearestShape == undefined)
		console.log("No shape selected");
	else
	{
		nearestShape.color = [0.1,0.1,0.1,1];
		console.log(nearestShape.name);
	}
}

gui.add(transformSettings, 'translateX', -1.0, 1.0).step(0.01).onChange(function ()
{
	let current = nearestShape.transform.getTranslateX().slice();
	current[0] = transformSettings.translateX;
	nearestShape.transform.setTranslateX(current,scene);
});

gui.add(transformSettings, 'rotationAngle', -Math.PI, Math.PI).step(0.01).onChange(function ()
{
	let current = nearestShape.transform.getRotationAngle();
	current = transformSettings.rotationAngle;
	nearestShape.transform.setRotationAngle(current);
});

document.addEventListener('keydown', (event) =>
{
	let key = event.key;

	if(key == 'ArrowUp')
	{
		let current = nearestShape.transform.getTranslate().slice();
		current[1] += 0.1;
		nearestShape.transform.setTranslate(current,scene);
	}
	else if(key == 'ArrowDown')
	{
		let current = nearestShape.transform.getTranslate().slice();
		current[1] -= 0.1;
		nearestShape.transform.setTranslate(current,scene);
	}
	else if(key == 'ArrowLeft')
	{
		let current = nearestShape.transform.getTranslate().slice();
		current[0] -= 0.1;
		nearestShape.transform.setTranslate(current,scene);
	}
	else if(key == 'ArrowRight')
	{
		let current = nearestShape.transform.getTranslate().slice();
		current[0] += 0.1;
		nearestShape.transform.setTranslate(current,scene);
	}
	else if(key == '/')
	{
		let current = nearestShape.transform.getRotationAngle();
		current += 3.142/30;
		nearestShape.transform.setRotationAngle(current);
	}
	else if(key == "\\")
	{
		let current = nearestShape.transform.getRotationAngle();
		current -= 3.142/30;
		nearestShape.transform.setRotationAngle(current);
	}
	else if(key == '+')
	{
		let current = nearestShape.transform.getScale().slice();
		current[0] += 0.1;
		current[1] += 0.1;
		current[2] += 0.1;
		nearestShape.transform.setScale(current);
	}
	else if(key == "-")
	{
		let current = nearestShape.transform.getScale().slice();
		current[0] -= 0.1;
		current[1] -= 0.1;
		current[2] -= 0.1;
		nearestShape.transform.setScale(current);
	}
  }, false);