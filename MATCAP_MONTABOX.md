# MatCap — Documentação de Material Base | Projeto Montabox Hero

## Contexto

Este documento descreve os dois MatCaps criados para o Hero do site Montabox.  
Eles foram produzidos no **Cables.gl** e são utilizados como **textura base** no componente React/Three.js do Hero.

> ⚠️ Estes MatCaps **não representam o visual final** dos cubos.  
> Eles são o ingrediente base. O Three.js aplica camadas adicionais por cima.

---

## Referência Visual

A referência vem do projeto Spline da Montabox, cujo material `Wall material` usa a seguinte configuração:

```
Color:    #888888
Matcap:   100
Lighting: 100
Fresnel:  70
Noise:    40
```

O Spline **soma essas camadas em tempo real** para gerar o visual final.  
Nosso pipeline replica essa lógica separando as responsabilidades entre o MatCap (PNG) e o Three.js (GLSL).

---

## Como o visual final é montado

```
MatCap PNG  (Cables.gl)       → textura base baked
× Color #888888               → multiplicado no MeshMatcapMaterial
+ Fresnel   (GLSL / Three.js) → brilho nas bordas chanfradas
+ Noise     (GLSL / Three.js) → granulação por coordenadas locais do cubo
= visual final nos cubos
```

---

## Tabela de responsabilidades

| Camada              | MatCap (PNG) | Three.js (GLSL)         |
|---------------------|:------------:|:-----------------------:|
| Cor base #888888    | ✅ baked     | ✅ color no MeshMatcapMaterial |
| Reflexo metálico    | ✅ baked     | ❌                      |
| Highlight direcional| ✅ baked     | ❌                      |
| Roughness visual    | ✅ baked     | ❌                      |
| Fresnel (bordas)    | ❌           | ✅ GLSL onBeforeCompile |
| Noise/granulação    | ❌           | ✅ GLSL coords locais   |
| Splash central      | ❌           | ✅ gradiente procedural |
| Gradiente espacial  | ❌           | ✅ worldPosition        |
| Reação ao cursor    | ❌           | ✅ já implementado      |

---

## Matcap_1 — Base Simples

**Arquivo:** `matcap-base-grafite.png`  
**Resolução:** 1024 × 1024px  
**Fundo:** preto puro `#000000`

### O que contém
- Cor base difusa `#888888`
- Um highlight direcional no **canto superior esquerdo**
- Gradiente suave do claro para o escuro
- Transição natural de luminância nas bordas

### O que NÃO contém
- Fresnel
- Noise
- Rim light
- Luz de preenchimento

### Configuração usada no Cables.gl

```
Nós ativos:
  MainLoop → ClearColor → DirectionalLight → Camera → PhongMaterial → RenderGeometry ← Sphere

PhongMaterial:
  Diffuse r/g/b: 0.38 / 0.38 / 0.38
  Shininess: 25

DirectionalLight (principal):
  x: -3.0 / y: 3.0 / z: 1.5
  intensity: 2.0
  color: #FFFFFF

DirectionalLight (fill suave):
  x: 1.0 / y: -0.5 / z: 1.0
  intensity: 0.12
  color: #CCCCCC

Camera:
  mode: ortogonal
  fov: 14
  eye Z: 3

MainLoop:
  Transparent: 0
  width: 1024
  height: 1024
```

### Quando usar
- Testes iniciais de luminância
- Validação de cor base nos cubos
- Ambientes com shader customizado que já aplica Fresnel e Noise robusto

---

## Matcap_2 — Complexo

**Arquivo:** `matcap-complexo-grafite.png`  
**Resolução:** 1024 × 1024px  
**Fundo:** preto puro `#000000`

### O que contém
- Cor base difusa `#888888`
- Highlight direcional no **canto superior esquerdo**
- **Rim light** na borda inferior direita (segunda DirectionalLight)
- **Fresnel baked** nas bordas (branco puro)
- **Noise** sutil em Blendmode Add
- Variação de luminância no corpo da esfera

