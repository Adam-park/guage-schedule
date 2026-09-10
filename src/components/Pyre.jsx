// Wind Pyre — Originkit. TS 원본을 이 프로젝트(JS) 규칙에 맞춰 옮김.
// 노이즈 기반(FBM) 절차적 불 셰이더. Hearth.jsx가 level에 따라 아래쪽을 가려서 게이지처럼 씀.

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const DEFAULTS = {
  soot: '#0C0604',
  ember: '#A82208',
  flame: '#FF7A1E',
  spark: '#FFE86B',
  highlight: '#929292',
  rise: 20,
  turbulence: 20,
  detail: 20,
  exposure: 10,
  shade: 5,
  edgeSoftness: 1,
  glowOn: true,
  glow: { color: '#FF7A1E', strength: 6 },
  speed: 11,
  spin: 0,
  hoverIntensity: 40,
  wind: 100,
  sizePercent: 47,
}

const BASE_RADIUS = 0.72

function clamp(v, lo, hi, fallback) {
  const n = typeof v === 'number' && isFinite(v) ? v : fallback
  return Math.max(lo, Math.min(hi, n))
}

function settingsFor(cfg) {
  const glow = cfg.glow || DEFAULTS.glow
  return {
    speed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) * 0.09,
    rise: clamp(cfg.rise, 0, 20, DEFAULTS.rise) * 0.1,
    turbulence: clamp(cfg.turbulence, 0, 20, DEFAULTS.turbulence) * 0.1,
    detail: 1.0 + clamp(cfg.detail, 1, 20, DEFAULTS.detail) * 0.2,
    exposure: 0.3 + clamp(cfg.exposure, 1, 20, DEFAULTS.exposure) * 0.1,
    shade: clamp(cfg.shade, 0, 20, DEFAULTS.shade) * 0.075,
    edgeSoftness: 0.01 + clamp(cfg.edgeSoftness, 1, 20, DEFAULTS.edgeSoftness) * 0.009,
    glowStrength: cfg.glowOn ? clamp(glow.strength, 0, 20, DEFAULTS.glow.strength) * 0.05 : 0,
    glowColor: glow.color || DEFAULTS.glow.color,
    spin: clamp(cfg.spin, 0, 20, DEFAULTS.spin) * 0.06,
    hoverIntensity: clamp(cfg.hoverIntensity, 0, 100, DEFAULTS.hoverIntensity) * 0.01,
    wind: clamp(cfg.wind, 0, 100, DEFAULTS.wind) * 0.01,
    radius: BASE_RADIUS * clamp(cfg.sizePercent, 20, 200, 100) * 0.01,
  }
}

const QUAD_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const PYRE_FRAGMENT = `
  precision highp float;

  uniform vec2 uResolution;
  uniform vec3 uSoot;
  uniform vec3 uEmber;
  uniform vec3 uFlame;
  uniform vec3 uSpark;
  uniform vec3 uHighlight;
  uniform vec3 uGlowColor;
  uniform float uTime;
  uniform float uRise;
  uniform float uTurbulence;
  uniform float uDetail;
  uniform float uExposure;
  uniform float uShade;
  uniform float uEdgeSoftness;
  uniform float uGlowStrength;
  uniform float uRadius;
  uniform float uYaw;
  uniform float uHover;
  uniform float uHoverIntensity;
  uniform float uLean;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p, float oct) {
    float sum = 0.0;
    float amp = 0.5;
    float norm = 0.0;
    for (int i = 0; i < 5; i++) {
      float w = clamp(oct - float(i), 0.0, 1.0);
      if (w > 0.0) {
        sum += noise(p) * amp * w;
        norm += amp * w;
      }
      p *= 2.03;
      p = mat2(0.8, 0.6, -0.6, 0.8) * p;
      amp *= 0.5;
    }
    return sum / max(0.0001, norm);
  }

  vec3 ramp(float t) {
    vec3 c = mix(uSoot, uEmber, smoothstep(0.02, 0.40, t));
    c = mix(c, uFlame, smoothstep(0.32, 0.72, t));
    return mix(c, uSpark, smoothstep(0.64, 1.0, t));
  }

  void main() {
    vec2 screen = vUv - 0.5;
    screen.x *= uResolution.x / max(1.0, uResolution.y);
    vec2 uv = screen / max(0.0001, uRadius);
    float h = uv.y * 0.5 + 0.5;

    vec2 p = uv * 1.55 - vec2(uYaw + uLean * h * h, 0.0);
    vec2 drift = vec2(0.0, uTime * uRise);
    float wOct = min(uDetail, 3.0);
    vec2 warp = vec2(
      fbm(p * 2.6 - drift * 1.35, wOct),
      fbm(p * 2.6 - drift * 1.15 + vec2(5.2, 1.3), wOct)
    );
    float n = fbm(p + warp * uTurbulence * 2.2 - drift, uDetail);

    float crownFade = smoothstep(-0.15, 1.05 + uEdgeSoftness * 2.0, h);
    float heat = n * mix(1.5, 0.12, crownFade);
    heat = clamp(heat * uExposure * (1.0 + uHover * uHoverIntensity), 0.0, 1.0);

    vec3 col = ramp(heat);
    col += uHighlight * heat * smoothstep(0.4, -0.6, uv.y) * 0.25;
    col += uGlowColor * uGlowStrength * heat * heat * 0.06 * (1.0 + uHover * uHoverIntensity);
    col *= mix(1.0, 0.4, clamp(uShade, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`

