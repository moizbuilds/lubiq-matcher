import React, { useState, useMemo } from "react";

// ── Product corpus (structured from 16 manufacturer data sheets) ──────────────
const PRODUCTS = [
  { id: "qalco-spectro-omni-gear", brand: "Qalco Energy", name: "Spectro Omni Gear", family: "Automotive gear oil", domain: "automotive", base: "Mineral",
    summary: "API GL-5 gear oil with EP additives for hypoid gears, differentials and manual transmissions under shock load.",
    applications: ["hypoid gears","differentials","manual transmissions","transaxles","spiral bevel axles","gear oil"],
    approvals: ["API GL-5","MIL-L-2105D","ZF TE-ML 07A","ZF TE-ML 08"], grades: ["80W","80W90","85W90","85W140","90","140"], flags: [] },
  { id: "cepsa-traction-to4", brand: "CEPSA", name: "TRACTION TO-4", family: "Transmission / drivetrain oil", domain: "automotive", base: "Mineral",
    summary: "Meets Caterpillar TO-4 for transmissions, torque converters, transfer cases and final drives.",
    applications: ["transmissions","torque converters","transfer cases","final drives","off-highway drivetrain"],
    approvals: ["CAT TO-4","ALLISON C-4","KOMATSU MICRO CLUTCH","ZF TE-ML 03C","ZF TE-ML 07F"], grades: ["10W","30","50"], flags: [] },
  { id: "cepsa-traction-sae", brand: "CEPSA", name: "TRACTION SAE", family: "Heavy-diesel engine oil (monograde)", domain: "automotive", base: "Mineral",
    summary: "Monograde mineral engine oil for older diesel engines, tractors and stationary motors; tolerant of high-sulphur fuel.",
    applications: ["naturally aspirated diesel","tractors","quarry machinery","stationary engines","public works fleets","high sulphur fuel","engine oil"],
    approvals: ["API CF/SF","CCMC D2","CATERPILLAR TO-2","ALLISON C3"], grades: ["30","40","50","60"], flags: ["no-dpf"] },
  { id: "cepsa-traction-truck-extra-life-25w60", brand: "CEPSA", name: "TRACTION TRUCK EXTRA LIFE 25W60", family: "Heavy-diesel engine oil (high viscosity)", domain: "automotive", base: "Mineral",
    summary: "Very high-viscosity oil with seal conditioners for high-mileage or hot-climate engines with high oil consumption.",
    applications: ["high mileage diesel","hot climate","high oil consumption","turbocharged diesel","mining","public works","engine oil"],
    approvals: ["API CH-4","MAN M 3275-1","MB 228.3","Volvo VDS-2","Renault RD-2","Mack EO-M Plus","Cummins CES 20077","MTU Type 2","Deutz DQC II-05","CAT ECF-1a"], grades: ["25W60"], flags: ["no-dpf","hot-climate"] },
  { id: "cepsa-traction-advanced-le-10w40", brand: "CEPSA", name: "TRACTION ADVANCED LE 10W40", family: "Heavy-diesel engine oil (synthetic, Low SAPS)", domain: "automotive", base: "Synthetic",
    summary: "Low-SAPS synthetic oil for Euro VI/V engines with DPF / after-treatment; suitable for CNG buses.",
    applications: ["euro vi","euro v","dpf","particulate filter","scr","after-treatment","cng buses","long-haul fleets","biodiesel","engine oil"],
    approvals: ["ACEA E6/E7/E9","API CJ-4","MB-Approval 228.51","Volvo VDS-4","Mack EO-O Premium Plus","MTU Type 3.1","Detroit Diesel DDC93K218","Deutz DQC IV-10 LA","MAN M 3477/3271-1","Renault RLD-3","Cummins CES 20081","CAT ECF-3","JASO DH-2","Scania Low Ash"], grades: ["10W40"], flags: ["dpf"] },
  { id: "cepsa-traction-advanced-ls-15w40", brand: "CEPSA", name: "TRACTION ADVANCED LS 15W40", family: "Heavy-diesel engine oil (synthetic, Mid SAPS)", domain: "automotive", base: "Synthetic",
    summary: "Mid-SAPS synthetic universal oil for Euro V/VI engines with DPF; mixed truck, bus and van fleets.",
    applications: ["euro v","euro vi","dpf","particulate filter","scr","after-treatment","trucks","buses","vans","agricultural","construction","cng","biodiesel","low sulphur fuel","engine oil"],
    approvals: ["ACEA E9/E7","API CK-4","VOLVO VDS-4.5","RENAULT RLD-3","MB-Approval 228.31","Detroit Diesel DDC93K222","MACK EOS 4.5","MTU Type 2.1","CAT ECF-3","Ford WSS M2C171-F1","CUMMINS CES20086","JASO DH-2","MAN M 3775/3575","Deutz DQC III-18 LA"], grades: ["15W40"], flags: ["dpf"] },
  { id: "cepsa-traction-max-15w40", brand: "CEPSA", name: "TRACTION MAX 15W40", family: "Heavy-diesel engine oil (no DPF)", domain: "automotive", base: "Mineral/SHPD",
    summary: "High-performance oil for Euro V/IV and earlier engines WITHOUT a particulate filter. Not for DPF engines.",
    applications: ["supercharged diesel","heavy-duty","long-haul","urban transport","public works","egr","high biodiesel","engine oil"],
    approvals: ["ACEA E7","API CI-4","MAN M 3275-1","MB-Approval 228.3","VOLVO VDS-3","MACK EO-N","RENAULT VI RLD-2","Detroit Diesel DDC93K215","CUMMINS CES 20078","MTU Type 2","DEUTZ DQC III-18","CATERPILLAR ECF-2","JASO DH-1","GLOBAL DHD-1","SCANIA","DAF / IVECO"], grades: ["15W40"], flags: ["no-dpf"] },
  { id: "cepsa-traction-max-20w50", brand: "CEPSA", name: "TRACTION MAX 20W50", family: "Heavy-diesel engine oil (no DPF, high viscosity)", domain: "automotive", base: "Mineral",
    summary: "Very high-viscosity high-performance oil for Euro V/IV and older engines WITHOUT a particulate filter.",
    applications: ["heavy diesel","high temperature","high oil consumption","public works","mining","engine oil"],
    approvals: ["API CH-4","MTU Type 2","MB 228.3","Volvo VDS-2","Renault RD-2","Mack EO-M Plus","Cummins CES 20077","Deutz DQC II-05","CAT ECF-1a","MAN M 3275-1"], grades: ["20W50"], flags: ["no-dpf","hot-climate"] },
  { id: "cepsa-arga-complex-litio-2", brand: "CEPSA", name: "ARGA COMPLEX LITIO 2", family: "Lithium complex grease", domain: "industrial", base: "Mineral",
    summary: "Lithium-complex grease for high-temperature bearings; industry and heavy transport fleets. Range -20 to 140C, peaks 150C.",
    applications: ["high temperature bearings","plastics","paint","rubber","paper","steel industry","heavy transport","mining","cement","grease","bearings"],
    approvals: ["DIN 51502: KP2N-20","ISO 12924: L-XBDHB2"], grades: ["NLGI 2"], flags: ["high-temp"] },
  { id: "cepsa-arga-litio-ep", brand: "CEPSA", name: "ARGA LITIO EP", family: "Extreme-pressure lithium grease", domain: "industrial", base: "Mineral",
    summary: "Multipurpose EP lithium grease for bearings, centralised systems and greasers under high loads.",
    applications: ["bearings","plain bearings","centralised greasing","high load","industrial equipment","marine","automotive equipment","grease","extreme pressure"],
    approvals: ["ISO 12924: L-XCCIB / L-XBCIB","DIN 51502: KP00K-30 … KP2K-20"], grades: ["EP-00","EP-0","EP-0/1","EP-1","EP-2"], flags: [] },
  { id: "cepsa-arga-litio", brand: "CEPSA", name: "ARGA LITIO", family: "Lithium grease", domain: "industrial", base: "Mineral",
    summary: "Multipurpose lithium grease for general lubrication of bearings, joints, guides, shafts and spindles.",
    applications: ["general lubrication","bearings","joints","guides","shafts","spindles","centralised greasing","grease"],
    approvals: ["DIN 51502: K2K-20 / K3K-10","ISO 3743-9: L-X-BCHA2 / L-X-ACHA3"], grades: ["NLGI 2","NLGI 3"], flags: [] },
  { id: "cepsa-circulante", brand: "CEPSA", name: "CIRCULANTE", family: "All-purpose circulating oil", domain: "industrial", base: "Paraffinic mineral",
    summary: "All-purpose circulating oil for recirculation systems, lightly loaded gears, reciprocating compressors and basic hydraulics.",
    applications: ["circulation systems","lightly loaded gears","speed variators","bearings","reciprocating compressors","hydraulic circuits","general industrial oil"],
    approvals: ["DIN 51524 Part 1 (HL)","ISO 6743-4 HL","DIN 51517 (CL)","ISO 6743-2 FC"], grades: ["ISO 150","ISO 220","ISO 320","ISO 460"], flags: [] },
  { id: "cepsa-compresores-ar", brand: "CEPSA", name: "COMPRESORES AR", family: "Compressor oil (mineral)", domain: "industrial", base: "Paraffinic mineral",
    summary: "Mineral compressor oil for rotary and reciprocating air/inert-gas compressors in normal or severe conditions.",
    applications: ["air compressors","inert gas compressors","rotary compressors","reciprocating compressors","compressor oil"],
    approvals: ["DIN 51506 VCL/VDL","ISO 6743/3 DAJ"], grades: ["ISO 46","ISO 68","ISO 100"], flags: [] },
  { id: "cepsa-compresores-ars", brand: "CEPSA", name: "COMPRESORES ARS", family: "Compressor oil (full synthetic PAO)", domain: "industrial", base: "Synthetic PAO",
    summary: "Fully synthetic PAO compressor oil for demanding screw, vane and piston compressors; wide temperature range, long life.",
    applications: ["air compressors","screw compressors","rotary vane compressors","piston compressors","wide temperature","extended drain","compressor oil"],
    approvals: ["DIN 51506 VCL/VDL","ISO 6743/3 DPJ"], grades: ["ISO 46","ISO 68","ISO 100"], flags: ["wide-temp"] },
  { id: "cepsa-diatermo-s", brand: "CEPSA", name: "DIATERMO S", family: "Synthetic thermal fluid", domain: "industrial", base: "Synthetic alkylbenzene",
    summary: "Synthetic heat-transfer fluid for thermal systems where water/steam can't be used. Range -40 to 300C (max 310C).",
    applications: ["heat transfer","thermal oil systems","heating systems","thermal fluid"],
    approvals: ["DIN 51522","ISO 6743 L-QB"], grades: ["ISO 22"], flags: ["high-temp","wide-temp"] },
  { id: "cepsa-turbinas-ep", brand: "CEPSA", name: "TURBINAS EP", family: "Turbine oil (EP)", domain: "industrial", base: "Hydrotreated mineral",
    summary: "EP turbine oil for steam/gas turbines, combined-cycle plants, turbo-generators and high-quality EP hydraulic systems.",
    applications: ["steam turbines","gas turbines","combined cycle","turbo-generators","ep hydraulics","turbine oil"],
    approvals: ["ISO 6743-5 L-TSA/TGA","ALSTOM HTGD 90117","GE GEK (multiple)","SIEMENS TLV 901304","MAN TURBO","DIN 51515 II (L-TG)"], grades: ["ISO 32","ISO 46"], flags: [] },
];

