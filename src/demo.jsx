import { useState, useEffect, useCallback, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import logoSrc from "./assets/logo.png";
import broncoSrc from "./assets/bronco-photo.png";

/* ═══ TOKENS ═══ */
const B = {
  brand: "#5C0099", brandH: "#46006d", brandBg: "#F3ECFA", brandBd: "#D4BFE8",
  brandGrad: "linear-gradient(135deg, #ff4289 0%, #be00a4 50%, #5C0099 100%)",
  red: "#F83C50", redBg: "#FEF1F2", redBd: "#FCD5D9",
  crit: "#B91C1C", critBg: "#FEF2F2", critBd: "#FECACA",
  orange: "#EA580C", orangeBg: "#FFF7ED", orangeBd: "#FED7AA",
  g900: "#111827", g700: "#374151", g500: "#6B7280", g300: "#D1D5DB", g200: "#E5E7EB", g100: "#F3F4F6", g50: "#F9FAFB",
  white: "#FFFFFF", pageBg: "#EEEAF4", black: "#0B0B0C",
  ok: "#16A34A", okBg: "#F0FDF4", okBd: "#BBF7D0",
  yn: "#FFFF00", ynBg: "#FEFCBF", ynBd: "#FDE047", ynT: "#0B0B0C",
  sh: "0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04)",
};

/* ═══ ICONS ═══ */
const I = ({ d, s = 16, c = "currentColor", style: st, ...r }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={st} {...r}>{d}</svg>;
const Shield = p => <I s={p.s} c={p.c} d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}/>;
const Check = p => <I s={p.s} c={p.c} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}/>;
const Tri = p => <I s={p.s} c={p.c} d={<><path d="m10.29 3.86-8.47 14.14a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1={12} y1={9} x2={12} y2={13}/><line x1={12} y1={17} x2={12.01} y2={17}/></>}/>;
const Circ = p => <I s={p.s} c={p.c} d={<><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12.01} y2={16}/></>}/>;
const Dollar = p => <I s={p.s} c={p.c} d={<><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>;
const Cam = p => <I s={p.s} c={p.c} d={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx={12} cy={13} r={4}/></>}/>;
const Eye = p => <I s={p.s} c={p.c} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></>}/>;
const Wrench = p => <I s={p.s} c={p.c} d={<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}/>;
const Lock = p => <I s={p.s} c={p.c} d={<><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}/>;
const DL = p => <I s={p.s} c={p.c} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1={12} y1={15} x2={12} y2={3}/></>}/>;
const FileIc = p => <I s={p.s} c={p.c} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}/>;
const Bar = p => <I s={p.s} c={p.c} d={<><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/></>}/>;
const Arr = p => <I s={p.s} c={p.c} d={<><line x1={5} y1={12} x2={19} y2={12}/><polyline points="12 5 19 12 12 19"/></>}/>;
const Srch = p => <I s={p.s} c={p.c} d={<><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></>}/>;
const ChevD = p => <I s={p.s} c={p.c} d={<polyline points="6 9 12 15 18 9"/>}/>;
const ChevR = p => <I s={p.s} c={p.c} style={{transform:p.rot?`rotate(${p.rot}deg)`:undefined}} d={<polyline points="9 18 15 12 9 6"/>}/>;
const HistIc = p => <I s={p.s} c={p.c} d={<><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></>}/>;

