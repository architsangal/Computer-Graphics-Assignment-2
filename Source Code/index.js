import { Scene, Shape, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader'; 
// import { vec3, mat4, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

// Don't use .then use await
async function arrow_info()
{
	let data = await fetch('./models/arrow.obj');
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
for(let i=0;i<scene.primitives.length;i++)
{
	let current = scene.primitives[i].transform.getTranslate().slice();
	current[1] += Math.random()-0.5;
	scene.primitives[i].transform.setTranslate(current,scene);
}


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
	// Generating Elements (Shapes)
	// console.log(arrow_mesh_obj);

	const arrow = new Shape(arrow_mesh_obj,[1,0.647,0,1],"Arrow");
	scene.add(arrow);

	// let coordinates_large_triangle_1 = [
	// 	0.0,0.0,0.0,
	// 	-0.5,0.5,0.0,
	// 	0.5,0.5,0.0,
	// ]
	// const largeTriangle1 = new Triangle(coordinates_large_triangle_1,[1,0.647,0,1],"Large Triangle 1");
	// scene.add(largeTriangle1);
}

let nearestShape = scene.primitives[0];

function check()
{
	let edges = scene.borderVertex();
	let f=0;
	edges.forEach(function(element){
		if((element<=1 && element>=-1) == false)
		{
			f=1;
		}
	});

	if(f==1)
		return false;
	else
		return true;
}

document.addEventListener('keydown', (event) => {
	let key = event.key;
	if(key == 'm')
	{
		m++;
		m = m%4;
		console.log("m =",m);

		if(m == 0)
		{
			AddElementsToScene(scene);
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getTranslate().slice();
				current[1] += Math.random()-0.5;
				scene.primitives[i].transform.setTranslate(current,scene);
			}
			
		}
		else if(m == 1)
		{
		}
		else if(m == 2)
		{
			let centroid = scene.centroid();
			for(let i=0;i<scene.primitives.length;i++)
			{
				scene.primitives[i].transform.setCompleteCentroid(centroid);
			}

			for(let i=0;i<100;i++)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getScale_m2().slice();
					current[0] += 0.1;
					current[1] += 0.1;
					scene.primitives[i].transform.setScale_m2(current);
				}
				if(check() == false)
				{
					for(let i=0;i<scene.primitives.length;i++)
					{
						let current = scene.primitives[i].transform.getScale_m2().slice();
						current[0] -= 0.1;
						current[1] -= 0.1;
						scene.primitives[i].transform.setScale_m2(current);
					}					
				}
			}
		}
		else
		{
			scene = new Scene();
		}
	}
	else if(key == 'ArrowUp')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getTranslate().slice();
			current[1] += 0.1;
			nearestShape.transform.setTranslate(current,scene);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getTranslate_m2().slice();
				current[1] += 0.1;
				scene.primitives[i].transform.setTranslate_m2(current,scene);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getTranslate_m2().slice();
					current[1] -= 0.1;
					scene.primitives[i].transform.setTranslate_m2(current,scene);
				}
			}
		}
	}
	else if(key == 'ArrowDown')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getTranslate().slice();
			current[1] -= 0.1;
			nearestShape.transform.setTranslate(current,scene);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getTranslate_m2().slice();
				current[1] -= 0.1;
				scene.primitives[i].transform.setTranslate_m2(current,scene);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getTranslate_m2().slice();
					current[1] += 0.1;
					scene.primitives[i].transform.setTranslate_m2(current,scene);
				}	
			}
		}
	}
	else if(key == 'ArrowLeft')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getTranslate().slice();
			current[0] -= 0.1;
			nearestShape.transform.setTranslate(current,scene);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getTranslate_m2().slice();
				current[0] -= 0.1;
				scene.primitives[i].transform.setTranslate_m2(current,scene);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getTranslate_m2().slice();
					current[0] += 0.1;
					scene.primitives[i].transform.setTranslate_m2(current,scene);
				}
			}
		}
	}
	else if(key == 'ArrowRight')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getTranslate().slice();
			current[0] += 0.1;
			nearestShape.transform.setTranslate(current,scene);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getTranslate_m2().slice();
				current[0] += 0.1;
				scene.primitives[i].transform.setTranslate_m2(current,scene);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getTranslate_m2().slice();
					current[0] -= 0.1;
					scene.primitives[i].transform.setTranslate_m2(current,scene);
				}	
			}
		}
	}
	else if(key == '/')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getRotationAngle();
			current += 3.142/30;
			nearestShape.transform.setRotationAngle(current);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getRotationAngle_m2();
				current += 3.142/30;
				scene.primitives[i].transform.setRotationAngle_m2(current);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getRotationAngle_m2();
					current -= 3.142/30;
					scene.primitives[i].transform.setRotationAngle_m2(current);
				}	
			}
		}
	}
	else if(key == "\\")
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getRotationAngle();
			current -= 3.142/30;
			nearestShape.transform.setRotationAngle(current);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getRotationAngle_m2();
				current -= 3.142/30;
				scene.primitives[i].transform.setRotationAngle_m2(current);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getRotationAngle_m2();
					current += 3.142/30;
					scene.primitives[i].transform.setRotationAngle_m2(current);
				}	
			}
		}
	}
	else if(key == '+')
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getScale().slice();
			current[0] += 0.1;
			current[1] += 0.1;
			nearestShape.transform.setScale(current);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getScale_m2().slice();
				current[0] += 0.1;
				current[1] += 0.1;
				scene.primitives[i].transform.setScale_m2(current);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getScale_m2().slice();
					current[0] -= 0.1;
					current[1] -= 0.1;
					scene.primitives[i].transform.setScale_m2(current);
				}					
			}
		}
	}
	else if(key == "-")
	{
		if(m == 1)
		{
			let current = nearestShape.transform.getScale().slice();
			current[0] -= 0.1;
			current[1] -= 0.1;
			nearestShape.transform.setScale(current);
		}
		else if(m==2)
		{
			for(let i=0;i<scene.primitives.length;i++)
			{
				let current = scene.primitives[i].transform.getScale_m2().slice();
				current[0] -= 0.1;
				current[1] -= 0.1;
				scene.primitives[i].transform.setScale_m2(current);
			}
			if(check() == false)
			{
				for(let i=0;i<scene.primitives.length;i++)
				{
					let current = scene.primitives[i].transform.getScale_m2().slice();
					current[0] += 0.1;
					current[1] += 0.1;
					scene.primitives[i].transform.setScale_m2(current);
				}					
			}
		}
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