class PyreScene {
  scene = new THREE.Scene()
  camera = new THREE.Camera()
  geometry = new THREE.PlaneGeometry(2, 2)
  time = 0
  yaw = 0
  hoverTarget = 0
  hover = 0
  windTime = 0
  lean = 0
  leanVel = 0
  width = 0
  height = 0
  frameId = 0
  lastT = 0
  disposed = false
  unbind = () => {}

  constructor(container, cfg) {
    this.container = container
    this.cfg = cfg
    const S = settingsFor(cfg)

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)
    const el = this.renderer.domElement
    el.style.position = 'absolute'
    el.style.inset = '0'
    el.style.width = '100%'
    el.style.height = '100%'
    container.appendChild(el)

    this.material = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader: PYRE_FRAGMENT,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uSoot: { value: new THREE.Color(cfg.soot) },
        uEmber: { value: new THREE.Color(cfg.ember) },
        uFlame: { value: new THREE.Color(cfg.flame) },
        uSpark: { value: new THREE.Color(cfg.spark) },
        uHighlight: { value: new THREE.Color(cfg.highlight) },
        uGlowColor: { value: new THREE.Color(S.glowColor) },
        uTime: { value: 0 },
        uRise: { value: S.rise },
        uTurbulence: { value: S.turbulence },
        uDetail: { value: S.detail },
        uExposure: { value: S.exposure },
        uShade: { value: S.shade },
        uEdgeSoftness: { value: S.edgeSoftness },
        uGlowStrength: { value: S.glowStrength },
        uRadius: { value: S.radius },
        uYaw: { value: 0 },
        uHover: { value: 0 },
        uHoverIntensity: { value: S.hoverIntensity },
        uLean: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.frustumCulled = false
    this.scene.add(this.mesh)
    this.bindEvents()
  }

  bindEvents() {
    const el = this.renderer.domElement
    const enter = () => {
      this.hoverTarget = 1
    }
    const leave = () => {
      this.hoverTarget = 0
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    this.unbind = () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }

  start() {
    this.lastT = performance.now()
    const loop = () => {
      this.frameId = requestAnimationFrame(loop)
      this.step()
    }
    loop()
  }

  setSize(width, height) {
    if (this.disposed || width <= 0 || height <= 0) return
    this.width = width
    this.height = height
    this.renderer.setSize(width, height, false)
    this.material.uniforms.uResolution.value.set(width, height)
  }

  updateConfig(cfg) {
    if (this.disposed) return
    this.cfg = cfg
    const S = settingsFor(cfg)
    const u = this.material.uniforms

    u.uSoot.value.set(cfg.soot || DEFAULTS.soot)
    u.uEmber.value.set(cfg.ember || DEFAULTS.ember)
    u.uFlame.value.set(cfg.flame || DEFAULTS.flame)
    u.uSpark.value.set(cfg.spark || DEFAULTS.spark)
    u.uHighlight.value.set(cfg.highlight || DEFAULTS.highlight)
    u.uGlowColor.value.set(S.glowColor)
    u.uRise.value = S.rise
    u.uTurbulence.value = S.turbulence
    u.uDetail.value = S.detail
    u.uExposure.value = S.exposure
    u.uShade.value = S.shade
    u.uEdgeSoftness.value = S.edgeSoftness
    u.uGlowStrength.value = S.glowStrength
    u.uRadius.value = S.radius
    u.uHoverIntensity.value = S.hoverIntensity
  }

  step() {
    if (this.disposed) return
    const now = performance.now()
    let dt = (now - this.lastT) / 1000
    this.lastT = now
    if (!isFinite(dt) || dt < 0) dt = 0
    if (dt > 0.05) dt = 0.05

    const S = settingsFor(this.cfg)
    this.time += dt * S.speed
    this.yaw += S.spin * dt

    const hoverRate = this.hoverTarget > this.hover ? 6 : 3
    this.hover += (this.hoverTarget - this.hover) * Math.min(1, dt * hoverRate)

    this.windTime += dt
    const gustAmplitude = S.wind * 0.4
    const gustTarget =
      (Math.sin(this.windTime * 0.9) * 0.6 + Math.sin(this.windTime * 0.37 + 1.7) * 0.4) * gustAmplitude
    const springAccel = (gustTarget - this.lean) * 26 - this.leanVel * 6.5
    this.leanVel += springAccel * dt
    this.lean += this.leanVel * dt

    const u = this.material.uniforms
    u.uTime.value = this.time
    u.uYaw.value = this.yaw
    u.uHover.value = this.hover
    u.uLean.value = this.lean
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frameId)
    this.unbind()
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
    const el = this.renderer.domElement
    if (el.parentNode === this.container) this.container.removeChild(el)
  }
}

