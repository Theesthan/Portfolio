uniform float uTime;
varying vec2 vUv;
varying float vElevation;

// Simplex 3D noise via glslify
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Noise-based terrain displacement
  float elevation = snoise(
    vec3(modelPosition.x * 0.3, uTime * 0.05, modelPosition.z * 0.3)
  ) * 0.4;

  // Secondary octave for finer detail
  elevation += snoise(
    vec3(modelPosition.x * 0.8, uTime * 0.02, modelPosition.z * 0.8)
  ) * 0.1;

  modelPosition.y += elevation;

  vElevation = elevation;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
