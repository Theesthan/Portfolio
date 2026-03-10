uniform float uTime;
uniform float uSpeed;
attribute float aSize;
attribute float aPhase;

varying float vAlpha;
varying float vHeight;

// Simplex 3D noise via glslify
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

void main() {
  vec3 pos = position;

  // Time-based drift
  float t = uTime * uSpeed;
  pos.x += snoise(vec3(pos.x * 0.1, t * 0.15, pos.z * 0.1 + aPhase)) * 0.5;
  pos.y += snoise(vec3(pos.y * 0.1, t * 0.1, aPhase)) * 0.3;
  pos.z += snoise(vec3(pos.z * 0.1, t * 0.12, pos.x * 0.1 + aPhase)) * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Size attenuation (farther = smaller)
  float sizeAttenuation = 300.0 / -mvPosition.z;
  gl_PointSize = aSize * sizeAttenuation;
  gl_PointSize = clamp(gl_PointSize, 0.5, 8.0);

  // Pass height for color gradient in fragment shader
  vHeight = (pos.y + 10.0) / 20.0; // normalize to 0..1
  vAlpha = smoothstep(0.0, 0.15, vHeight) * smoothstep(1.0, 0.85, vHeight);

  gl_Position = projectionMatrix * mvPosition;
}