/* ═══ SHARED UI ═══ */
const Card = ({ children, style, accent }) => <div data-hover="card" style={{ background: B.white, border: `1px solid ${accent ? B.brandBd : B.g200}`, borderRadius: "14px", padding: "20px", boxShadow: B.sh, ...style }}>{children}</div>;
const SevPill = ({ sev }) => { const m = { Critical: [B.critBg, B.crit, B.critBd], Major: [B.orangeBg, B.orange, B.orangeBd], Moderate: [B.ynBg, B.ynT, B.ynBd], Minor: [B.okBg, B.ok, B.okBd], High: [B.orangeBg, B.orange, B.orangeBd] }; const [bg, c, bd] = m[sev] || m.Moderate; return <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: bg, color: c, border: `1px solid ${bd}` }}>{sev}</span>; };
const SPill = ({ children, v }) => { const m = { ok: [B.okBg, B.ok, B.okBd], yn: [B.ynBg, B.ynT, B.ynBd], red: [B.redBg, B.red, B.redBd] }; const [bg, c, bd] = m[v] || m.yn; return <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: bg, color: c, border: `1px solid ${bd}` }}>{children}</span>; };
const Btn = ({ children, onClick, primary, secondary, style }) => <button data-hover="btn" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, border: secondary ? `1px solid ${B.g200}` : "none", background: secondary ? B.white : primary ? B.brandGrad : B.brand, color: secondary ? B.g700 : B.white, cursor: "pointer", boxShadow: secondary ? "none" : primary ? "0 2px 8px rgba(92,0,153,0.25),0 1px 2px rgba(0,0,0,.04)" : B.sh, ...style }}>{children}</button>;
const PBar = ({ v, c }) => <div style={{ width: "100%", height: "6px", background: B.g100, borderRadius: "3px", overflow: "hidden" }}><div style={{ width: v + "%", height: "100%", background: c, borderRadius: "3px", transition: "width 0.8s ease" }} /></div>;
const Dot = ({ c }) => <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />;
const Label = ({ children }) => <div style={{ fontSize: "11px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{children}</div>;

const BroncoModel = ({ activeRisk, onSpotClick }) => {
  const mountRef = useRef(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({x:0,y:0});
  const autoRotate = useRef(true);
  const rotY = useRef(0.45);
  const rotX = useRef(0.05);
  const frameRef = useRef(null);
  const [hsp, setHsp] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;
    const ctr = mountRef.current;
    const W = ctr.clientWidth, H = ctr.clientHeight || 440;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(28, W/H, 0.1, 200);
    cam.position.set(7.0, 3.5, 9.0);
    cam.lookAt(0, 0.65, 0);

    const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setSize(W,H); ren.setPixelRatio(Math.min(window.devicePixelRatio,2)); ren.setClearColor(0,0);
    ctr.appendChild(ren.domElement);

    scene.add(new THREE.AmbientLight(0xd0d0d8, 0.7));
    const kL = new THREE.DirectionalLight(0xffffff, 0.5); kL.position.set(5,10,7); scene.add(kL);
    const fL = new THREE.DirectionalLight(0xb0b0c0, 0.25); fL.position.set(-5,4,-4); scene.add(fL);
    const rL = new THREE.DirectionalLight(0xa0a0b0, 0.15); rL.position.set(0,2,-10); scene.add(rL);

    const vg = new THREE.Group(); scene.add(vg);

    /* Ground */
    const grid = new THREE.GridHelper(16,40,0xd0d4d8,0xe2e4e8);
    grid.position.y = -0.02; grid.material.transparent = true; grid.material.opacity = 0.30;
    scene.add(grid);
    const shG = new THREE.CircleGeometry(3,48);
    const shM = new THREE.MeshBasicMaterial({color:0xc0c4c8,transparent:true,opacity:0.06,side:THREE.DoubleSide});
    const sh = new THREE.Mesh(shG,shM); sh.rotation.x=-Math.PI/2; sh.position.set(0,-0.01,0); sh.scale.set(1.5,1,1);
    scene.add(sh);

    /* Hotspot positions — calibrated to mesh geometry
       Anchor: original Head Gasket (0, 0.82, 1.54) = engine bay top center
       Body: X ±0.55, Y 0–1.50, Z -1.40 to 1.60
       Hood line: Y ~0.80, Z 1.0–1.55
       Underbody: Y ~0.20–0.35
       Cabin roof: Y ~1.30–1.50
       Wheel center: X ±0.52, Y ~0.30 */
    const hotspots = [
      /* Engine Bay — clustered on hood area */
      {id:0,  pos:new THREE.Vector3(0, 0.82, 1.54),      color:"#B91C1C"},   // Engine Coolant (top center engine)
      {id:2,  pos:new THREE.Vector3(-0.18, 0.78, 1.48),   color:"#B91C1C"},   // Turbocharger (left of center)
      {id:3,  pos:new THREE.Vector3(0.20, 0.76, 1.50),    color:"#B91C1C"},   // Fuel Injector (right of center)
      {id:6,  pos:new THREE.Vector3(-0.28, 0.72, 1.25),   color:"#EA580C"},   // Water Pump (left mid engine)
      {id:14, pos:new THREE.Vector3(0.38, 0.74, 1.20),    color:"#16A34A"},   // 12V Battery (right front)
      {id:15, pos:new THREE.Vector3(0.05, 0.85, 1.35),    color:"#16A34A"},   // Filters (top center)
      /* Underbody Front — transmission */
      {id:1,  pos:new THREE.Vector3(0, 0.28, 1.10),       color:"#B91C1C"},   // Transmission (center low front)
      {id:8,  pos:new THREE.Vector3(0, 0.25, 0.50),       color:"#FFFF00"},   // Shift Calibration (center low mid)
      /* Rear Underbody */
      {id:4,  pos:new THREE.Vector3(0, 0.28, -1.15),      color:"#EA580C"},   // Rear Drive Unit (center low rear)
      {id:9,  pos:new THREE.Vector3(0.15, 0.30, -0.95),   color:"#FFFF00"},   // EVAP Purge (right rear)
      /* Wheel Areas */
      {id:10, pos:new THREE.Vector3(-0.50, 0.32, 0.85),   color:"#FFFF00"},   // Suspension (left front wheel)
      {id:11, pos:new THREE.Vector3(0.50, 0.30, 0.85),    color:"#FFFF00"},   // Brake Wear (right front wheel)
      {id:13, pos:new THREE.Vector3(-0.38, 0.58, 1.45),   color:"#16A34A"},   // Driver Assist (left headlight)
      /* Cabin / Dash */
      {id:7,  pos:new THREE.Vector3(0.25, 0.90, -0.05),   color:"#EA580C"},   // BCM (right dash)
      {id:5,  pos:new THREE.Vector3(-0.12, 0.55, 0.55),   color:"#EA580C"},   // Steering Rack (left front low)
      {id:12, pos:new THREE.Vector3(0, 1.08, 0.25),       color:"#16A34A"},   // SYNC (center dash/windshield)
    ];

    /* Load and display model */
    new OBJLoader().load('/models/bronco.obj', (obj) => {
      /* Merge all child geometries into one */
      const geos = [];
      obj.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const g = child.geometry.clone();
          if (child.matrixWorld) g.applyMatrix4(child.matrixWorld);
          geos.push(g);
        }
      });
      const geom = new THREE.BufferGeometry();
      let totalVerts = 0, totalIdx = 0;
      for (const g of geos) { totalVerts += g.attributes.position.count; totalIdx += (g.index ? g.index.count : g.attributes.position.count); }
      const mergedPos = new Float32Array(totalVerts * 3);
      const mergedIdx = new Uint32Array(totalIdx);
      let vOff = 0, iOff = 0, vCount = 0;
      for (const g of geos) {
        const pos = g.attributes.position.array;
        mergedPos.set(pos, vOff * 3);
        if (g.index) {
          for (let i = 0; i < g.index.count; i++) mergedIdx[iOff + i] = g.index.array[i] + vOff;
          iOff += g.index.count;
        } else {
          for (let i = 0; i < g.attributes.position.count; i++) mergedIdx[iOff + i] = vOff + i;
          iOff += g.attributes.position.count;
        }
        vOff += g.attributes.position.count;
      }
      geom.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
      geom.setIndex(new THREE.BufferAttribute(mergedIdx, 1));
      geom.computeVertexNormals();

      /* Center and normalize */
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      const cx = (box.max.x + box.min.x) / 2;
      const cy = box.min.y;
      const cz = (box.max.z + box.min.z) / 2;
      geom.translate(-cx, -cy, -cz);

      /* Ghost fill — semi-transparent body */
      const mGhost = new THREE.MeshPhongMaterial({
        color: 0xe2e4e8, transparent: true, opacity: 0.08,
        side: THREE.DoubleSide, depthWrite: false,
        shininess: 30, specular: 0xffffff
      });
      vg.add(new THREE.Mesh(geom, mGhost));

      /* Wireframe overlay — fine mesh detail */
      const mWire = new THREE.MeshBasicMaterial({
        color: 0x8890a0, wireframe: true, transparent: true, opacity: 0.04
      });
      vg.add(new THREE.Mesh(geom.clone(), mWire));

      /* Edge lines — CAD wireframe look (async to avoid blocking) */
      setTimeout(() => {
        const edges = new THREE.EdgesGeometry(geom, 25);
        const mEdge = new THREE.LineBasicMaterial({
          color: 0x606870, transparent: true, opacity: 0.55
        });
        vg.add(new THREE.LineSegments(edges, mEdge));
      }, 100);

      setLoading(false);
    });
    /* Animation */
    let aW = W, aH = H;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotate.current) rotY.current += 0.0025;
      vg.rotation.y = rotY.current;
      vg.rotation.x = rotX.current;
      vg.updateMatrixWorld();
      setHsp(hotspots.map(h => {
        const wp = h.pos.clone();
        vg.localToWorld(wp);
        const p = wp.project(cam);
        return { ...h, sx: (p.x*0.5+0.5)*aW, sy: (-p.y*0.5+0.5)*aH, visible: p.z < 1 };
      }));
      ren.render(scene, cam);
    };
    animate();

    /* Interaction */
    const onMD = e => { isDragging.current=true; autoRotate.current=false; prevMouse.current={x:e.clientX,y:e.clientY}; };
    const onMM = e => { if(!isDragging.current)return; rotY.current+=(e.clientX-prevMouse.current.x)*0.005; rotX.current=Math.max(-0.25,Math.min(0.25,rotX.current+(e.clientY-prevMouse.current.y)*0.003)); prevMouse.current={x:e.clientX,y:e.clientY}; };
    const onMU = () => { isDragging.current=false; setTimeout(()=>{ if(!isDragging.current)autoRotate.current=true; },4000); };
    const onTS = e => { isDragging.current=true; autoRotate.current=false; prevMouse.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTM = e => { if(!isDragging.current)return; rotY.current+=(e.touches[0].clientX-prevMouse.current.x)*0.005; rotX.current=Math.max(-0.25,Math.min(0.25,rotX.current+(e.touches[0].clientY-prevMouse.current.y)*0.003)); prevMouse.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTE = () => { isDragging.current=false; setTimeout(()=>{ if(!isDragging.current)autoRotate.current=true; },4000); };

    const el = ren.domElement;
    el.addEventListener("mousedown",onMD); window.addEventListener("mousemove",onMM); window.addEventListener("mouseup",onMU);
    el.addEventListener("touchstart",onTS,{passive:true}); window.addEventListener("touchmove",onTM,{passive:true}); window.addEventListener("touchend",onTE);
    const onResize = () => { const w=ctr.clientWidth,h=ctr.clientHeight||440; aW=w; aH=h; cam.aspect=w/h; cam.updateProjectionMatrix(); ren.setSize(w,h); };
    window.addEventListener("resize",onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener("mousedown",onMD); window.removeEventListener("mousemove",onMM); window.removeEventListener("mouseup",onMU);
      el.removeEventListener("touchstart",onTS); window.removeEventListener("touchmove",onTM); window.removeEventListener("touchend",onTE);
      window.removeEventListener("resize",onResize);
      ren.dispose(); if(ctr.contains(ren.domElement))ctr.removeChild(ren.domElement);
    };
  },[]);

  return (
    <div style={{position:"relative"}}>
      <div ref={mountRef} style={{width:"100%",height:"440px",borderRadius:"10px",overflow:"hidden",background:"linear-gradient(180deg,#f5f2f9 0%,#ede8f3 35%,#e4dff0 100%)",cursor:"grab"}}/>
      {loading && <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"13px",color:B.g500,display:"flex",alignItems:"center",gap:"8px"}}>
        <div style={{width:16,height:16,border:"2px solid "+B.g200,borderTopColor:B.brand,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        Loading 3D model…
      </div>}
      {!loading && hsp.filter(h=>h.visible && activeRisk===h.id).map(h=>(
        <button key={h.id} onClick={()=>onSpotClick?.(h.id)} style={{
          position:"absolute",left:h.sx+"px",top:h.sy+"px",transform:"translate(-50%,-50%)",
          width:activeRisk===h.id?20:12,height:activeRisk===h.id?20:12,borderRadius:"50%",
          border:`1px solid ${h.color}`,background:activeRisk===h.id?h.color+"25":"rgba(255,255,255,0.35)",
          cursor:"pointer",transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 0 6px ${h.color}25`,zIndex:10,
        }}><div style={{width:activeRisk===h.id?5:3,height:activeRisk===h.id?5:3,borderRadius:"50%",background:h.color}}/></button>
      ))}
      <div style={{display:"flex",justifyContent:"center",gap:"14px",marginTop:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:B.g500}}><Dot c={B.crit}/> Critical</div>
        <div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:B.g500}}><Dot c={B.orange}/> Major</div>
        <div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:B.g500}}><Dot c="#FFFF00"/> Moderate</div>
        <div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color:B.g500}}><Dot c={B.ok}/> Minor</div>
      </div>
      <div style={{textAlign:"center",marginTop:"6px",fontSize:"11px",color:B.g500}}>Drag to rotate • Click hotspots to inspect • Auto-rotates</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

/* ═══ RISK DATA ═══ */
const risks = [
  /* Level 1 — Critical */
  { id: 0, sev: "Critical", Icon: Tri, c: B.crit, t: "Engine Coolant Intrusion Risk", cost: "$2,800 – $4,500+", what: "The 1.5L EcoBoost in 2021–2024 Bronco Sport models has a documented pattern of cylinder head gasket degradation, allowing coolant to enter combustion chambers or the oil system.", why: "Coolant intrusion can cause progressive internal engine damage. If undetected, it may lead to overheating, bearing failure, or complete engine replacement.", symptoms: ["White exhaust smoke under sustained load", "Coolant reservoir level dropping without visible leak", "Milky residue on oil filler cap or dipstick", "Sweet smell from exhaust or engine bay"] },
  { id: 1, sev: "Critical", Icon: Tri, c: B.crit, t: "Internal Transmission Failure Risk", cost: "$3,000 – $5,500", what: "The 8-speed automatic transmission paired with the 1.5L EcoBoost has reported cases of internal clutch pack failure, torque converter shudder, and valve body malfunction in early production units.", why: "Transmission failure is one of the highest-cost repairs on this platform. Intermittent symptoms can mask progressive internal wear that leads to complete unit replacement.", symptoms: ["Harsh or delayed shifts between 2nd and 4th gear", "Shudder or vibration at highway speed under light throttle", "Transmission warning light or limp mode activation", "Fluid discoloration or burnt odor on dipstick"] },
  { id: 2, sev: "Critical", Icon: Tri, c: B.crit, t: "Turbocharger System Failure", cost: "$1,800 – $2,800", what: "The low-displacement turbo on the 1.5L EcoBoost operates at high boost pressure relative to engine size. Bearing wear, wastegate actuator failure, and boost leaks have been reported across the platform.", why: "Turbocharger failure results in significant power loss, potential oil contamination, and can cause cascading damage to the intake and exhaust systems if debris enters the engine.", symptoms: ["Whining or siren-like noise during acceleration", "Noticeable loss of power or boost lag", "Oil residue around turbo inlet or intercooler piping", "Check engine light with boost-related codes"] },
  { id: 3, sev: "Critical", Icon: Tri, c: B.crit, t: "Fuel Injector Leak Risk", cost: "$600 – $1,100", what: "Direct-injection fuel injectors on the 1.5L EcoBoost have shown a failure pattern involving O-ring degradation and micro-cracking at the injector seat, allowing fuel seepage onto the intake manifold.", why: "Fuel leaks near the engine create a fire risk and can affect fuel trim, combustion efficiency, and emissions compliance. This is a known platform exposure with multiple NHTSA complaints.", symptoms: ["Raw fuel smell at cold start or under hood", "Visible wet spots or staining near injector rail", "Rough idle or intermittent misfire codes", "Fuel residue on intake manifold surface"] },
  /* Level 2 — Major */
  { id: 4, sev: "Major", Icon: Circ, c: B.orange, t: "Rear Drive Unit Failure", cost: "$1,200 – $2,000", what: "The rear drive unit (PTU/RDU) in AWD Bronco Sport models has reported premature clutch pack wear and bearing noise, particularly in vehicles driven frequently in low-speed turning situations.", why: "Rear drive unit failure disables AWD functionality and produces audible symptoms that reduce retail confidence. Full unit replacement is common when internal components are worn.", symptoms: ["Grinding or whining noise during low-speed turns", "Vibration from rear axle area during acceleration", "AWD malfunction indicator on dashboard", "Metallic particles visible in rear differential fluid"] },
  { id: 5, sev: "Major", Icon: Circ, c: B.orange, t: "Electric Steering Rack Fault", cost: "$1,200 – $2,000", what: "The electric power steering system on this platform has reported instances of assist motor failure, torque sensor drift, and steering rack internal wear leading to inconsistent steering feel.", why: "Steering system faults are safety-relevant and affect drivability. Intermittent assist loss or uneven steering effort can surface under specific driving conditions and worsen over time.", symptoms: ["Momentary steering assist loss or heaviness", "Steering pulls to one side without alignment cause", "Clunking or binding sensation when turning at low speed", "Power steering warning light illumination"] },
  { id: 6, sev: "Major", Icon: Circ, c: B.orange, t: "Water Pump Cooling Failure", cost: "$900 – $1,400", what: "The water pump on the 1.5L EcoBoost has a documented failure pattern involving internal bearing degradation and weep hole leakage, typically between 18K and 35K miles.", why: "Water pump failure leads to coolant loss and overheating. Because symptoms overlap with head gasket issues, misdiagnosis is common — increasing the risk of delayed or incorrect repair.", symptoms: ["Dried coolant trail below water pump weep hole", "Engine temperature gauge running higher than normal", "Grinding noise from front of engine at idle", "Coolant puddle under vehicle after parking"] },
  { id: 7, sev: "Major", Icon: Circ, c: B.orange, t: "Battery / BCM Voltage Instability", cost: "$150 – $1,800", what: "The Body Control Module (BCM) in 2021–2024 Bronco Sport models has a known software condition that causes parasitic battery drain, leading to dead batteries after 2–3 days of inactivity.", why: "Voltage instability affects all vehicle electronics and can trigger cascading fault codes. BCM reflash is the first-line fix, but some units require hardware replacement at significantly higher cost.", symptoms: ["Dead battery after sitting 2–3 days unused", "Intermittent electrical glitches or warning lights", "Slow cranking or failure to start", "Battery date code indicating original unit still installed"] },
  /* Level 3 — Moderate */
  { id: 8, sev: "Moderate", Icon: Wrench, c: B.black, t: "Transmission Shift Calibration", cost: "$0 – $1,200", what: "Some 2021–2024 Bronco Sport units exhibit rough or hesitant shifting behavior that may be related to adaptive transmission calibration drift or software revision gaps.", why: "Shift quality issues reduce driving refinement and can indicate early signs of internal transmission wear. In many cases, a TCM recalibration or software update resolves the behavior.", symptoms: ["Rough or jerky shifts at low speed", "Hesitation between gear changes during acceleration", "Occasional gear hunting on inclines", "Shift behavior that changes with temperature"] },
  { id: 9, sev: "Moderate", Icon: Wrench, c: B.black, t: "EVAP Purge System Fault", cost: "$250 – $600", what: "The evaporative emissions (EVAP) purge valve and associated hoses on this platform have shown a failure pattern that triggers check engine lights and emissions non-compliance.", why: "EVAP faults cause emissions test failures and can affect fuel system vapor management. While not a drivability concern, unresolved codes complicate resale and dealer certification.", symptoms: ["Check engine light with P0441 or P0455 codes", "Fuel smell near the rear of the vehicle", "Difficulty at fuel pump — nozzle clicks off repeatedly", "Hissing sound from engine bay when opening fuel cap"] },
  { id: 10, sev: "Moderate", Icon: Wrench, c: B.black, t: "Front or Rear Suspension Wear", cost: "$400 – $900", what: "Bronco Sport suspension components, particularly front strut mounts and rear shock absorbers, show accelerated wear in vehicles used on mixed-surface roads or in regions with poor pavement.", why: "Worn suspension reduces ride quality, affects tire wear patterns, and can mask alignment issues. Components typically degrade progressively, making inspection timing important.", symptoms: ["Clunking noise over bumps from front or rear", "Uneven tire wear on front axle", "Vehicle feels loose or floaty at highway speed", "Visible oil weeping on shock absorber body"] },
  { id: 11, sev: "Moderate", Icon: Wrench, c: B.black, t: "Brake Pad and Rotor Wear", cost: "$300 – $800", what: "Bronco Sport models in the 20K–30K mile range commonly show accelerated front brake wear due to vehicle weight distribution and regenerative braking calibration on AWD variants.", why: "Brake wear at inspection is a standard cost consideration. Premature wear indicates potential caliper or rotor issues that affect reconditioning estimates.", symptoms: ["Squealing or grinding noise during braking", "Vibration or pulsation in brake pedal", "Visible rotor scoring or uneven pad thickness", "Increased stopping distance compared to expected"] },
  /* Level 4 — Minor */
  { id: 12, sev: "Minor", Icon: Eye, c: B.ok, t: "SYNC Infotainment Instability", cost: "$0 – $900", what: "The SYNC 3 and SYNC 4 infotainment systems in Bronco Sport models have reported software instability including screen freezes, Bluetooth disconnects, and navigation system lag.", why: "Infotainment issues affect perceived quality and customer satisfaction. Most are resolved via software update, but hardware failures (APIM module) require component replacement.", symptoms: ["Touchscreen freezes or becomes unresponsive", "Bluetooth audio drops or fails to reconnect", "Backup camera display lag or black screen", "System reboot cycle during driving"] },
  { id: 13, sev: "Minor", Icon: Eye, c: B.ok, t: "Driver Assist Sensor Malfunction", cost: "$150 – $500", what: "Forward-facing camera, radar sensors, and blind-spot monitoring modules on this platform can lose calibration or produce false alerts due to sensor contamination or mounting shift.", why: "ADAS sensor faults disable safety features and trigger dashboard warnings. Recalibration is typically required after windshield replacement or front-end work.", symptoms: ["Pre-collision warning activating without cause", "Blind-spot monitor light staying illuminated", "Adaptive cruise control becoming unavailable", "Calibration warning message on instrument cluster"] },
  { id: 14, sev: "Minor", Icon: Eye, c: B.ok, t: "Standard 12V Battery Replacement", cost: "$150 – $350", what: "The factory 12V battery in 2021–2024 Bronco Sport models has a typical service life of 3–4 years. Vehicles approaching this window may require proactive replacement, particularly in extreme climates.", why: "Battery replacement is a routine maintenance item, but it affects acquisition cost calculations. Original batteries nearing end-of-life should be factored into reconditioning estimates.", symptoms: ["Slow engine cranking at startup", "Battery age exceeding 3 years on date code", "Low voltage warning on dashboard", "Electrical accessories dimming at idle"] },
  { id: 15, sev: "Minor", Icon: Eye, c: B.ok, t: "Cabin or Engine Filter Service", cost: "$50 – $200", what: "Cabin air filter and engine air filter service intervals on the Bronco Sport are typically 15K–20K miles. Vehicles in dusty or high-pollen environments may require earlier replacement.", why: "Filter condition is a minor but visible indicator of maintenance history. Clogged filters can affect HVAC performance and engine efficiency, and are easily inspected during acquisition.", symptoms: ["Reduced airflow from cabin vents", "Musty odor from HVAC system", "Visible debris or discoloration on filter media", "Slight decrease in fuel efficiency"] },
];

/* ═══ PAGE 0: INTRO ═══ */
const P0 = ({ go }) => {
  const [phase, setPhase] = useState(0);
  const [dealer, setDealer] = useState("");
  const [pass, setPass] = useState("");
  const fullDealer = "premier_ford";
  const fullPass = "••••••••••";
  useEffect(() => {
    if (phase === 0) { let i = 0; const iv = setInterval(() => { i++; setDealer(fullDealer.slice(0, i)); if (i >= fullDealer.length) { clearInterval(iv); setTimeout(() => setPhase(1), 400); } }, 70); return () => clearInterval(iv); }
  }, [phase]);
  useEffect(() => {
    if (phase === 1) { let i = 0; const iv = setInterval(() => { i++; setPass(fullPass.slice(0, i)); if (i >= fullPass.length) { clearInterval(iv); setTimeout(() => setPhase(2), 500); } }, 90); return () => clearInterval(iv); }
  }, [phase]);
  useEffect(() => { if (phase === 2) { const t = setTimeout(() => setPhase(3), 1400); return () => clearTimeout(t); } }, [phase]);
  if (phase < 3) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", justifyContent: "center" }}>
          <img src={logoSrc} alt="VeriBuy" style={{ width: 44, height: 44, borderRadius: "12px", objectFit: "contain" }} />
          <div><div style={{ fontSize: "20px", fontWeight: 800, color: B.g900 }}>VeriBuy</div><div style={{ fontSize: "11px", color: B.g500, fontWeight: 500 }}>Dealer Portal</div></div>
        </div>
        <Card style={{ padding: "28px" }}>
          {phase < 2 ? <>
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Dealer ID</div>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "8px", background: B.g50, border: `1px solid ${phase === 0 ? B.brand : B.g200}`, minHeight: "44px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: B.g900, fontFamily: "monospace" }}>{dealer}</span>
                {phase === 0 && <span style={{ width: 2, height: 18, background: B.brand, marginLeft: 1, animation: "tc 1s step-end infinite" }} />}
              </div>
            </div>
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Password</div>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "8px", background: B.g50, border: `1px solid ${phase === 1 ? B.brand : B.g200}`, minHeight: "44px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: B.g900, letterSpacing: "2px" }}>{pass}</span>
                {phase === 1 && <span style={{ width: 2, height: 18, background: B.brand, marginLeft: 1, animation: "tc 1s step-end infinite" }} />}
              </div>
            </div>
            <div style={{ padding: "12px 24px", borderRadius: "10px", background: B.g200, color: B.g500, fontSize: "14px", fontWeight: 600, textAlign: "center" }}>Sign In</div>
          </> : <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", animation: "fadeIn 0.3s ease" }}>
              <div style={{ width: 32, height: 32, border: "3px solid " + B.brand, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "16px" }} />
              <div style={{ fontSize: "14px", fontWeight: 600, color: B.g700 }}>Authenticating...</div>
              <div style={{ fontSize: "12px", color: B.g500, marginTop: "4px" }}>Premier Ford Dealership</div>
            </div>
          </>}
        </Card>
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: B.g500 }}>Secured with end-to-end encryption</div>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <img src={logoSrc} alt="VeriBuy" style={{ width: 48, height: 48, borderRadius: "12px", objectFit: "contain" }} />
        <span style={{ fontSize: "26px", fontWeight: 800, color: B.g900 }}>VeriBuy</span>
      </div>
      <div style={{ fontSize: "13px", color: B.ok, fontWeight: 600, marginBottom: "28px", animation: "scaleIn 0.4s ease" }}>Welcome, Premier Ford Dealership</div>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: B.g900, margin: "0 0 14px", maxWidth: "580px", lineHeight: 1.2 }}>Pre-Purchase Vehicle Intelligence</h1>
      <p style={{ fontSize: "15px", color: B.g700, margin: "0 0 36px", maxWidth: "520px", lineHeight: 1.65 }}>VIN-specific risk intelligence, guided inspection capture, and live market pricing — producing verified condition reports for data-backed acquisition decisions.</p>
      <div style={{ display: "flex", gap: "16px", marginBottom: "36px", flexWrap: "wrap", justifyContent: "center" }}>
        {[[Tri, "Guided Inspection", "Structured capture identifies issues photos alone miss."],
          [Bar, "Market Pricing", "Live comps from AutoTrader, Cars.com & wholesale."],
          [Lock, "Verified Reports", "Blockchain-anchored evidence packages."]].map(([Icon, t, d], i) => (
          <Card key={i} style={{ flex: "1 1 0", minWidth: "170px", maxWidth: "220px", textAlign: "center", animation: `scaleIn 0.4s ease ${i * 0.1}s both` }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: B.brandBg, border: `1px solid ${B.brandBd}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon s={18} c={B.brand} /></div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: B.g900, marginBottom: "4px" }}>{t}</div>
            <div style={{ fontSize: "11px", color: B.g500, lineHeight: 1.55 }}>{d}</div>
          </Card>
        ))}
      </div>
      <Btn primary onClick={() => go(1)} style={{ animation: "scaleIn 0.4s ease 0.4s both" }}>Begin Verification <Arr s={14} c="#fff" /></Btn>
    </div>
  );
};

