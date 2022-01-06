varying vec2 vUv;

void main(){
    vec3 newPosition = position;
    // newPosition.z = 0.03 * sin(length(position *30.));
    // newPosition.z = mod(uv.x * 5.0, 0.3);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}
    
