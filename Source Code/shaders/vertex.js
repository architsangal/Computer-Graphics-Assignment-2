export const vertexShaderSrc = `      
	attribute vec3 aPosition;

	uniform mat4 uModelTransformMatrix;
	uniform mat4 uViewTransformMatrix;
	uniform mat4 uProjectionTransformMatrix;
	uniform mat4 uViewPortTransformMatrix;
	
	void main () {             
		gl_Position = uViewPortTransformMatrix * uProjectionTransformMatrix * uViewTransformMatrix * uModelTransformMatrix * vec4(aPosition, 1.0);
	}                          
`;