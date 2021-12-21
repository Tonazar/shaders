uniform float time;
uniform float uProgress;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;

varying vec2 vUv;
varying vec2 vSize;

vec2 getUv(vec2 uv, vec2 textureSize, vec2 quadSize){
    vec2 tempUv =uv - vec2(0.5);

    float quadAspect = quadSize.x / quadSize.y;
    float textureAspect = textureSize.x / textureSize.y;
    if(quadAspect < textureAspect){
        tempUv = tempUv * vec2(quadAspect/textureAspect,1.);
    } else{
        tempUv = tempUv * vec2(1.,textureAspect/quadAspect);
    }

    tempUv += vec2(0.5);
    return tempUv;
}

void main(){
    //vec2 newUv = (vUv - vec2(0.5))*2. + vec2(0.5);
    // vec2 newUv = vUv*2.;

    vec2 correctUv = getUv(vUv, uTextureSize, vSize);

    vec4 image = texture(uTexture, correctUv);
    gl_FragColor = vec4(vUv, 0., 1.);
    gl_FragColor = image;
}
    