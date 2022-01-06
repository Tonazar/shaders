varying vec2 vUv;

void main(){
    // float strength = vUv.x;
    vec2 lightUc = vec2(
				vUv.x * 0.1 + 0.45,
				vUv.y
				);
    float strength = 0.02 / distance(lightUc, vec2(0.5));
    gl_FragColor = vec4(strength, 0.0, 0.0, 1.0);
}