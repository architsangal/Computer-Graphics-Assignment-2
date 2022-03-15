export class Scene
{
	constructor()
	{
		this.primitives = []
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
		}
	}

	getNearestShape(x,y,z)
	{
		let min = 10000;
		let nearest;
		for(let i=0;i<this.primitives.length;i++)
		{
			let temp = this.distance(this.primitives[i],x,y,z);
			if(temp < min)
			{
				min = temp;
				nearest = this.primitives[i];
			}
		}
		return nearest;
	}

	distance(shape,x,y,z)
	{
		let centroid = shape.centroid();
		centroid[0] = centroid[0]+shape.transform.translate[0];
		centroid[1] = centroid[1]+shape.transform.translate[1];
		centroid[2] = centroid[2]+shape.transform.translate[2];
		
		let distance = Math.sqrt((centroid[0]-x)*(centroid[0]-x)+
		(centroid[1]-y)*(centroid[1]-y)+
		(centroid[2]-z)*(centroid[2]-z));
		return distance;
	}

	minMaxCalc()
	{
		let minX = 1;
		let maxX = -1;
		let minY = 1;
		let maxY = -1;
		let minZ = 1;
		let maxZ = -1;

		this.minMax = new Float32Array([0,0,0,0,0,0]);

		for(let i=0;i<this.primitives.length;i++)
		{
			let centroids = this.primitives[i].centroid();
			centroids[0] += this.primitives[i].transform.translate[0];
			centroids[1] += this.primitives[i].transform.translate[1];
			centroids[2] += this.primitives[i].transform.translate[2];
			
			let temp = centroids[0];
			if(temp > maxX)
			{
				maxX = temp;
			}
			if(temp < minX)
			{
				minX = temp;
			}
			
			temp = centroids[1];
			if(temp > maxY)
			{
				maxY = temp;
			}
			if(temp < minY)
			{
				minY = temp;
			}					
			temp = centroids[2];
			if(temp > maxZ)
			{
				maxZ = temp;
			}
			if(temp < minZ)
			{
				minZ = temp;
			}
		}
		
		this.minMax[0] = minX;
		this.minMax[1] = maxX;
		this.minMax[2] = minY;
		this.minMax[3] = maxY;
		this.minMax[4] = minZ;
		this.minMax[5] = maxZ;
	}

	getMinX()
	{
		this.minMaxCalc();
		return this.minMax[0];
	}
	getMaxX()
	{
		this.minMaxCalc();
		return this.minMax[1];
	}
	getMinY()
	{
		this.minMaxCalc();
		return this.minMax[2];
	}
	getMaxY()
	{
		this.minMaxCalc();
		return this.minMax[3];
	}
	getMinZ()
	{
		this.minMaxCalc();
		return this.minMax[4];
	}
	getMaxZ()
	{
		this.minMaxCalc();
		return this.minMax[5];
	}

	centroid()
	{
		let coordinates = new Float32Array([0,0,0])
		coordinates[0] = (this.getMinX() + this.getMaxX())/2;
		coordinates[1] = (this.getMinY() + this.getMaxY())/2;
		coordinates[2] = (this.getMinZ() + this.getMaxZ())/2;
		return coordinates;
	}

	borderVertex()
	{
		let set_of_vertices = [];
		for(let i=0;i<this.primitives.length;i++)
		{
			this.primitives[i].transform.updateModelTransformMatrix(2);
			let matrix = this.primitives[i].transform.modelTransformMatrix.slice();
			let vertices = this.primitives[i].vertexPositions.slice();
			for(let j=0;j<vertices.length;j+=3)
			{
				let one_vertex = new Float32Array([vertices[j],vertices[j+1],vertices[j+2],1]);
				let modi_one_vertex = new Float32Array([
					one_vertex[0]*matrix[0] + one_vertex[1]*matrix[4] + one_vertex[2]*matrix[8]  + 1*matrix[12],
					one_vertex[0]*matrix[1] + one_vertex[1]*matrix[5] + one_vertex[2]*matrix[9]  + 1*matrix[13],
					one_vertex[0]*matrix[2] + one_vertex[1]*matrix[6] + one_vertex[2]*matrix[10] + 1*matrix[14],
					one_vertex[0]*matrix[3] + one_vertex[1]*matrix[7] + one_vertex[2]*matrix[11] + 1*matrix[15]
				]).slice();
				set_of_vertices.push(modi_one_vertex);
			}
		}

		let minX = 1;
		let minY = 1;
		let minZ = 1;
		let maxX = -1;
		let maxY = -1;
		let maxZ = -1;
		set_of_vertices.forEach(function(vertex){
			
			if(vertex[0]>maxX)
				maxX = vertex[0];
			
			if(vertex[0]<minX)
				minX = vertex[0];

			if(vertex[1]>maxY)
				maxY = vertex[1];
				
			if(vertex[1]<minY)
				minY = vertex[1];
			
			if(vertex[2]>maxZ)
				maxZ = vertex[2];
			
			if(vertex[2]<minZ)
				minZ = vertex[2];

		});

		return new Float32Array([minX,maxX,minY,maxY,minZ,maxZ]);
	}
}
