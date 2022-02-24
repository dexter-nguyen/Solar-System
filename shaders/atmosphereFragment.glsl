varying vec3 vertexNormal; 
void main() {
  float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 0.8)), 2.2);
  gl_FragColor = vec4(1, 0.3, 0, 1) * intensity;
}