export const vertexShaderSrc = `      
	attribute vec3 aPosition;
	uniform mat4 matrixTransform;
	void main () {             
		gl_Position = matrixTransform*vec4(aPosition, 1.0);
	}                          
`;