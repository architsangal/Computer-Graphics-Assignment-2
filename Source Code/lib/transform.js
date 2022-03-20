import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor(shape)
	{		
		this.shape = shape;
		this.completeCentroid = [0,0,0];

		this.translateX = vec3.create();
		vec3.set(this.translateX, 0, 0, 0);
		
		this.translateY = vec3.create();
		vec3.set(this.translateY, 0, 0, 0);

		this.translateZ = vec3.create();
		vec3.set(this.translateZ, 0, 0, 0);

		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationAngleX = 0; // required in radians
		this.rotationAxisX = vec3.create();
		vec3.set(this.rotationAxisX, 1, 0, 0);

		this.rotationAngleY = 0; // required in radians
		this.rotationAxisY = vec3.create();
		vec3.set(this.rotationAxisY, 0, 1, 0);

		this.rotationAngleZ = 0; // required in radians
		this.rotationAxisZ = vec3.create();
		vec3.set(this.rotationAxisZ, 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		// this.viewTransformMatrix = mat4.create();
		// mat4.identity(this.viewTransformMatrix);

		// this.projectionTransformMatrix = mat4.create();
		// mat4.identity(this.projectionTransformMatrix);

		// this.viewPortTransformMatrix = mat4.create();
		// mat4.identity(this.viewPortTransformMatrix);


		this.updateModelTransformMatrix(1);
	}

	// https://math.hws.edu/graphicsbook/c7/s1.html
	// search 'opposite' and read it properly
	updateModelTransformMatrix()
	{
		mat4.identity(this.modelTransformMatrix);

		// let centroid = this.shape.centroid();
		// mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, centroid);

		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateX);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateY);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translateZ);

		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleX, this.rotationAxisX);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleY, this.rotationAxisY);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleZ, this.rotationAxisZ);

		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);

		// let translate_origin = vec3.create();
		// vec3.set(translate_origin, -centroid[0], -centroid[1], -centroid[2]);
		// mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, translate_origin);
	}	

	setCompleteCentroid(completeCentroid)
	{
		this.completeCentroid = completeCentroid;
	}

	setTranslateX(translateX) {
		this.translateX = translateX;
	}

	getTranslateX() {
		return this.translateX;
	}

	setTranslateY(translateY) {
		this.translateY = translateY;
	}

	getTranslateY() {
		return this.translateY;
	}

	setTranslateZ(translateZ) {
		this.translateZ = translateZ;
	}

	getTranslateZ() {
		return this.translateZ;
	}

	setScale(scaleV) {
		this.scale = scaleV;
	}

	getScale() {
		return this.scale;
	}

	setRotationAngleX(rotationAngleX){
		this.rotationAngleX = rotationAngleX;
	}

	getRotationAngleX(rotationAngleX){
		return this.rotationAngleX;
	}

	setRotationAngleY(rotationAngleY){
		this.rotationAngleY = rotationAngleY;
	}

	getRotationAngleY(rotationAngleY){
		return this.rotationAngleY;
	}

	setRotationAngleZ(rotationAngleZ){
		this.rotationAngleZ = rotationAngleZ;
	}

	getRotationAngleZ(rotationAngleZ){
		return this.rotationAngleZ;
	}
}