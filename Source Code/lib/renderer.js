export class WebGLRenderer
{
	constructor()
	{
		this.domElement = document.createElement("canvas");

		this.gl = this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) || this.domElement.getContext("experimental-webgl");
		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}	

	setSize(width, height)
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r,g,b,a)
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop()
		{
			animation();
			window.requestAnimationFrame(renderLoop);
		}	

		renderLoop();
		  
	}

	render(scene, shader)
	{
		scene.primitives.forEach( function (primitive) {

			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexArray);
			shader.bindElementBuffer(shader.indexBuffer, primitive.vertexIndices);
			
			shader.fillAttributeData("aPosition", 3,  3 * primitive.vertexArray.BYTES_PER_ELEMENT, 0);

			shader.setUniform4f("uColor", primitive.color);

			shader.setUniformMatrix4fv("modelMatrix",primitive.transform.modelTransformMatrix);
			shader.setUniformMatrix4fv("viewMatrix",window.viewMatrix);
			shader.setUniformMatrix4fv("projMatrix",window.projMatrix);
			
			// Draw
			shader.drawElements(primitive.vertexIndices.length);
		});
	}

	glContext()
	{
		return this.gl;
	}
}