import {Transform} from './transform.js';

export class Triangle
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
		let point = [(coordinates[0]+coordinates[3]+coordinates[6])/3,
					 (coordinates[1]+coordinates[4]+coordinates[7])/3,
					 (coordinates[2]+coordinates[5]+coordinates[8])/3];
		return point;
	}
}