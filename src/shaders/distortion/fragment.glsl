// Project Card Distortion — Fragment Shader
// Liquid warp + mouse ripple + Fresnel rim glow on hover

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;       // Mouse in UV space [0,1]
uniform float uHover;      // 0 = no hover, 1 = full hover
varying vec2 vUv;

#pragma glslify: snoise = require(glsl-noise/simplex/3d)

void main() {
  vec2 uv = vUv;

  // Distortion strength increases with uHover
  float noiseX = snoise(vec3(uv * 3.0, uTime * 0.5)) * 0.03 * uHover;
  float noiseY = snoise(vec3(uv * 3.0 + 100.0, uTime * 0.5)) * 0.03 * uHover;
  uv += vec2(noiseX, noiseY);

  // Mouse ripple effect
  vec2 toMouse = uv - uMouse;
  float dist = length(toMouse);
  float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.01 * uHover;
  uv += normalize(toMouse + 0.0001) * ripple;

  vec4 tex = texture2D(uTexture, clamp(uv, 0.0, 1.0));

  // Fresnel rim glow (purple tint on edges)
  float fresnel = pow(1.0 - abs(dot(normalize(vec3(vUv - 0.5, 1.0)), vec3(0.0, 0.0, 1.0))), 3.0);
  vec3 fresnelColor = vec3(0.69, 0.43, 1.0); // #b06dff
  tex.rgb = mix(tex.rgb, fresnelColor, fresnel * 0.4 * uHover);

  gl_FragColor = tex;
}
