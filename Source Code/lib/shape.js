import {Transform} from './transform.js';

export class Shape
{
	constructor(data,color,name)
	{
        this.data = data;
        this.name = name;
		this.color = color;
		this.vertexArray = new Float32Array(data.vertices);
		this.vertexIndices = new Float32Array(data.indices);
		this.transform = new Transform(this);
	}
	
	centroid()
	{
		let x=0.0,y=0.0,z=0.0;
		let vertices_number = 0;
		for(let i=0,j=1,k=2;k<this.vertexArray.length;i+=3,j+=3,k+=3)
		{
			vertices_number += 1;
			x += this.vertexArray[i];
			y += this.vertexArray[j];
			z += this.vertexArray[k];
		}

		let point = [x/vertices_number,y/vertices_number,z/vertices_number];

		return point;
	}
}