/* ═══ PAGE 1: VEHICLE ID ═══ */
const P1 = () => {
  const [ph, setPh] = useState(0);
  const [typed, setTyped] = useState("");

  const vin = "3FMCR9B60RRE18247";
  useEffect(() => {
    if (ph === 0) {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped(vin.slice(0, i));
        if (i >= vin.length) { clearInterval(iv); setTimeout(() => setPh(1), 600); }
      }, 80);
      return () => clearInterval(iv);
    }
  }, [ph]);
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: B.g900, margin: "0 0 4px" }}>Vehicle Identification</h2>
      <p style={{ color: B.g500, fontSize: "14px", marginBottom: "20px" }}>Enter a VIN to load vehicle data and known issues.</p>
      <Card>
        <Label>VIN Number</Label>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, padding: "12px 16px", background: B.g50, border: `1px solid ${B.g200}`, borderRadius: "10px", fontFamily: "monospace", fontSize: "15px", fontWeight: 600, color: B.g900, letterSpacing: "1px" }}>{typed}<span style={{ animation: "tc 1s step-end infinite", color: B.brand }}>|</span></div>
          <div style={{ padding: "12px 20px", borderRadius: "10px", background: ph >= 1 ? B.ok : B.brand, color: "#fff", fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>{ph >= 1 ? <><Check s={16} c="#fff" /> Decoded</> : <><Srch s={16} c="#fff" /> Decode</>}</div>
        </div>
        {ph >= 1 && <div style={{ animation: "su 0.4s ease" }}>
          <div style={{ padding: "20px", borderRadius: "10px", background: B.g50, border: `1px solid ${B.g200}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check s={16} c={B.ok} /><span style={{ fontSize: "14px", fontWeight: 700, color: B.g900 }}>Vehicle Identified</span></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              {[["Year","2024"],["Make","Ford"],["Model","Bronco Sport"],["Trim","Base"],["Body","4D SUV"],["Drivetrain","AWD"]].map(([k,v],i) => (
                <div key={i}><div style={{ fontSize: "11px", color: B.g500, marginBottom: "2px" }}>{k}</div><div style={{ fontSize: "14px", fontWeight: 600, color: B.g900 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px", padding: "12px 16px", background: B.white, borderRadius: "8px", border: `1px solid ${B.g200}`, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", color: B.g500 }}>Odometer: <b style={{ color: B.g900 }}>21,340 mi</b></span>
              <span style={{ color: B.g200 }}>|</span>
              <span style={{ fontSize: "13px", color: B.g500 }}>MSRP: <b style={{ color: B.g900 }}>$29,395</b></span>
            </div>
          </div>
        </div>}
      </Card>
    </div>
  );
};

/* ═══ PAGE 2: PRE-INSPECTION INTELLIGENCE ═══ */
const sevBorder = (sev, active) => {
  if (!active) return B.g200;
  if (sev === "Critical") return B.critBd;
  if (sev === "Major") return B.orangeBd;
  if (sev === "Moderate") return B.ynBd;
  if (sev === "Minor") return B.okBd;
  return B.g300;
};
const tierGroups = [
  { label: "Level 1 — Critical", sev: "Critical", ids: [0,1,2,3] },
  { label: "Level 2 — Major", sev: "Major", ids: [4,5,6,7] },
  { label: "Level 3 — Moderate", sev: "Moderate", ids: [8,9,10,11] },
  { label: "Level 4 — Minor", sev: "Minor", ids: [12,13,14,15] },
];
const P2 = () => {
  const [sel, setSel] = useState(-1);
  const [rev, setRev] = useState(0);
  useEffect(() => {
    const t = risks.map((_, i) => setTimeout(() => setRev(i + 1), 120 + i * 120));
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ maxWidth: "920px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: B.g900, margin: "0 0 4px" }}>Pre-Inspection Intelligence</h2>
      <p style={{ color: B.g500, fontSize: "14px", marginBottom: "20px" }}>Known failure points for 2024 Bronco Sport 1.5L EcoBoost — sourced from NHTSA, TSBs, and owner data.</p>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 48%", position: "sticky", top: "90px" }}>
          <Card style={{ padding: "12px", overflow: "hidden" }}>
            <BroncoModel activeRisk={sel} onSpotClick={(i) => setSel(i === sel ? -1 : i)} />
          </Card>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <Card style={{ padding: "14px 18px", background: "#4B5563", borderColor: "#6B7280", color: B.white }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: B.white }}>16 Risk Areas Identified</span>
              <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}><SevPill sev="Critical" /><SevPill sev="Major" /><SevPill sev="Moderate" /><SevPill sev="Minor" /></div>
            </div>
          </Card>
          {tierGroups.map((tier) => (
            <div key={tier.sev}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0 4px" }}>
                <SevPill sev={tier.sev} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: B.g500 }}>{tier.label}</span>
              </div>
              {tier.ids.map((rId) => {
                const r = risks[rId];
                const isOpen = sel === rId;
                return (
                  <div key={rId} style={{ marginBottom: "6px", opacity: rId < rev ? 1 : 0, transform: rId < rev ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease" }}>
                    <Card style={{ padding: 0, overflow: "hidden", borderColor: sevBorder(r.sev, isOpen) }}>
                      <button onClick={() => setSel(isOpen ? -1 : rId)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: B.g900 }}>{r.t}</span>
                          <div style={{ fontSize: "11px", color: B.g500, marginTop: "2px" }}>Est. repair: {r.cost}</div>
                        </div>
                        <ChevD s={14} c={B.g300} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                      </button>
                      {isOpen && <div style={{ padding: "0 16px 16px 16px", animation: "su 0.25s ease" }}>
                        <div style={{ marginBottom: "10px" }}>
                          <Label>What is it</Label>
                          <p style={{ fontSize: "13px", color: B.g700, lineHeight: 1.6, margin: "4px 0 0" }}>{r.what}</p>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <Label>Why it matters</Label>
                          <p style={{ fontSize: "13px", color: B.g700, lineHeight: 1.6, margin: "4px 0 0" }}>{r.why}</p>
                        </div>
                        <Label>Common symptoms</Label>
                        {r.symptoms.map((s, j) => <div key={j} style={{ display: "flex", gap: "8px", padding: "4px 0", fontSize: "12px", color: B.g700 }}><span style={{ color: B.g300 }}>—</span>{s}</div>)}
                      </div>}
                    </Card>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══ PAGE 3: GUIDED MEDIA CAPTURE ═══ */
const captureItems = [
  { label: "Front Centered", distance: "6 ft back, centered", angle: "Straight on, bumper height", coverage: "Full front fascia, both headlights visible" },
  { label: "Front 3/4 Driver", distance: "8 ft back, 45° left", angle: "Slightly above bumper line", coverage: "Driver fender, front wheel, A-pillar" },
  { label: "Driver Side", distance: "8 ft, perpendicular", angle: "Door handle height", coverage: "Full driver side, both wheels visible" },
  { label: "Rear 3/4 Driver", distance: "8 ft back, 45° left-rear", angle: "Taillight height", coverage: "Rear quarter panel, rear wheel, bumper" },
  { label: "Rear Centered", distance: "6 ft back, centered", angle: "Bumper height", coverage: "Full rear fascia, both taillights" },
  { label: "Passenger Side", distance: "8 ft, perpendicular", angle: "Door handle height", coverage: "Full passenger side, both wheels visible" },
  { label: "Engine Bay", distance: "2 ft above, centered", angle: "Top-down, slight tilt", coverage: "Full engine bay, all fluid reservoirs" },
  { label: "Under Hood Label", distance: "1 ft, direct focus", angle: "Perpendicular to label", coverage: "VIN label, emissions sticker legible" },
];
/* Corner bracket for viewfinder */
const Corner = ({ pos }) => {
  const s = { position: "absolute", width: 20, height: 20, borderColor: B.brand, borderStyle: "solid", borderWidth: 0 };
  if (pos === "tl") return <div style={{ ...s, top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 }} />;
  if (pos === "tr") return <div style={{ ...s, top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 }} />;
  if (pos === "bl") return <div style={{ ...s, bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 }} />;
  return <div style={{ ...s, bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 }} />;
};
const P3 = () => {
  const [captured, setCaptured] = useState(new Set());
  const [hudActive, setHudActive] = useState(false);
  const [hudIdx, setHudIdx] = useState(0);
  const [aligning, setAligning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const allDone = captured.size === captureItems.length;
  const nextUncaptured = () => { for (let i = 0; i < captureItems.length; i++) if (!captured.has(i)) return i; return -1; };
  const openHud = (idx) => { setHudIdx(idx >= 0 ? idx : nextUncaptured()); setHudActive(true); setAligning(false); setConfirmed(false); };
  const doCapture = () => {
    setAligning(true); setScore(0);
    setTimeout(() => { setScore(Math.floor(Math.random() * 6) + 95); }, 800);
    setTimeout(() => {
      setAligning(false); setConfirmed(true);
      setCaptured(prev => new Set([...prev, hudIdx]));
      setTimeout(() => {
        setConfirmed(false);
        /* auto-advance or close */
        let next = -1;
        for (let i = hudIdx + 1; i < captureItems.length; i++) { if (!captured.has(i) && i !== hudIdx) { next = i; break; } }
        if (next === -1) for (let i = 0; i < hudIdx; i++) { if (!captured.has(i) && i !== hudIdx) { next = i; break; } }
        if (next >= 0) { setHudIdx(next); } else { setHudActive(false); }
      }, 800);
    }, 1400);
  };
  const item = captureItems[hudIdx];
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: B.g900, margin: "0 0 4px" }}>Guided Media Capture</h2>
      <p style={{ color: B.g500, fontSize: "14px", marginBottom: "20px" }}>Structured, step-by-step capture ensures every inspection zone is documented with usable evidence.</p>
      {/* Progress + Start button */}
      <Card style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Cam s={16} c={B.brand} /><span style={{ fontSize: "14px", fontWeight: 700 }}>Photo Capture</span></div>
          <SPill v={allDone ? "ok" : "red"}>{captured.size} / {captureItems.length} {allDone ? "Complete" : "Remaining"}</SPill>
        </div>
        <PBar v={(captured.size / captureItems.length) * 100} c={allDone ? B.ok : B.brand} />
        {!allDone && <div style={{ marginTop: "12px", textAlign: "center" }}>
          <Btn onClick={() => openHud(nextUncaptured())}><Cam s={16} c="#fff" /> {captured.size === 0 ? "Start Guided Capture" : "Resume Capture"}</Btn>
        </div>}
      </Card>
      {/* Grid overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {captureItems.map((ci, i) => {
          const done = captured.has(i);
          return (
            <Card key={i} style={{ padding: "14px 16px", borderColor: done ? B.okBd : B.g200, cursor: done ? "default" : "pointer", animation: `scaleIn 0.3s ease ${i * 0.05}s both` }} onClick={() => !done && openHud(i)}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? B.ok : B.g100, border: `1px solid ${done ? B.okBd : B.g200}`, display: "flex", alignItems: "center", justifyContent: "center", color: done ? B.white : B.g500, fontSize: "13px", fontWeight: 700 }}>{done ? <Check s={16} c="#fff" /> : i + 1}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: "13px", fontWeight: 600, color: B.g900 }}>{ci.label}</div><div style={{ fontSize: "11px", color: B.g500 }}>{ci.distance}</div></div>
              </div>
            </Card>
          );
        })}
      </div>
      {/* Video/audio requirements */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[["Walkaround Video","60–90s"],["Engine Start Audio","15–30s"],["Interior Walkthrough","45–60s"]].map(([t,d],i) => (
          <Card key={i} style={{ padding: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: B.g900, marginBottom: "4px" }}>{t}</div>
            <div style={{ fontSize: "11px", color: B.g500 }}>{d}</div>
          </Card>
        ))}
      </div>
      {allDone && <Card style={{ padding: "14px 18px", background: B.okBg, borderColor: B.okBd, animation: "scaleIn 0.4s ease" }}><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check s={16} c={B.ok} /><span style={{ fontSize: "14px", fontWeight: 600, color: B.ok }}>All captures complete — ready for analysis</span></div></Card>}
      {/* ─── HUD OVERLAY ─── */}
      {hudActive && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
          <button onClick={() => setHudActive(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>✕ Close</button>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Shot {hudIdx + 1} of {captureItems.length}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{captured.size} captured</div>
        </div>
        {/* Viewfinder area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "16/10", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: `2px solid ${confirmed ? B.ok : aligning ? B.ok : "rgba(255,255,255,0.15)"}`, position: "relative", overflow: "hidden", animation: !aligning && !confirmed ? "borderPulse 2s ease infinite" : "none", transition: "border-color 0.3s ease" }}>
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
            {/* Crosshair */}
            {!aligning && !confirmed && <>
              <div style={{ position: "absolute", top: "50%", left: "20%", right: "20%", height: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", left: "50%", top: "20%", bottom: "20%", width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Cam s={48} c="rgba(255,255,255,0.12)" /></div>
            </>}
            {/* Scan line */}
            {aligning && <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${B.ok}, transparent)`, animation: "scanLine 1.2s ease infinite" }} />}
            {aligning && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 28, height: 28, border: "3px solid " + B.ok, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "12px" }} />
              <div style={{ fontSize: "14px", fontWeight: 600, color: B.ok }}>Analyzing frame alignment...</div>
              {score > 0 && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "6px", animation: "fadeIn 0.3s ease" }}>Quality score: {score}/100</div>}
            </div>}
            {/* Confirmed */}
            {confirmed && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "scaleIn 0.3s ease" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: B.ok, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}><Check s={28} c="#fff" /></div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: B.ok }}>Captured</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>Score: {score}/100</div>
            </div>}
          </div>
          {/* Zone info */}
          <div style={{ textAlign: "center", marginTop: "20px", maxWidth: "480px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>{item.label}</div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {[["Distance", item.distance], ["Angle", item.angle], ["Coverage", item.coverage]].map(([k, v], i) => (
                <div key={i} style={{ padding: "6px 12px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", fontSize: "11px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{k}: </span><span style={{ color: "#fff" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <PBar v={((captured.size + (confirmed ? 1 : 0)) / captureItems.length) * 100} c={B.ok} />
          {!aligning && !confirmed && <button onClick={doCapture} style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />
          </button>}
        </div>
      </div>}
    </div>
  );
};

/* ═══ PAGE 4: INSPECTION FINDINGS ═══ */
const findings = [
  { sev: "Critical", Icon: Tri, c: B.crit, bg: B.critBg, bd: B.critBd, t: "Head Gasket Compromised", desc: "White milky residue visible on oil filler cap. Coolant reservoir approximately 40% below minimum line. Sweet chemical smell detected from engine bay at operating temperature.", ev: "Visual inspection + Photo evidence", repair: "$2,800 – $4,200", impact: "Structural — affects resale and reliability" },
  { sev: "Major", Icon: Circ, c: B.orange, bg: B.orangeBg, bd: B.orangeBd, t: "Fuel Injector Leak Confirmed", desc: "Wet spot on injector #3 rail seat. Raw fuel smell at cold start confirmed.", ev: "Photo + inspection evidence", repair: "$600 – $1,100", impact: "Safety risk — must be addressed" },
  { sev: "Moderate", Icon: Eye, c: B.black, bg: B.ynBg, bd: B.ynBd, t: "Driver Seat Tear — Leather Bolster", desc: "1.5-inch tear on driver seat outer bolster. Consistent with entry/exit wear. Not structural but affects perceived condition.", ev: "Photo evidence", repair: "$200 – $350", impact: "Cosmetic — affects retail presentation" },
];

const P4 = () => {
  const [open, setOpen] = useState(-1);
  const [rev, setRev] = useState(0);
  const [histAdded, setHistAdded] = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  useEffect(() => {
    const t = findings.map((_, i) => setTimeout(() => setRev(i + 1), 400 + i * 400));
    return () => t.forEach(clearTimeout);
  }, []);
  const score = 64, sc = score < 50 ? B.red : score < 75 ? B.black : B.ok, scBg = score < 50 ? B.redBg : score < 75 ? B.ynBg : B.okBg;
  const handleAddHistory = () => {
    setHistLoading(true);
    setTimeout(() => { setHistLoading(false); setHistAdded(true); }, 1200);
  };
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: B.g900, margin: "0 0 4px" }}>Inspection Findings</h2>
      <p style={{ color: B.g500, fontSize: "14px", marginBottom: "20px" }}>Verified findings from guided inspection and AI analysis.</p>
      {/* ── Condition Score Card ── */}
      <Card style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ textAlign: "center", padding: "16px 28px", borderRadius: "12px", background: scBg }}>
            <div style={{ fontSize: "42px", fontWeight: 800, color: sc }}>{score}</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: sc }}>Condition Score</div>
          </div>
          <div style={{ flex: 1 }}>
            {[["Structural / Drivetrain",42,B.red],["Cosmetic / Interior",78,B.ok],["Electronics / Software",65,B.brand]].map(([l,v,c],i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}><span style={{ color: B.g700 }}>{l}</span><span style={{ fontWeight: 600, color: c }}>{v}/100</span></div>
                <PBar v={v} c={c} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", background: B.g50, border: `1px solid ${B.g200}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield s={14} c={B.brand} />
          <span style={{ fontSize: "12px", color: B.g700 }}>Score derived from physical inspection and VeriBuy AI analysis.</span>
          {histAdded && <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: B.ok, background: B.okBg, border: `1px solid ${B.okBd}`, padding: "2px 8px", borderRadius: "4px" }}>High Confidence</span>}
        </div>
      </Card>
      {/* ── Findings List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {findings.map((f, i) => {
          const isO = open === i;
          return (
            <div key={i} style={{ opacity: i < rev ? 1 : 0, transform: i < rev ? "translateY(0)" : "translateY(10px)", transition: "all 0.4s ease" }}>
              <Card style={{ padding: 0, overflow: "hidden", borderColor: f.bd }}>
                <button onClick={() => setOpen(isO ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "8px", background: f.bg, border: `1px solid ${f.bd}`, display: "flex", alignItems: "center", justifyContent: "center" }}><f.Icon s={16} c={f.c} /></div>
                  <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "14px", fontWeight: 600, color: B.g900 }}>{f.t}</span><SevPill sev={f.sev} /></div></div>
                  <span style={{ fontSize: "11px", color: B.g500, flexShrink: 0 }}>{f.ev}</span>
                </button>
                {isO && <div style={{ padding: "0 18px 18px 64px", animation: "su 0.25s ease" }}>
                  <p style={{ fontSize: "13px", color: B.g700, lineHeight: 1.6, marginBottom: "10px" }}>{f.desc}</p>
                  <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
                    <span style={{ color: B.g500 }}>Repair: <b style={{ color: B.g900 }}>{f.repair}</b></span>
                    <span style={{ color: B.g500 }}>Impact: <b style={{ color: B.g900 }}>{f.impact}</b></span>
                  </div>
                </div>}
              </Card>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", fontSize: "12px", color: B.g500 }}>
          <FileIc s={14} c={B.g300} /> All findings include timestamped photo evidence and GPS coordinates.
        </div>
      </div>
      {/* ── Supporting Documentation ── */}
      <div style={{ marginTop: "24px", borderTop: `1px dashed ${B.g200}`, paddingTop: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Optional</span>
          <span style={{ width: 1, height: 12, background: B.g300 }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: B.brand, textTransform: "uppercase", letterSpacing: "0.5px" }}>Supporting Documentation</span>
        </div>
        {!histAdded && !histLoading && (
          <Card style={{ background: B.g50, borderStyle: "dashed", borderColor: B.g300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: 42, height: 42, borderRadius: "10px", background: B.white, border: `1px solid ${B.g200}`, display: "flex", alignItems: "center", justifyContent: "center" }}><HistIc s={20} c={B.g500} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: B.g900, marginBottom: "2px" }}>Strengthen Your Verification</div>
                <div style={{ fontSize: "12px", color: B.g500, lineHeight: 1.5 }}>Add a vehicle history report to refine confidence in the assessment. Physical inspection remains the primary source of truth.</div>
              </div>
              <Btn secondary onClick={handleAddHistory} style={{ flexShrink: 0, fontSize: "13px" }}><FileIc s={14} c={B.g500} /> Add Vehicle History</Btn>
            </div>
          </Card>
        )}
        {histLoading && (
          <Card style={{ textAlign: "center", padding: "32px" }}>
            <div style={{ width: 32, height: 32, border: `3px solid ${B.g200}`, borderTopColor: B.brand, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ fontSize: "13px", color: B.g500 }}>Retrieving vehicle history report...</div>
          </Card>
        )}
        {histAdded && (
          <div style={{ animation: "su 0.4s ease" }}>
            <Card style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <HistIc s={16} c={B.brand} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: B.g900 }}>Vehicle History Report</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: B.brand, background: B.brandBg, border: `1px solid ${B.brandBd}`, padding: "2px 8px", borderRadius: "4px", marginLeft: "auto" }}>External Corroboration</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                {[["Title Status","Clean",B.ok],["Accidents Reported","0",B.ok],["Service Records","4 entries",B.brand],["Open Recalls","2",B.red]].map(([k,v,c],i) => (
                  <div key={i} style={{ padding: "12px", borderRadius: "8px", background: B.g50, border: `1px solid ${B.g200}` }}>
                    <div style={{ fontSize: "11px", color: B.g500, marginBottom: "4px" }}>{k}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: B.okBg, border: `1px solid ${B.okBd}`, fontSize: "13px", color: B.ok, fontWeight: 600, marginBottom: "14px" }}>No structural damage or flood history detected.</div>
              {/* Recall Details */}
              <div style={{ padding: "14px", borderRadius: "8px", background: B.redBg, border: `1px solid ${B.redBd}`, marginBottom: "0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}><Tri s={14} c={B.red} /><span style={{ fontSize: "13px", fontWeight: 700, color: B.red }}>2 Open Recalls</span></div>
                {[["24V-123","Fuel Injector O-Ring","Aligns with Fuel Injector Leak finding above"],["24S-56","BCM Software Parasitic Drain","Aligns with Battery / BCM risk flagged in pre-inspection"]].map(([id,desc,note],i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderTop: i > 0 ? `1px solid ${B.redBd}` : "none", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: B.red, flexShrink: 0 }}>{id}</span>
                    <div><div style={{ color: B.g900, fontWeight: 500 }}>{desc}</div><div style={{ fontSize: "12px", color: B.g500, marginTop: "2px" }}>{note}</div></div>
                  </div>
                ))}
              </div>
            </Card>
            {/* Confidence Refinement */}
            <Card accent>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Shield s={16} c={B.brand} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: B.g900 }}>Confidence Refinement</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: B.g500, fontWeight: 500 }}>Standard</span>
                  <Arr s={12} c={B.ok} />
                  <span style={{ fontSize: "12px", color: B.ok, fontWeight: 700 }}>High</span>
                </div>
              </div>
              {[
                ["Clean title", "Corroborates inspection — no hidden structural damage", B.ok, B.okBg, B.okBd],
                ["0 prior accidents", "Consistent with physical findings — no repaired collision damage", B.ok, B.okBg, B.okBd],
                ["4 service records", "Maintenance history available — supports mileage accuracy", B.ok, B.okBg, B.okBd],
                ["2 open recalls", "Reinforces fuel injector and BCM risks already identified", B.red, B.redBg, B.redBd],
              ].map(([label, note, c, bg, bd], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", marginBottom: "6px", borderRadius: "8px", background: bg, border: `1px solid ${bd}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, marginTop: "5px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: B.g900 }}>{label}</div>
                    <div style={{ fontSize: "12px", color: B.g700, marginTop: "1px" }}>{note}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: B.g50, border: `1px solid ${B.g200}`, fontSize: "12px", color: B.g500, textAlign: "center" }}>
                Physical inspection drives the score. External documents refine confidence.
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ PAGE 5: MARKET ANALYSIS ═══ */
const P5 = () => (
  <div style={{ maxWidth: "720px", margin: "0 auto" }}>
    <h2 style={{ fontSize: "22px", fontWeight: 700, color: B.g900, margin: "0 0 4px" }}>Market Analysis</h2>
    <p style={{ color: B.g500, fontSize: "14px", marginBottom: "20px" }}>Market benchmarks and condition-adjusted pricing for acquisition decision.</p>
    <Card style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}><Dollar s={16} c={B.brand} /><span style={{ fontSize: "14px", fontWeight: 700 }}>Comparable Listings</span></div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ borderTop: `2px solid ${B.red}`, borderBottom: `2px solid ${B.brand}` }}><th style={{ textAlign: "left", padding: "8px 10px", fontSize: "11px", fontWeight: 600, color: B.g500 }}>Source</th><th style={{ textAlign: "right", padding: "8px 10px", fontSize: "11px", fontWeight: 600, color: B.g500 }}>Avg Price</th><th style={{ textAlign: "right", padding: "8px 10px", fontSize: "11px", fontWeight: 600, color: B.g500 }}>Listings</th><th style={{ textAlign: "right", padding: "8px 10px", fontSize: "11px", fontWeight: 600, color: B.g500 }}>Market</th></tr></thead>
        <tbody>{[["AutoTrader","$23,495","28","Portland, OR"],["Cars.com","$24,200","34","Eugene, OR"],["Wholesale","$20,100","12","PNW Region"]].map(([s,p,n,m],i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${B.g100}` }}><td style={{ padding: "10px", fontSize: "13px", fontWeight: 600 }}>{s}</td><td style={{ padding: "10px", fontSize: "13px", textAlign: "right", fontWeight: 600 }}>{p}</td><td style={{ padding: "10px", fontSize: "13px", textAlign: "right", color: B.g500 }}>{n}</td><td style={{ padding: "10px", fontSize: "13px", textAlign: "right", color: B.g500 }}>{m}</td></tr>
        ))}</tbody>
      </table>
    </Card>
    <Card accent>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}><Bar s={16} c={B.brand} /><span style={{ fontSize: "14px", fontWeight: 700 }}>Condition-Adjusted Pricing</span></div>
      {[["Market wholesale baseline (clean, 21K mi)","$20,100",B.g900],["Head gasket repair (est.)","−$3,500",B.red],["Fuel injector repair (est.)","−$850",B.red],["Seat bolster repair (est.)","−$275",B.red],["Condition score adjustment (64/100)","−$200",B.g500]].map(([l,v,c],i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${B.g100}` : "none", fontSize: "13px" }}>
          <span style={{ color: B.g700 }}>{l}</span>
          <span style={{ fontWeight: 600, color: c }}>{v}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `2px solid ${B.brand}`, marginTop: "4px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: B.g900 }}>Adjusted Value</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color: B.red }}>$15,275</span>
      </div>
      <div style={{ marginTop: "20px", padding: "24px", borderRadius: "12px", background: B.g50, textAlign: "center" }}>
        <Label>Recommended Max Acquisition</Label>
        <div style={{ fontSize: "46px", fontWeight: 800, color: B.g900, letterSpacing: "-2px" }}>$15,275</div>
        <div style={{ width: "60px", height: "2px", background: B.red, margin: "6px auto 12px" }} />
        <div style={{ fontSize: "13px", color: B.g500 }}>Based on $24,100 avg retail (clean) minus $4,825 estimated reconditioning.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
        <div style={{ padding: "14px", borderRadius: "10px", background: B.okBg, border: `1px solid ${B.okBd}`, textAlign: "center" }}><div style={{ fontSize: "11px", color: B.ok, fontWeight: 600, marginBottom: "4px" }}>Strong Buy</div><div style={{ fontSize: "13px", fontWeight: 700 }}>≤ $14,000</div></div>
        <div style={{ padding: "14px", borderRadius: "10px", background: B.okBg, border: `1px solid ${B.okBd}`, textAlign: "center" }}><div style={{ fontSize: "11px", color: B.ok, fontWeight: 600, marginBottom: "4px" }}>Fair Buy</div><div style={{ fontSize: "13px", fontWeight: 700 }}>$14K – $15.3K</div></div>
        <div style={{ padding: "14px", borderRadius: "10px", background: B.g50, border: `1px solid ${B.g200}`, textAlign: "center" }}><div style={{ fontSize: "11px", color: B.g500, fontWeight: 600, marginBottom: "4px" }}>Overpaying</div><div style={{ fontSize: "13px", fontWeight: 700 }}>&gt; $15,300</div></div>
      </div>
    </Card>
  </div>
);