### O que NÃO contém
- Gradiente espacial por worldPosition
- Splash central escuro
- Reação ao cursor

> Mesmo com Fresnel baked, o Three.js ainda aplica um Fresnel GLSL  
> por cima para garantir que as bordas chanfradas dos cubos respondam  
> corretamente à câmera em tempo real.

### Configuração usada no Cables.gl

```
Nós ativos:
  MainLoop → ClearColor → DirLight1 → DirLight2 → Camera → PhongMaterial
  → MeshPixelNoise → FresnelGlow → RenderGeometry ← Sphere

PhongMaterial:
  Diffuse r/g/b: 0.35 / 0.35 / 0.35
  Shininess: 55

DirectionalLight 1 (principal):
  x: -3.0 / y: 3.0 / z: 1.5
  intensity: 1.7
  color: #FFFFFF

DirectionalLight 2 (rim):
  x: 1.5 / y: -1.0 / z: 0.5
  intensity: 0.5
  color: #FFFFFF

FresnelGlow:
  R: 1.0 / G: 1.0 / B: 1.0
  Fresnel Intensity: 0.7
  Fresnel Exponent: 5.5

MeshPixelNoise:
  Scale: 80
  Amount: 0.06
  Blendmode: Add
  r/g/b: 0.5 / 0.5 / 0.5
  WorldSpace: 0

Camera:
  mode: ortogonal
  fov: 14
  eye Z: 3

MainLoop:
  Transparent: 0
  width: 1024
  height: 1024
```

### Quando usar
- Aplicação direta com `MeshMatcapMaterial` simples
- Quando o shader customizado do Three.js for mais leve (sem Fresnel GLSL robusto)
- Testes visuais mais próximos do resultado final

---

## Como usar no Three.js

### Opção A — MeshMatcapMaterial direto

```js
const matcap = useLoader(THREE.TextureLoader, '/images/matcap-complexo-grafite.png')

const mat = new THREE.MeshMatcapMaterial({
  matcap,
  color: new THREE.Color('#888888'),
})
```

### Opção B — Shader customizado com Fresnel e Noise (recomendada)

```js
const mat = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
  color: new THREE.Color('#888888'),
})

mat.onBeforeCompile = (shader) => {
  shader.uniforms.uFresnelStrength = { value: 0.6 }
  shader.uniforms.uNoiseStrength   = { value: 0.12 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <output_fragment>',
    `
    // Fresnel — brilho nas bordas chanfradas
    vec3 n = normalize(vNormal);
    vec3 v = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0) * uFresnelStrength;
    gl_FragColor.rgb += vec3(0.85, 0.90, 1.0) * fresnel;

    // Noise — granulação por coordenadas locais do cubo
    float grain = fract(sin(dot(vLocalPos * 8.0, vec2(127.1, 311.7))) * 43758.5);
    gl_FragColor.rgb *= mix(1.0 - uNoiseStrength, 1.0 + uNoiseStrength, grain);

    #include <output_fragment>
    `
  )
}
```

> O Noise usa `vLocalPos` (coordenadas locais do cubo) para que a  
> granulação fique estável na superfície mesmo quando o cubo se move.

---

## Checklist de validação do PNG exportado

Antes de usar o PNG no projeto, confirme:

- [ ] Fundo preto puro `#000000` — não transparente
- [ ] Esfera perfeitamente centralizada
- [ ] Imagem quadrada 1024 × 1024
- [ ] Sem sombra projetada fora da esfera
- [ ] Sem bordas ou artefatos nas extremidades
- [ ] Highlight visível no canto superior esquerdo
- [ ] Sem segundo ponto de brilho indesejado (Matcap_1)
- [ ] Fresnel visível nas bordas sem vazar para o centro (Matcap_2)

---

## Arquivos

```
/public/images/
  matcap-base-grafite.png       ← Matcap_1
  matcap-complexo-grafite.png   ← Matcap_2
```

---

*Documentação gerada durante o desenvolvimento do Hero Montabox.*  
*MatCaps criados no Cables.gl. Aplicação final em React + Three.js + React Three Fiber.*
