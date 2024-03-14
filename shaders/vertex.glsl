uniform float time;
uniform sampler2D uTexture;
varying vec2 vUv;


void main() {

    vUv = uv;
    vec4 color = texture2D(uTexture, uv);
    vec3 newpos = position;
    // newpos.z = color.z;
    // newpos.z += sin(time + position.x) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );

    gl_PointSize =  5.0;

    gl_Position = projectionMatrix * mvPosition;

}