// ── Matching engine ───────────────────────────────────────────────────────────
function norm(s){return s.toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();}

function scoreProduct(product, q){
  const text = norm(q);
  const tokens = text.split(" ").filter(t=>t.length>2);
  let score = 0; const hits = [];

  // 1) Approval string match — strongest signal
  for(const ap of product.approvals){
    const napa = norm(ap);
    // direct substring of a full approval, or all approval tokens present
    if(napa && text.includes(napa)){ score += 50; hits.push("Meets "+ap); continue; }
    const apTokens = napa.split(" ").filter(t=>t.length>2);
    if(apTokens.length && apTokens.every(t=>text.includes(t))){ score += 40; hits.push("Meets "+ap); }
  }
  // 2) Application keyword match
  for(const app of product.applications){
    const na = norm(app);
    if(text.includes(na)){ score += 18; hits.push("Suited to "+app); }
    else { const at = na.split(" ").filter(t=>t.length>2); if(at.length>1 && at.every(t=>tokens.includes(t))){ score+=12; hits.push("Suited to "+app);} }
  }
  // 3) Family / base oil mentions
  if(tokens.some(t=>norm(product.family).includes(t))) score += 6;
  if(text.includes("synthetic") && product.base.toLowerCase().includes("synth")){ score += 8; hits.push("Synthetic base"); }

  return { score, hits: [...new Set(hits)] };
}

