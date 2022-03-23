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

	window.animationMode = 0;
	window.t=0;
	window.numClicks = 0;
	window.p0;
	window.p1;
	window.p2;
	window.speed = 0.005;
}
globalInit();

// Don't use .then use await
async function importingObjFiles(name)
{
	let data = await fetch('./models/'+name);
	data = await data.text();
	let meshdata = await new objLoader.Mesh(data);
	return meshdata;
}

let arrow_x = await importingObjFiles("DoubleSidedArrow.obj");
let arrow_y = await importingObjFiles("DoubleSidedArrow.obj");
let arrow_z = await importingObjFiles("DoubleSidedArrow.obj");
let object1 = await importingObjFiles("Object1.obj");
let object2 = await importingObjFiles("Object2.obj");
let object3 = await importingObjFiles("Object3.obj");

let render_X = 800;
let render_Y = 800;
let m = 1;

let scene = new Scene();
AddElementsToScene(scene);
let nearestShape;

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
	animatingSelectedObject()
}

function AddElementsToScene(scene)
{
	const arrowY = new Shape(arrow_y,[0,1,0,1],false,"ArrowY");
	let current = arrowY.transform.getScale();
	current[0] += 2;
	current[1] += 2;
	current[2] += 2;
	arrowY.transform.setScale(current);
	
	current = arrowY.transform.getRotationAngleZ();
	current += 3.142/2;
	arrowY.transform.setRotationAngleZ(current);
	scene.add(arrowY);

	const arrowX = new Shape(arrow_x,[1,0,0,1],false,"ArrowX");
	current = arrowX.transform.getScale();
	current[0] += 2;
	current[1] += 2;
	current[2] += 2;
	arrowX.transform.setScale(current);
	scene.add(arrowX);

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

	const diff_obj = new Shape(object3,[0.5,0.5,0.5,1],true,"Object 3");
	
	current = diff_obj.transform.getTranslateX();
	current[0] += 0.5;
	diff_obj.transform.setTranslateX(current);

	current = diff_obj.transform.getTranslateY();
	current[1] += 0.5;
	diff_obj.transform.setTranslateY(current);

	current = diff_obj.transform.getScale().slice();
	current[0] -= 0.9;
	current[1] -= 0.9;
	current[2] -= 0.9;
	diff_obj.transform.setScale(current);

	scene.add(diff_obj);

}

// Canvas created
// Adding Events to it
let canvas = renderer.domElement;
canvas.addEventListener('mousedown', function(event){ onmousedown(event);});
const data = new Uint8Array(4);

let gl = renderer.gl;
let mouseX = -1;
let mouseY = -1;

function onmousedown(event)
{
	if(m == 1 && animationMode == 0)
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
			console.log(nearestShape.centroid());
		}
	}
	else if(m==1 && animationMode == 1)
	{
		if(numClicks == 0)
		{
			numClicks++;

			//nearestShape.centroid(); is not accurate so we will use location of the figure
			let translate_init = nearestShape.transform.getTranslateX().slice();
			translate_init[1] = nearestShape.transform.getTranslateY()[1];
			translate_init[2] = nearestShape.transform.getTranslateZ()[2];
			window.p0 = translate_init;
			
			window.p1 = mouseToWorld([event.clientX,event.clientY]);
		}
		else if(numClicks == 1)
		{
			numClicks = 0;
			window.p2 = mouseToWorld([event.clientX,event.clientY]);
		}
	}
	else if(m==2)
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
	else if(key == "y")
	{
		if(m==1)
		{
			if(animationMode == 0)
				animationMode = 1;
			else
				animationMode = 0;
		}
	}
	else if(key == "1")
	{
		window.speed -= 0.001;
	}
	else if(key == "2")
	{
		window.speed += 0.001;
	}
  }, false);

