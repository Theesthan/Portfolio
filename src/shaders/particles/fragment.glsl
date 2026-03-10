uniform vec3 uColorLow;
uniform vec3 uColorHigh;

varying float vAlpha;
varying float vHeight;

void main() {
  // Circular sprite (discard corners)
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;

  // Soft edge falloff
  float alpha = smoothstep(0.5, 0.2, dist) * vAlpha * 0.7;

  // Height-based color gradient (purple to lavender)
  vec3 color = mix(uColorLow, uColorHigh, vHeight);

  gl_FragColor = vec4(color, alpha);
}
