import {Transform} from './transform.js';

export class Square
{
	constructor(coordinates,color,name)
	{
		this.name = name;
		this.vertexPositions = new Float32Array(coordinates);		
		this.color = color;
		this.transform = new Transform(this);
	}
	centroid()
	{
		let coordinates = this.vertexPositions;
		let point = [(coordinates[0]+coordinates[6])/2,
					 (coordinates[1]+coordinates[7])/2,
					 (coordinates[2]+coordinates[8])/2];
		return point;
	}
}