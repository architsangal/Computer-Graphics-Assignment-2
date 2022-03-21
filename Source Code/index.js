import { Scene, Shape, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3, vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

// Global Variables
function globalInit()
{
	window.viewMatrix = mat4.create();
	window.projMatrix = mat4.create();
	
	window.click_m2 = 0;
	window.last_mouse_location = -1;

	window.eye = vec3.create();
	vec3.set(window.eye, 0, 0, 3);

	window.CameraRotationAxis = 'y';

	window.up = [0,1,0];
	mat4.lookAt(viewMatrix,eye,[0,0,0],up);
	mat4.perspective(projMatrix,45*Math.PI/180,1,0.1,1000);
}
globalInit();

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

let render_X = 800;
let render_Y = 800;
let m = 1;

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
	renderer.render(scene, shader);
}

function AddElementsToScene(scene)
{
	const arrowX = new Shape(arrow_x,[1,0,0,1],false,"ArrowX");
	let current = arrowX.transform.getScale();
	current[0] += 2;
	current[1] += 2;
	current[2] += 2;
	arrowX.transform.setScale(current);
	scene.add(arrowX);

	const arrowY = new Shape(arrow_y,[0,1,0,1],false,"ArrowY");
	current = arrowY.transform.getScale();
	current[0] += 2;
	current[1] += 2;
	current[2] += 2;
	arrowY.transform.setScale(current);
	
	current = arrowY.transform.getRotationAngleZ();
	current += 3.142/2;
	arrowY.transform.setRotationAngleZ(current);
	scene.add(arrowY);

	const arrowZ = new Shape(arrow_z,[0,0,1,1],false,"ArrowZ");
	current = arrowZ.transform.getScale();
	current[0] += 2;
	current[1] += 2;
	current[2] += 2;
	arrowZ.transform.setScale(current);
	
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
	current[0] -= 1;
	monkeyWithCap.transform.setTranslateX(current);
	
	scene.add(monkeyWithCap);

	const ballWithRing = new Shape(object2,[0.5,0.5,1,1],true,"Ball With Ring");
	
	current = ballWithRing.transform.getTranslateX();
	current[0] += 1;
	ballWithRing.transform.setTranslateX(current);
	
	scene.add(ballWithRing);

}

// Canvas created
// Adding Events to it
let canvas = renderer.domElement;
let nearestShape;
canvas.addEventListener('mousedown', function(event){ onmousedown(event);});
const data = new Uint8Array(4);

let gl = renderer.gl;
let mouseX = -1;
let mouseY = -1;

function onmousedown(event)
{
	if(m == 1)
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
	else
	{
		if(click_m2 == 0)
			click_m2 = 1;
		else
			click_m2 = 0;
		last_mouse_location = event.clientX;
	}
}

document.addEventListener('keydown', (event) =>
{
	let key = event.key;

	if(key == 'm')
	{
		if(m==1)
		{
			m=2;
			window.eye = [3,3,3];
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
		else
		{
			m=1;
			window.eye = [0,0,3];
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
		console.log(m);
	}
	else if(key == 'ArrowUp')
	{
		let current = nearestShape.transform.getTranslateY().slice();
		current[1] += 0.1;
		nearestShape.transform.setTranslateY(current);
	}
	else if(key == 'ArrowDown')
	{
		let current = nearestShape.transform.getTranslateY().slice();
		current[1] -= 0.1;
		nearestShape.transform.setTranslateY(current);
	}
	else if(key == 'ArrowLeft')
	{
		let current = nearestShape.transform.getTranslateX().slice();
		current[0] -= 0.1;
		nearestShape.transform.setTranslateX(current);
	}
	else if(key == 'ArrowRight')
	{
		let current = nearestShape.transform.getTranslateX().slice();
		current[0] += 0.1;
		nearestShape.transform.setTranslateX(current);
	}
	else if(key == 'o')
	{
		let current = nearestShape.transform.getTranslateZ().slice();
		current[2] -= 0.1;
		nearestShape.transform.setTranslateZ(current);
	}
	else if(key == 'p')
	{
		let current = nearestShape.transform.getTranslateZ().slice();
		current[2] += 0.1;
		nearestShape.transform.setTranslateZ(current);
	}
	else if(key == 'q')
	{
		let current = nearestShape.transform.getRotationAngleX();
		current += 3.142/30;
		nearestShape.transform.setRotationAngleX(current);
	}
	else if(key == "w")
	{
		let current = nearestShape.transform.getRotationAngleX();
		current -= 3.142/30;
		nearestShape.transform.setRotationAngleX(current);
	}
	else if(key == 'a')
	{
		let current = nearestShape.transform.getRotationAngleY();
		current += 3.142/30;
		nearestShape.transform.setRotationAngleY(current);
	}
	else if(key == "s")
	{
		let current = nearestShape.transform.getRotationAngleY();
		current -= 3.142/30;
		nearestShape.transform.setRotationAngleY(current);
	}
	else if(key == 'z')
	{
		let current = nearestShape.transform.getRotationAngleZ();
		current += 3.142/30;
		nearestShape.transform.setRotationAngleZ(current);
	}
	else if(key == "x")
	{
		let current = nearestShape.transform.getRotationAngleZ();
		current -= 3.142/30;
		nearestShape.transform.setRotationAngleZ(current);
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
	else if(key == '[')
	{
		if(m==1)
		{
			window.eye[2] -= 0.1;
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
		else
		{
			window.eye[0] -= 0.1;
			window.eye[1] -= 0.1;
			window.eye[2] -= 0.1;
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
	}
	else if(key == "]")
	{
		if(m==1)
		{
			window.eye[2] += 0.1;
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
		else
		{
			window.eye[0] += 0.1;
			window.eye[1] += 0.1;
			window.eye[2] += 0.1;
			mat4.lookAt(viewMatrix,eye,[0,0,0],up);
		}
	}
	else if(key == "j")
	{
		window.CameraRotationAxis = 'x';
	}
	else if(key == "k")
	{
		window.CameraRotationAxis = 'y';
	}
	else if(key == "l")
	{
		window.CameraRotationAxis = 'z';
	}
  }, false);

canvas.addEventListener('mousemove', (event) =>
{
	if(m == 2 && click_m2 == 1)
	{
		let rotationAngleAboutAxis = -0.25 * (Math.PI/ 180) * (event.clientX - last_mouse_location);
		// (event.clientX - last_mouse_location) is the displacement. It can be negative and positive.

		rotateCameraAboutAxis(rotationAngleAboutAxis);
		last_mouse_location = event.clientX;
	}
});

function rotateCameraAboutAxis(rotationAngle){
	
	let axisVector;
	if(CameraRotationAxis == 'x')
		axisVector = [1,0,0];
	else if(CameraRotationAxis == 'y')
		axisVector = [0,1,0];
	else
		axisVector = [0,0,1];

	let transMat = mat4.create();
	mat4.identity(transMat);

	let eye_homo_dim = [eye[0],eye[1],eye[2],1];

	mat4.rotate(transMat, transMat, rotationAngle, axisVector);
	vec4.transformMat4(eye_homo_dim,eye_homo_dim,transMat);
	eye = eye_homo_dim.slice();

	let up_homo_dim = [up[0],up[1],up[2],1];
	mat4.identity(transMat);
	mat4.rotate(transMat, transMat, rotationAngle, axisVector);
	vec4.transformMat4(up_homo_dim,up_homo_dim,transMat);
	up = up_homo_dim.slice();

	mat4.lookAt(viewMatrix,eye,[0,0,0],up);
	mat4.perspective(projMatrix,45*Math.PI/180,1,0.1,1000);
}
