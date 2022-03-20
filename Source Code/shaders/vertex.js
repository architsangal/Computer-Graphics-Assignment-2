export const vertexShaderSrc = `      
	attribute vec3 aPosition;

	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
	uniform mat4 projMatrix;
	
	void main () {             
		gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
	}                          
`;