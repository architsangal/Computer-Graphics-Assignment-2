import {Transform} from './transform.js';

export class Shape
{
	constructor(data,color,isSelectable,name)
	{
		this.isSelectable = isSelectable;
		this.original_color = color;
        this.data = data;
        this.name = name;
		this.color = color;
		this.vertexArray = new Float32Array(data.vertices);
		this.vertexIndices = new Uint16Array(data.indices);
		this.transform = new Transform(this);
	}
	
	centroid()
	{
		let x=0.0;
		let y=0.0;
		let z=0.0;

		let vertices_number = 0;
		for(let i=0,j=1,k=2;k<this.vertexArray.length;i+=3,j+=3,k+=3)
		{
			vertices_number += 1;
			x += this.vertexArray[i]+this.transform.getTranslateX()[0];
			y += this.vertexArray[j]+this.transform.getTranslateY()[1];
			z += this.vertexArray[k]+this.transform.getTranslateZ()[2];
		}

		let point = [x/vertices_number,y/vertices_number,z/vertices_number];
		return point;
	}
}