/* ═══ PAGE 6: REPORT ═══ */
const P6 = () => {
  const [rev, setRev] = useState(0);
  useEffect(() => { let i = 0; const iv = setInterval(() => { i++; setRev(i); if (i >= 7) clearInterval(iv); }, 150); return () => clearInterval(iv); }, []);
  const rptDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const S = (n, d) => rev >= n ? { animation: `fadeIn 0.4s ease`, opacity: 1 } : { opacity: 0 };
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* PDF Document */}
      <div style={{ background: B.white, borderRadius: "4px", boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)", padding: "48px 48px 40px", position: "relative", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", ...S(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logoSrc} alt="VeriBuy" style={{ width: 36, height: 36, borderRadius: "8px", objectFit: "contain" }} />
            <div><div style={{ fontSize: "14px", fontWeight: 800, color: B.g900 }}>VeriBuy</div><div style={{ fontSize: "10px", color: B.g500 }}>Verified Condition Report</div></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: B.g900, letterSpacing: "0.5px" }}>VEHICLE CONDITION REPORT</div>
            <div style={{ fontSize: "10px", color: B.g500, marginTop: "2px" }}>Report #VB-2024-18247 • {rptDate}</div>
          </div>
        </div>
        <div style={{ height: 2, background: B.brand, marginBottom: "20px", ...S(0) }} />

        {/* Hero Image */}
        <div style={{ width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", background: `linear-gradient(135deg, #1e0049 0%, #30006b 50%, #46006d 100%)`, position: "relative", ...S(1) }}>
          <img src={broncoSrc} alt="2024 Ford Bronco Sport" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>2024 Ford Bronco Sport Base AWD</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>VIN: 3FMCR9B60RRE18247 | 21,340 mi | Portland, OR</div>
          </div>
        </div>

        {/* Vehicle Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px", ...S(2) }}>
          {[["Year / Make / Model", "2024 Ford Bronco Sport"], ["Trim / Body / Drive", "Base • 4D SUV • AWD"], ["Mileage / MSRP", "21,340 mi • $29,395"]].map(([k, v], i) => (
            <div key={i} style={{ padding: "10px 12px", background: B.g50, borderRadius: "6px" }}>
              <div style={{ fontSize: "10px", color: B.g500, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: "3px" }}>{k}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: B.g900 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Condition Assessment */}
        <div style={{ marginBottom: "20px", ...S(3) }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: B.g900, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", borderBottom: `1px solid ${B.g200}`, paddingBottom: "6px" }}>Condition Assessment</div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ textAlign: "center", padding: "14px 22px", borderRadius: "10px", background: B.ynBg, border: `1px solid ${B.ynBd}` }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: B.ynT }}>64</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: B.ynT }}>Condition Score</div>
            </div>
            <div style={{ flex: 1 }}>
              {[["Structural / Drivetrain", 42, B.red], ["Cosmetic / Interior", 78, B.ok], ["Electronics / Software", 65, B.brand]].map(([l, v, c], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{ fontSize: "11px", color: B.g700, width: "130px" }}>{l}</div>
                  <div style={{ flex: 1 }}><PBar v={v} c={c} /></div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: c, width: "40px", textAlign: "right" }}>{v}/100</div>
                </div>
              ))}
            </div>
          </div>
          {/* Findings table */}
          <div style={{ border: `1px solid ${B.g200}`, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0", background: B.g50, padding: "8px 12px", fontSize: "10px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.3px" }}>
              <div>Severity</div><div>Finding</div><div style={{ textAlign: "right" }}>Est. Repair</div>
            </div>
            {findings.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0", padding: "10px 12px", borderTop: `1px solid ${B.g100}`, alignItems: "center" }}>
                <div style={{ marginRight: "10px" }}><SevPill sev={f.sev} /></div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: B.g900 }}>{f.t}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: B.red, textAlign: "right" }}>{f.repair}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Evaluation */}
        <div style={{ marginBottom: "20px", ...S(4) }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: B.g900, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", borderBottom: `1px solid ${B.g200}`, paddingBottom: "6px" }}>Pricing Evaluation</div>
          {[["Market wholesale baseline (clean, 21K mi)", "$20,100", B.g900], ["Head gasket repair (est.)", "−$3,500", B.red], ["Fuel injector repair (est.)", "−$850", B.red], ["Seat bolster repair (est.)", "−$275", B.red], ["Condition score adjustment (64/100)", "−$200", B.g500]].map(([l, v, c], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 4 ? `1px solid ${B.g100}` : "none", fontSize: "12px" }}>
              <span style={{ color: B.g700 }}>{l}</span><span style={{ fontWeight: 600, color: c }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `2px solid ${B.brand}`, marginTop: "4px", fontSize: "13px" }}>
            <span style={{ fontWeight: 700, color: B.g900 }}>Adjusted Acquisition Value</span>
            <span style={{ fontWeight: 700, color: B.red }}>$15,275</span>
          </div>
        </div>

        {/* Acquisition Recommendation */}
        <div style={{ marginBottom: "20px", ...S(5) }}>
          <div style={{ padding: "20px", borderRadius: "10px", background: B.g50, border: `1px solid ${B.g200}`, textAlign: "center" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: B.g500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Recommended Max Acquisition</div>
            <div style={{ fontSize: "38px", fontWeight: 800, color: B.g900, letterSpacing: "-1px" }}>$15,275</div>
            <div style={{ width: 50, height: 2, background: B.red, margin: "6px auto 10px" }} />
            <div style={{ fontSize: "11px", color: B.g500, marginBottom: "12px" }}>Based on $24,100 avg retail minus $4,825 estimated reconditioning.</div>
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: B.redBg, border: `1px solid ${B.redBd}`, fontSize: "12px", color: B.red, fontWeight: 600, display: "inline-block" }}>High-risk acquisition above $15,275 — head gasket and fuel injector issues require resolution.</div>
          </div>
        </div>

        {/* Blockchain verification */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", fontSize: "10px", color: B.g500, background: B.g50, borderRadius: "6px", borderTop: `1px solid ${B.g200}`, ...S(6) }}>
          <Lock s={12} c={B.g300} />
          <div>Report hash anchored to blockchain — tamper-evident and independently verifiable. Hash: 0xf8c2...9a41 • {rptDate}</div>
        </div>
      </div>

      {/* Action buttons (outside the document) */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
        <Btn><DL s={16} c="#fff" /> Download PDF</Btn>
        <Btn secondary><FileIc s={16} c={B.g500} /> Share Report</Btn>
      </div>
    </div>
  );
};

/* ═══ PAGE 7: FINAL ═══ */
const P7 = ({ go }) => {
  const [show, setShow] = useState(false);
  const [badgeIn, setBadgeIn] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 300); setTimeout(() => setBadgeIn(true), 1200); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "78vh", textAlign: "center", background: "linear-gradient(180deg, #1a0033 0%, #2d0050 40%, #1a0033 100%)", borderRadius: "20px", margin: "-20px -16px", padding: "48px 24px" }}>
      {/* Vehicle photo with verified badge overlay */}
      <div style={{ position: "relative", marginBottom: "32px", opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.9)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: "280px", height: "200px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(92, 0, 153, 0.4), 0 0 0 1px rgba(255,255,255,0.1)" }}>
          <img src={broncoSrc} alt="2024 Ford Bronco Sport" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Verified shield badge */}
        <div style={{ position: "absolute", bottom: "-18px", right: "-18px", width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #16A34A 0%, #15803d 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(22, 163, 74, 0.4), 0 0 0 4px #1a0033", opacity: badgeIn ? 1 : 0, transform: badgeIn ? "scale(1)" : "scale(0.3)", transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <Shield s={22} c="#fff" />
            <Check s={14} c="#fff" />
          </div>
        </div>
      </div>
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease 0.4s" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#16A34A", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>VeriBuy Verified</div>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", margin: "0 0 12px", lineHeight: 1.2 }}>The Complete Picture,<br/>Before You Buy</h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: "0 0 40px", maxWidth: "440px", lineHeight: 1.7 }}>VeriBuy gives your acquisition team the intelligence they need to make confident, data-backed decisions on every vehicle.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}><Btn primary>Request Dealer Pilot</Btn><Btn secondary onClick={() => go(0)}>Restart Demo</Btn></div>
      </div>
    </div>
  );
};

