import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidBackground = () => {
  const mountRef = useRef(null);
  const materialRef = useRef(null);
  const globalTimeRef = useRef(0);
  const rafRef = useRef(null);

  const THEMES = {
    orange: { main: [1.0, 0.95, 0.7], low: [0.95, 0.75, 0.4], mid: [0.98, 0.7, 0.6], high: [1.0, 1.0, 1.0] },
    blue:   { main: [0.702, 0.922, 0.949], low: [0.4, 0.6, 0.9],   mid: [0.5, 0.7, 1.0],  high: [0.9, 0.95, 1.0] },
    purple: { main: [0.9, 0.75, 1.0], low: [0.6, 0.45, 0.9],  mid: [0.7, 0.55, 1.0], high: [0.95, 0.9, 1.0] },
    green:  { main: [0.75, 1.0, 0.85],low: [0.4, 0.8, 0.6],   mid: [0.5, 0.9, 0.7],  high: [0.9, 1.0, 0.95] },
    crimson:{ main: [1.0, 0.75, 0.75],low: [0.9, 0.5, 0.5],   mid: [1.0, 0.6, 0.6],  high: [1.0, 0.9, 0.9] },
  };

  const settings = {
    theme: 'blue',
    windSpeed: 0.144,
    warpPower: 0.2355,
    fbmStrength: 0.912,
    blurRadius: 1.2673,
    zoom: 0.3971,
    grainStrength: 0.014,
    grainScale: 2.5,
    noiseScale: 0.8673,
    speed: 0.72,
  };

  const vertexShader = `
    in vec3 position;
    in vec2 uv;
    out vec2 out_uv;
    void main() {
      out_uv = uv;
      out_uv.y = 1.0 - out_uv.y;
      gl_Position = vec4(position, 1.0);
    }`;

  const fragmentShader = `
    precision highp float;
    #define NUM_OCTAVES (4)
    in vec2 out_uv;
    out vec4 fragColor;
    uniform float u_time;
    uniform vec2 u_viewport;
    uniform sampler2D uTextureNoise;
    uniform vec3 u_bloopColorMain;
    uniform vec3 u_bloopColorLow;
    uniform vec3 u_bloopColorMid;
    uniform vec3 u_bloopColorHigh;
    uniform float u_windSpeed;
    uniform float u_warpPower;
    uniform float u_fbmStrength;
    uniform float u_blurRadius;
    uniform float u_zoom;
    uniform float u_grainStrength;
    uniform float u_grainScale;
    uniform float u_noiseScale;

    vec3 blendLinearBurn_13_5(vec3 base, vec3 blend, float opacity) {
      return (max(base + blend - vec3(1.0), vec3(0.0))) * opacity + base * (1.0 - opacity);
    }
    vec4 permute(vec4 x) { return mod((x * 34.0 + 1.0) * x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 ip = floor(p); vec2 u = fract(p);
      u = u * u * (3.0 - 2.0 * u);
      float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
                      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
      return res * res;
    }
    float fbm(vec2 x) {
      float v = 0.0; float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < NUM_OCTAVES; ++i) { v += a * noise(x); x = rot * x * 2.0 + shift; a *= 0.5; }
      return v;
    }
    float cnoise(vec3 P) {
      vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = vec4(Pi0.z); vec4 iz1 = vec4(Pi1.z);
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
      vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(vec4(0.0), gx0) - 0.5); gy0 -= sz0 * (step(vec4(0.0), gy0) - 0.5);
      vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(vec4(0.0), gx1) - 0.5); gy1 -= sz1 * (step(vec4(0.0), gy1) - 0.5);
      vec3 g000=vec3(gx0.x,gy0.x,gz0.x); vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010=vec3(gx0.z,gy0.z,gz0.z); vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001=vec3(gx1.x,gy1.x,gz1.x); vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011=vec3(gx1.z,gy1.z,gz1.z); vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
      vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
      g000*=norm0.x; g010*=norm0.y; g100*=norm0.z; g110*=norm0.w;
      vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
      g001*=norm1.x; g011*=norm1.y; g101*=norm1.z; g111*=norm1.w;
      float n000=dot(g000,Pf0); float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
      float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)); float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
      float n001=dot(g001,vec3(Pf0.xy,Pf1.z)); float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
      float n011=dot(g011,vec3(Pf0.x,Pf1.yz)); float n111=dot(g111,Pf1);
      vec3 fade_xyz=fade(Pf0);
      vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
      vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
      return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
    }

    vec3 getFluidColor(vec2 st, float time) {
      float scaleFactor = 1.0 / (2.0 * u_zoom);
      vec2 uv = st * scaleFactor + 0.5;
      uv.y = 1.0 - uv.y;
      float wNCScale = 18.0; float wNCStr = 0.02;
      float vertOff = 0.09; float waveSpread = 1.0;
      float l1A=1.5,l1F=1.0, l2A=1.4,l2F=1.0, l3A=1.3,l3F=1.0;
      time *= 0.85;
      vertOff += 1.0 - waveSpread;
      float nX=cnoise(vec3(uv*u_noiseScale+vec2(0.0,74.8572),time*0.3));
      float nY=cnoise(vec3(uv*u_noiseScale+vec2(203.91282,10.0),time*0.3));
      uv += vec2(nX*2.0,nY)*u_warpPower;
      float nA=cnoise(vec3(uv*wNCScale+vec2(344.91282,0.0),time*0.3))+
               cnoise(vec3(uv*wNCScale*2.2+vec2(723.937,0.0),time*0.4))*0.5;
      uv += nA*wNCStr; uv.y -= vertOff;
      vec2 tUv=uv*u_grainScale;
      float d0=mix(texture(uTextureNoise,tUv).r-0.5,texture(uTextureNoise,vec2(tUv.x,1.0-tUv.y)).g-0.5,(sin(time)+1.0)*0.5)*u_grainStrength;
      tUv+=vec2(63.861,368.937);
      float d1=mix(texture(uTextureNoise,tUv).r-0.5,texture(uTextureNoise,vec2(tUv.x,1.0-tUv.y)).g-0.5,(sin(time)+1.0)*0.5)*u_grainStrength;
      tUv+=vec2(453.163,1649.808);
      float d3=mix(texture(uTextureNoise,tUv).r-0.5,texture(uTextureNoise,vec2(tUv.x,1.0-tUv.y)).g-0.5,(sin(time)+1.0)*0.5)*u_grainStrength;
      uv+=d0;
      vec2 sf=uv*u_noiseScale;
      vec2 q=vec2(fbm(sf*0.5+u_windSpeed*time), fbm(sf*0.5+u_windSpeed*time));
      vec2 r=vec2(fbm(sf+q+vec2(0.3,9.2)+0.15*time), fbm(sf+q+vec2(8.3,0.8)+0.126*time));
      float f=fbm(sf+r-q);
      float ff=pow((f+0.6*f*f+0.7*f+0.5)*0.5, 0.55)*u_fbmStrength;
      float br=u_blurRadius*1.5;
      vec2 uv1=(uv+vec2((ff-0.5)*1.2)+vec2(0.0,0.025)+d0)*vec2(l1F,1.0);
      float sn1=noise(uv1*2.0+vec2(0.0,time*0.5))*2.0*l1A;
      float s1=smoothstep(sn1-1.2*br,sn1+1.2*br,(uv1.y-0.5*waveSpread)*5.0+0.5);
      vec2 uv2=(uv+vec2((ff-0.5)*0.85)+vec2(0.0,0.025)+d1)*vec2(l2F,1.0);
      float sn2=noise(uv2*4.0+vec2(293.0,time))*2.0*l2A;
      float s2=smoothstep(sn2-0.9*br,sn2+0.9*br,(uv2.y-0.6*waveSpread)*5.0+0.5);
      vec2 uv3=(uv+vec2((ff-0.5)*1.1)+d3)*vec2(l3F,1.0);
      float sn3=noise(uv3*6.0+vec2(153.0,time*1.2))*2.0*l3A;
      float s3=smoothstep(sn3-0.7*br,sn3+0.7*br,(uv3.y-0.9*waveSpread)*6.0+0.5);
      s1=pow(s1,0.8); s2=pow(s2,0.9);
      vec3 col=blendLinearBurn_13_5(u_bloopColorMain,u_bloopColorLow,1.0-s1);
      col=blendLinearBurn_13_5(col,mix(u_bloopColorMain,u_bloopColorMid,1.0-s2),s1);
      col=mix(col,mix(u_bloopColorMain,u_bloopColorHigh,1.0-s3),s1*s2);
      return col;
    }

    void main() {
      vec2 st = out_uv - 0.5;
      st.x *= u_viewport.x / u_viewport.y;
      fragColor = vec4(getFluidColor(st, u_time), 1.0);
    }`;

  function generateNoiseTexture() {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const theme = THEMES[settings.theme];

    const mat = new THREE.RawShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        u_time:           { value: 0 },
        u_viewport:       { value: new THREE.Vector2(w, h) },
        uTextureNoise:    { value: generateNoiseTexture() },
        u_bloopColorMain: { value: new THREE.Vector3(...theme.main) },
        u_bloopColorLow:  { value: new THREE.Vector3(...theme.low) },
        u_bloopColorMid:  { value: new THREE.Vector3(...theme.mid) },
        u_bloopColorHigh: { value: new THREE.Vector3(...theme.high) },
        u_windSpeed:      { value: settings.windSpeed },
        u_warpPower:      { value: settings.warpPower },
        u_fbmStrength:    { value: settings.fbmStrength },
        u_blurRadius:     { value: settings.blurRadius },
        u_zoom:           { value: settings.zoom },
        u_grainStrength:  { value: settings.grainStrength },
        u_grainScale:     { value: settings.grainScale },
        u_noiseScale:     { value: settings.noiseScale },
      },
      transparent: false, depthWrite: false, depthTest: false,
      glslVersion: THREE.GLSL3,
    });
    materialRef.current = mat;
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    const clock = new THREE.Clock();
    const handleResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      renderer.setSize(nw, nh);
      if (materialRef.current) materialRef.current.uniforms.u_viewport.value.set(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      globalTimeRef.current += clock.getDelta() * settings.speed;
      if (materialRef.current) materialRef.current.uniforms.u_time.value = globalTimeRef.current * 0.95;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
};

export default FluidBackground;