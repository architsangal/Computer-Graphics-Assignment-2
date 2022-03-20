import { Scene, Shape, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

// Global Variables
window.viewMatrix = mat4.create();
window.projMatrix = mat4.create();
window.eye = [0,1,4];
window.up = [0,1,1];
mat4.lookAt(viewMatrix,eye,[0,0,0],up);
mat4.perspective(projMatrix,45*Math.PI/180,1,0.1,1000);

const gui = new dat.GUI();

let transformSettings = {
	translateX: 0.0,
	rotationAngle: 0.0
}

// Don't use .then use await
async function arrow_info()
{
	let data = await fetch('./models/arrow.obj');
	data = await data.text();
	let meshdata = await new objLoader.Mesh(data);
	return meshdata;
}
let arrow_x = await arrow_info();
let arrow_y = await arrow_info();
let arrow_z = await arrow_info();

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
	const arrowX = new Shape(arrow_x,[1,0,0,1],"ArrowX");
	scene.add(arrowX);

	const arrowY = new Shape(arrow_y,[1,0,1,1],"ArrowY");
	scene.add(arrowY);

	const arrowZ = new Shape(arrow_z,[1,1,0,1],"ArrowZ");
	scene.add(arrowZ);
}

// gl.canvas.addEventListener('mousemove', (e) => {
// 	const rect = canvas.getBoundingClientRect();
// 	mouseX = e.clientX - rect.left;
// 	mouseY = e.clientY - rect.top;
//  });

// const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
// const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;
// const data = new Uint8Array(4);
// gl.readPixels(
//     pixelX,            // x
//     pixelY,            // y
//     1,                 // width
//     1,                 // height
//     gl.RGBA,           // format
//     gl.UNSIGNED_BYTE,  // type
//     data);             // typed array to hold result

let nearestShape = scene.primitives[0];

gui.add(transformSettings, 'translateX', -1.0, 1.0).step(0.01).onChange(function ()
{
	let current = nearestShape.transform.getTranslate().slice();
	current[0] = transformSettings.translateX;
	nearestShape.transform.setTranslate(current,scene);
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
		current += 3.142/300;
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

// Canvas created
// Adding Events to it
let canvas = renderer.domElement;

canvas.addEventListener('mousedown', function(event){ onmousedown(event);});
function onmousedown(event)
{
	if(m == 1)
	{
		let revX = (event.clientX-render_X)/render_X*2-1;
		let revY = -event.clientY/render_Y*2+1;
		nearestShape = scene.getNearestShape(revX,revY,0);
		console.log(nearestShape.name);
	}
}



// function check()
// {
// 	let edges = scene.borderVertex();
// 	let f=0;
// 	edges.forEach(function(element){
// 		if((element<=1 && element>=-1) == false)
// 		{
// 			f=1;
// 		}
// 	});

// 	if(f==1)
// 		return false;
// 	else
// 		return true;
// }