/* ═══ MAIN APP ═══ */
const labels = ["Intro","Vehicle ID","Risk Intel","Capture","Findings","Pricing","Report",""];
const STEPS = [P0, P1, P2, P3, P4, P5, P6, P7];

export default function App() {
  const [step, setStep] = useState(0);
  const prevRef = useRef(0);
  const dir = step >= prevRef.current ? "forward" : "back";
  const go = useCallback((s) => { prevRef.current = step; setStep(s); }, [step]);
  const nav = useCallback((s) => { prevRef.current = step; setStep(s); }, [step]);
  const Cur = STEPS[step];
  return (
    <div style={{ width: "100vw", height: "100vh", background: B.pageBg, fontFamily: "'Inter',system-ui,sans-serif", color: B.g900, display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes tc{50%{opacity:0}} @keyframes su{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.6)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}} @keyframes slideInLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}} @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}} @keyframes scanLine{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}} @keyframes borderPulse{0%,100%{border-color:rgba(92,0,153,0.3)}50%{border-color:rgba(92,0,153,1)}} @keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}} @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} [data-hover="card"]{transition:all 0.2s ease} [data-hover="card"]:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1) !important} [data-hover="btn"]{transition:all 0.15s ease} [data-hover="btn"]:hover{transform:translateY(-1px);filter:brightness(1.08)} * {box-sizing:border-box;margin:0;padding:0}`}</style>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: B.white, borderBottom: `1px solid ${B.g200}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logoSrc} alt="VeriBuy" style={{ width: 30, height: 30, borderRadius: "8px", objectFit: "contain" }} />
          <span style={{ fontSize: "16px", fontWeight: 700 }}>VeriBuy</span>
          <span style={{ width: 1, height: 20, background: B.g200, margin: "0 6px" }} />
          <span style={{ fontSize: "13px", color: B.g500, fontWeight: 500 }}>Verify Before You Buy</span>
        </div>
        {step > 0 && step < 7 && <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {labels.slice(1, 7).map((l, i) => (
            <button key={i} onClick={() => nav(i + 1)} style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, border: "none", background: step === i + 1 ? B.brandBg : "transparent", color: step === i + 1 ? B.brand : B.g500, cursor: "pointer" }}>{l}</button>
          ))}
        </nav>}
        <div style={{ fontSize: "12px", color: B.g500 }}>{step > 0 && step < 7 ? `Step ${step} of 6` : ""}</div>
      </header>
      <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}><div key={step} style={{ animation: `${dir === "forward" ? "slideInRight" : "slideInLeft"} 0.35s ease` }}><Cur go={go} /></div></main>
      {step > 0 && step < 7 && <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: B.white, borderTop: `1px solid ${B.g200}`, flexShrink: 0 }}>
        <Btn secondary onClick={() => nav(Math.max(0, step - 1))}><ChevR s={14} c={B.g500} rot={180} /> Back</Btn>
        <span style={{ fontSize: "12px", color: B.g500 }}>Workflow • Step {step} of 6</span>
        {step < 6 ? <Btn onClick={() => nav(step + 1)}>Continue <Arr s={14} c="#fff" /></Btn> : step === 6 ? <Btn primary onClick={() => nav(7)}>Complete <Check s={14} c="#fff" /></Btn> : null}
      </footer>}
    </div>
  );
}