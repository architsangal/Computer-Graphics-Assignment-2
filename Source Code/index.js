import { Scene, Shape, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader'; 

// Don't use .then use await
async function arrow_info()
{
	let data = await fetch('./models/cube2.obj');
	data = await data.text();
	let meshdata = await new objLoader.Mesh(data);
	return meshdata;
}
let arrow_mesh_obj = await arrow_info();

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
	const arrow = new Shape(arrow_mesh_obj,[1,0.647,0,1],"Arrow");
	scene.add(arrow);
}

let nearestShape = scene.primitives[0];

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