const PRESET_PROPS = {
  soot: '#0C0604',
  ember: '#A82208',
  flame: '#FF7A1E',
  spark: '#FFE86B',
  highlight: '#929292',
  rise: 20,
  turbulence: 20,
  detail: 20,
  exposure: 10,
  shade: 5,
  edgeSoftness: 1,
  glowOn: true,
  speed: 11,
  hoverIntensity: 40,
  wind: 100,
  sizePercent: 47,
}

function PyreBase(props) {
  const {
    soot = DEFAULTS.soot,
    ember = DEFAULTS.ember,
    flame = DEFAULTS.flame,
    spark = DEFAULTS.spark,
    highlight = DEFAULTS.highlight,
    rise = DEFAULTS.rise,
    turbulence = DEFAULTS.turbulence,
    detail = DEFAULTS.detail,
    exposure = DEFAULTS.exposure,
    shade = DEFAULTS.shade,
    edgeSoftness = DEFAULTS.edgeSoftness,
    glowOn = DEFAULTS.glowOn,
    glow = { color: '#FF7A1E', strength: 6 },
    speed = DEFAULTS.speed,
    spin = DEFAULTS.spin,
    hoverIntensity = DEFAULTS.hoverIntensity,
    wind = DEFAULTS.wind,
    sizePercent = DEFAULTS.sizePercent,
    style,
  } = props

  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cfgRef = useRef(null)
  cfgRef.current = {
    soot,
    ember,
    flame,
    spark,
    highlight,
    rise,
    turbulence,
    detail,
    exposure,
    shade,
    edgeSoftness,
    glowOn,
    glow,
    speed,
    spin,
    hoverIntensity,
    wind,
    sizePercent,
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let scene
    try {
      scene = new PyreScene(container, cfgRef.current)
    } catch {
      return
    }
    sceneRef.current = scene
    scene.setSize(container.clientWidth, container.clientHeight)
    scene.start()

    const ro = new ResizeObserver(() => {
      scene.setSize(container.clientWidth, container.clientHeight)
    })
    ro.observe(container)
    return () => {
      ro.disconnect()
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.updateConfig(cfgRef.current)
  }, [
    soot,
    ember,
    flame,
    spark,
    highlight,
    rise,
    turbulence,
    detail,
    exposure,
    shade,
    edgeSoftness,
    glowOn,
    glow?.color,
    glow?.strength,
    speed,
    spin,
    hoverIntensity,
    wind,
    sizePercent,
  ])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: 120,
        minHeight: 120,
        overflow: 'hidden',
        ...style,
      }}
    />
  )
}

// props: soot/ember/flame/spark/highlight(색), rise/turbulence/detail/exposure/shade/edgeSoftness(모양),
// glowOn/glow{color,strength}, speed/spin/hoverIntensity/wind/sizePercent(움직임), style
export default function Pyre(props) {
  return <PyreBase {...PRESET_PROPS} {...props} />
}
