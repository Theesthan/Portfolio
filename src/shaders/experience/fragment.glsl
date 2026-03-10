// Experience Orb — Fragment Shader
// Fresnel-based rim glow with inner core color

uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = 1.0 - dot(viewDir, vNormal);
  fresnel = pow(fresnel, 3.0);

  // Inner core color: deep purple #1a0035
  vec3 coreColor = vec3(0.102, 0.0, 0.208);
  // Rim glow color: accent #b06dff
  vec3 rimColor = vec3(0.69, 0.427, 1.0);

  // Pulsing rim intensity
  float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
  
  // Mix core and rim based on Fresnel
  vec3 color = mix(coreColor, rimColor, fresnel * pulse);

  // Add subtle inner glow at the center
  float centerGlow = 1.0 - fresnel;
  centerGlow = pow(centerGlow, 4.0) * 0.3;
  color += rimColor * centerGlow * pulse;

  // Alpha: solid core, glowing edge
  float alpha = 0.85 + fresnel * 0.15;

  gl_FragColor = vec4(color, alpha);
}