canvas.addEventListener('mousemove', (event) =>
{
	if(m == 2 && click_m2 == 1)
	{
		let rotationAngleAboutAxis = -0.004 * (event.clientX - last_mouse_location);
		// (event.clientX - last_mouse_location) is the displacement. It can be negative and positive.
		// -0.004 is a scaling factor of rotation

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

function clipToWorld(point)
{
	let viewProjMat = mat4.create();
	mat4.multiply(viewProjMat,projMatrix,viewMatrix);

	let invViewProjMat = mat4.create();
	mat4.invert(invViewProjMat,viewProjMat);

	let pointIn3D = vec3.fromValues(point[0],point[1],0.934);
	let worldCoor = vec3.create();

	vec3.transformMat4(worldCoor,pointIn3D,invViewProjMat);

	return worldCoor;
}

// canvas.addEventListener('mousedown', function(event)
// {
// 	worldClick(event);
// }
// );

// // testing function given by amit tomar
// function worldClick(event)
// {
// 	// console.log(nearestShape.centroid())
// 	console.log((event.clientX)/render_X*2-1 + " " + (-event.clientY/render_Y*2+1));
// 	console.log(clipToWorld([(event.clientX)/render_X*2-1,-event.clientY/render_Y*2+1]));
	
// 	let tempX = nearestShape.transform.getTranslateX();
// 	let tempY = nearestShape.transform.getTranslateY();
// 	let tempZ = nearestShape.transform.getTranslateZ();

// 	let worldCoor = clipToWorld([(event.clientX)/render_X*2-1,-event.clientY/render_Y*2+1]);

// 	tempX[0] = worldCoor[0];
// 	tempY[1] = worldCoor[1];
// 	tempZ[2] = worldCoor[2];
	
// 	nearestShape.transform.setTranslateX(tempX);
// 	nearestShape.transform.setTranslateY(tempY);
// 	nearestShape.transform.setTranslateZ(tempZ);
// 	// nearestShape.transform.translate = worldCoor;
// }

function mouseToWorld(mouse)
{
	return clipToWorld([(mouse[0])/render_X*2-1,-mouse[1]/render_Y*2+1]);
}

function animatingSelectedObject()
{
	if(nearestShape == undefined)
		return;
	if(window.p0 == undefined || window.p1 == undefined || window.p2 == undefined)
		return;
	if(animationMode == 0)
		return;
	else if(animationMode == 1)
	{
		if(t<1)
		{
			let a_x = 2*window.p0[0] + 2*window.p2[0] - 4*window.p1[0];
			let b_x = 4*window.p1[0] -   window.p2[0] - 3*window.p0[0];
			let c_x = window.p0[0];

			let a_y = 2*window.p0[1] + 2*window.p2[1] - 4*window.p1[1];
			let b_y = 4*window.p1[1] -   window.p2[1] - 3*window.p0[1];
			let c_y = window.p0[1];

			let a_z = 2*window.p0[2] + 2*window.p2[2] - 4*window.p1[2];
			let b_z = 4*window.p1[2] -   window.p2[2] - 3*window.p0[2];
			let c_z = window.p0[2];

			let tempX = nearestShape.transform.getTranslateX();
			let tempY = nearestShape.transform.getTranslateY();
			let tempZ = nearestShape.transform.getTranslateZ();

			tempX[0] = a_x * t * t + b_x * t + c_x;
			tempY[1] = a_y * t * t + b_y * t + c_y;
			tempZ[2] = a_z * t * t + b_z * t + c_z;
	
			nearestShape.transform.setTranslateX(tempX);
			nearestShape.transform.setTranslateY(tempY);
			nearestShape.transform.setTranslateZ(tempZ);

			t += window.speed;
		}
		else
		{
			t=0;
			animationMode = 0;
			if(nearestShape != undefined)
				nearestShape.color = nearestShape.original_color;
			nearestShape = undefined;
			window.p0 = undefined;
			window.p1 = undefined;
			window.p2 = undefined;
		}
	}
}