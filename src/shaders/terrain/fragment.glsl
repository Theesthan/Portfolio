uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uFogColor;
uniform float uFogDensity;

varying float vElevation;
varying vec2 vUv;

void main() {
  // Height-based color mix
  float mixStrength = clamp((vElevation + 0.2) / 0.6, 0.0, 1.0);
  vec3 color = mix(uColorLow, uColorHigh, mixStrength);

  // Subtle edge glow (distance from center)
  float dist = length(vUv - 0.5) * 2.0;
  float edgeGlow = smoothstep(0.6, 1.0, dist) * 0.15;
  color += vec3(0.42, 0.25, 0.63) * edgeGlow; // purple rim

  // Manual fog integration (since ShaderMaterial bypasses scene fog)
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * depth * depth);
  color = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
