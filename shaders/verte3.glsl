uniform float time;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vUv;
varying vec2 vSize;

void main(){
    vUv = uv;
    vec4 defaultState = modelMatrix * vec4( position, 1.0 );
    vec4 fullscreenState = vec4( position, 1.0 );

    fullscreenState.x *= uResolution.x / uQuadSize.x;
    fullscreenState.y *= uResolution.y / uQuadSize.y;

    // float cornersProgress = mix(uCorners.x, uCorners.y, uv.x);
    float cornersProgress = mix(
        //changing the order make difference
        mix(uCorners.z, uCorners.w, uv.x),
        mix(uCorners.x, uCorners.y, uv.x),
        uv.y
    );

    vec4 finalState = mix(defaultState, fullscreenState, cornersProgress);

    vSize = mix(uQuadSize, uResolution, uProgress);

    gl_Position = projectionMatrix * viewMatrix * finalState;
}
    