// Hard constraints: detected from the query, can disqualify a product outright.
function applyConstraints(product, q){
  const t = norm(q);
  const reasons = [];
  const wantsDPF = /(dpf|particulate filter|euro vi|euro 6|after\s?treatment|scr|low saps)/.test(t);
  const saysNoDPF = /(no dpf|without dpf|no particulate|pre[- ]?euro|euro iv|euro 4|older engine|high sulphur)/.test(t);
  if(wantsDPF && product.flags.includes("no-dpf")) reasons.push("Excluded: not compatible with DPF / after-treatment engines");
  if(saysNoDPF && product.flags.includes("dpf")) reasons.push("Note: this is a Low/Mid-SAPS oil intended for DPF engines");
  return reasons;
}

const EXAMPLES = [
  "Euro VI truck with a DPF, needs ACEA E6",
  "Differential needing API GL-5 and ZF TE-ML 07A",
  "Screw air compressor, wide temperature range",
  "Older diesel engine, no particulate filter, high sulphur fuel",
  "Steam turbine oil with EP properties",
  "High-temperature bearing grease for a steel mill",
  "Caterpillar transmission needing TO-4",
];

export default function LubIQ(){
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [domain, setDomain] = useState("all");

  const results = useMemo(()=>{
    if(!submitted.trim()) return [];
    return PRODUCTS
      .filter(p=> domain==="all" || p.domain===domain)
      .map(p=>{
        const {score, hits} = scoreProduct(p, submitted);
        const blocked = applyConstraints(p, submitted);
        const hard = blocked.filter(r=>r.startsWith("Excluded"));
        return { p, score, hits, notes: blocked, disqualified: hard.length>0 };
      })
      .filter(r=> r.score>0)
      .sort((a,b)=> (a.disqualified-b.disqualified) || (b.score-a.score))
      .slice(0,5);
  }, [submitted, domain]);

  const run = (q)=>{ const v=q??query; setQuery(v); setSubmitted(v); };

  return (
    <div style={{minHeight:"100vh", background:"#0e1411", color:"#e8efe9", fontFamily:"'IBM Plex Sans', system-ui, sans-serif", padding:"32px 20px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        .liq-chip{cursor:pointer;transition:all .15s}
        .liq-chip:hover{background:#1c2b23;border-color:#3a6b51}
        .liq-card{transition:transform .15s, border-color .15s}
        .liq-card:hover{transform:translateY(-2px);border-color:#3a6b51}
        .liq-input:focus{outline:none;border-color:#4ea87a;box-shadow:0 0 0 3px rgba(78,168,122,.15)}
        button:focus-visible{outline:2px solid #4ea87a;outline-offset:2px}
        @media (prefers-reduced-motion: reduce){.liq-card,.liq-chip{transition:none}}
      `}</style>

      <div style={{maxWidth:780, margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex", alignItems:"baseline", gap:12, marginBottom:6}}>
          <span style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:13, letterSpacing:"0.18em", color:"#4ea87a", fontWeight:600}}>LUB·IQ</span>
          <span style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:11, letterSpacing:"0.12em", color:"#5e7268"}}>SPEC MATCHER · 16 PRODUCTS</span>
        </div>
        <h1 style={{fontFamily:"'Fraunces', serif", fontWeight:600, fontSize:30, lineHeight:1.1, margin:"0 0 8px", color:"#f3f8f4"}}>
          Describe the application.<br/>Get the lubricants that qualify.
        </h1>
        <p style={{color:"#9bb0a5", fontSize:15, margin:"0 0 24px", maxWidth:560}}>
          Matches your requirement against manufacturer approvals and intended applications. Hard constraints like DPF compatibility filter out products that don't fit, instead of burying them.
        </p>

        {/* Input */}
        <div style={{display:"flex", gap:8, marginBottom:14}}>
          <input
            className="liq-input"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") run(); }}
            placeholder="e.g. Euro VI truck with a DPF, needs ACEA E6"
            style={{flex:1, background:"#141c18", border:"1px solid #26352c", borderRadius:10, padding:"13px 15px", color:"#e8efe9", fontSize:15, fontFamily:"inherit"}}
          />
          <button onClick={()=>run()} style={{background:"#4ea87a", color:"#08120c", border:"none", borderRadius:10, padding:"0 22px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit"}}>
            Match
          </button>
        </div>

        {/* Domain toggle */}
        <div style={{display:"flex", gap:6, marginBottom:18}}>
          {[["all","All"],["automotive","Automotive"],["industrial","Industrial"]].map(([k,label])=>(
            <button key={k} onClick={()=>setDomain(k)} style={{
              background: domain===k?"#1c2b23":"transparent", color: domain===k?"#7fd0a4":"#6f867a",
              border:"1px solid "+(domain===k?"#3a6b51":"#26352c"), borderRadius:20, padding:"5px 14px", fontSize:13, cursor:"pointer", fontFamily:"inherit"
            }}>{label}</button>
          ))}
        </div>

        {/* Examples */}
        {!submitted && (
          <div style={{marginBottom:8}}>
            <div style={{fontSize:12, color:"#5e7268", marginBottom:8, fontFamily:"'IBM Plex Mono', monospace", letterSpacing:"0.08em"}}>TRY ONE</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {EXAMPLES.map(ex=>(
                <span key={ex} className="liq-chip" onClick={()=>run(ex)} style={{
                  background:"#141c18", border:"1px solid #26352c", borderRadius:8, padding:"7px 11px", fontSize:13, color:"#bcccc2"
                }}>{ex}</span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div style={{marginTop:6}}>
            <div style={{fontSize:12, color:"#5e7268", marginBottom:12, fontFamily:"'IBM Plex Mono', monospace", letterSpacing:"0.08em"}}>
              {results.length} MATCH{results.length!==1?"ES":""} · RANKED BY APPROVAL & APPLICATION FIT
            </div>
            {results.length===0 && (
              <div style={{background:"#141c18", border:"1px dashed #2c3d33", borderRadius:12, padding:"22px", color:"#9bb0a5", fontSize:14}}>
                Nothing in the current corpus matches that. Try naming a spec (API CK-4, ZF TE-ML 07A), an application (air compressor, differential), or switch the domain filter.
              </div>
            )}
            {results.map(({p, score, hits, notes, disqualified})=>(
              <div key={p.id} className="liq-card" style={{
                background:"#141c18", border:"1px solid "+(disqualified?"#5a3a2a":"#26352c"), borderRadius:12, padding:"16px 18px", marginBottom:12, opacity: disqualified?0.72:1
              }}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:12}}>
                  <div>
                    <span style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#4ea87a", letterSpacing:"0.1em"}}>{p.brand.toUpperCase()}</span>
                    <h3 style={{fontFamily:"'Fraunces', serif", fontSize:19, fontWeight:600, margin:"2px 0 2px", color:"#f3f8f4"}}>{p.name}</h3>
                    <div style={{fontSize:12.5, color:"#7b9087"}}>{p.family} · {p.base}</div>
                  </div>
                  <div style={{textAlign:"right", flexShrink:0}}>
                    <div style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:20, fontWeight:600, color: disqualified?"#b06a4a":"#7fd0a4"}}>{score}</div>
                    <div style={{fontSize:10, color:"#5e7268", letterSpacing:"0.1em"}}>FIT SCORE</div>
                  </div>
                </div>
                <p style={{fontSize:13.5, color:"#bcccc2", margin:"10px 0 10px", lineHeight:1.45}}>{p.summary}</p>
                {notes.map((n,i)=>(
                  <div key={i} style={{fontSize:12.5, color: n.startsWith("Excluded")?"#e09a73":"#c7b07a", background: n.startsWith("Excluded")?"#241710":"#221e10", border:"1px solid "+(n.startsWith("Excluded")?"#4a2f1e":"#3a3115"), borderRadius:7, padding:"6px 10px", marginBottom:8}}>
                    {n.startsWith("Excluded") ? "⚠ " : "ℹ "}{n}
                  </div>
                ))}
                {hits.length>0 && (
                  <div style={{display:"flex", flexWrap:"wrap", gap:6, marginTop:2}}>
                    {hits.slice(0,6).map((h,i)=>(
                      <span key={i} style={{fontSize:11.5, background:"#10211a", border:"1px solid #244234", borderRadius:6, padding:"3px 8px", color:"#86c7a3", fontFamily:"'IBM Plex Mono', monospace"}}>{h}</span>
                    ))}
                  </div>
                )}
                <div style={{display:"flex", flexWrap:"wrap", gap:5, marginTop:10}}>
                  {p.grades.map(g=>(
                    <span key={g} style={{fontSize:11, color:"#8aa096", border:"1px solid #26352c", borderRadius:5, padding:"2px 7px"}}>{g}</span>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={()=>{setSubmitted(""); setQuery("");}} style={{background:"transparent", color:"#6f867a", border:"1px solid #26352c", borderRadius:8, padding:"8px 14px", fontSize:13, cursor:"pointer", fontFamily:"inherit", marginTop:4}}>
              ← New search
            </button>
          </div>
        )}

        <div style={{marginTop:30, paddingTop:16, borderTop:"1px solid #1c2620", fontSize:11.5, color:"#516359", lineHeight:1.5}}>
          Demo corpus: Qalco Energy + CEPSA product data sheets. Typical characteristics are guidance values from the source sheets and may change within standards ranges. Always confirm against the current manufacturer data sheet and the equipment maker's specification before use.
        </div>
      </div>
    </div>
  );
}
