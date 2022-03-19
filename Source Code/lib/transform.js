import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor(shape)
	{		
		this.shape = shape;
		this.completeCentroid = [0,0,0];

		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);
		
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationAngle = 0; // required in radians
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 1, 1, 0);

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

		let centroid = this.shape.centroid();
		// mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, centroid);

		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);

		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);

		// let translate_origin = vec3.create();
		// vec3.set(translate_origin, -centroid[0], -centroid[1], -centroid[2]);
		// mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, translate_origin);
	}	

	setCompleteCentroid(completeCentroid)
	{
		this.completeCentroid = completeCentroid;
	}

	setTranslate(translateV) {
		this.translate = translateV;
	}

	getTranslate() {
		return this.translate;
	}

	setScale(scaleV) {
		this.scale = scaleV;
	}

	getScale() {
		return this.scale;
	}

	setRotationAngle(rotationAngle){
		this.rotationAngle = rotationAngle;
	}

	getRotationAngle(rotationAngle){
		return this.rotationAngle;
	}

	setTranslate_m2(translateV,scene)
	{
		this.translate_m2 = translateV;
	}

	getTranslate_m2() {
		return this.translate_m2;
	}

	setScale_m2(scaleV) {
		this.scale_m2 = scaleV;
	}

	getScale_m2() {
		return this.scale_m2;
	}

	setRotationAngle_m2(rotationAngle){
		this.rotationAngle_m2 = rotationAngle;
	}

	getRotationAngle_m2(rotationAngle){
		return this.rotationAngle_m2;
	}
}