uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec2 uCorners;

varying vec2 vUv;
void main(){
    vec4 defaultState = modelMatrix * vec4(position, 1.0);
    vec4 fullscreenState = vec4(position, 1.0);

    fullscreenState.x *= uResolution.x;
    fullscreenState.y *= uResolution.y;
    fullscreenState.z *= uCorners.x;

    float corenerProgress = mix(uCorners.x, uCorners.y, uv.x);

    vec4 finalState = mix(defaultState, fullscreenState, corenerProgress);

    gl_Position = projectionMatrix * viewMatrix * finalState;
    vUv = uv;
}
    
