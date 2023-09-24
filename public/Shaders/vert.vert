precision mediump float;

attribute vec3 position;
varying vec3 vColor;

void main() {
    gl_Position = vec4(position, 1);
    gl_PointSize=1.0;
    vColor=vec3(position.xy,1);
}