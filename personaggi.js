// Schioppo di Rissa VZ · personaggi.js
// Tutto quello che serve per descrivere e disegnare i personaggi: lo usano sia il gioco (SDR_VZ.html) sia il sito (index.html).
// Se aggiungi un'opzione di aspetto, falla qui e varrà per entrambi.
const PI=Math.PI,TAU=PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;

// ---- descrizione dei personaggi ----
// aspetto: valori di default (servono anche per migrare i salvataggi vecchi)
const LOOK_DEF={colore:"#2e86de",giacca:"#2a2522",pantaloni:"#2c3e50",capelli:"#2b1d14",pelle:"#f1c27d",cappelloCol:"#c0392b",
  pettinatura:"corti",barba:"no",occhiali:"no",cappello:"no",vestito:"maglietta",fisico:"normale",altezza:"normale",testa:"normale",extra:"no",
  foto:null,fotoSrc:null};
const OPTS={
  pettinatura:[["corti","Corti"],["lunghi","Lunghi"],["ricci","Ricci"],["cresta","Cresta"],["coda","Coda"],["rasati","Rasati"],["pelato","Pelato"]],
  barba:[["no","Niente"],["sfatta","Sfatta"],["pizzetto","Pizzetto"],["baffi","Baffi"],["barba","Barba"],["barbone","Barbone"]],
  occhiali:[["no","Niente"],["vista","Da vista"],["sole","Da sole"]],
  cappello:[["no","Niente"],["cappellino","Cappellino"],["berretto","Berretto"],["coppola","Coppola"]],
  vestito:[["maglietta","Maglietta"],["canotta","Canotta"],["felpa","Felpa"],["giacca","Giacca"]],
  fisico:[["magro","Secco"],["normale","Normale"],["robusto","Robusto"]],
  altezza:[["basso","Basso"],["normale","Normale"],["alto","Alto"]],
  testa:[["piccola","Piccola"],["normale","Normale"],["grande","Testone"]],
  extra:[["no","Niente"],["catena","Catena d'oro"],["sigaretta","Sigaretta"],["cuffie","Cuffie"]]
};
const OPT_LABEL={pettinatura:"Capelli",barba:"Barba",occhiali:"Occhiali",cappello:"Cappello",vestito:"Vestito",fisico:"Fisico",altezza:"Altezza",testa:"Testa",extra:"Extra"};
const COL_LABEL=[["colore","Maglia"],["giacca","Giacca"],["pantaloni","Pantaloni"],["capelli","Capelli/barba"],["pelle","Pelle"],["cappelloCol","Cappello"]];
const HAIR_COLS=["#1a1a1a","#2b1d14","#3b2314","#7a4a1e","#d4a017","#a0522d","#888888","#e8e0d0","#b03a2e"];
const SKIN_COLS=["#ffdbac","#f1c27d","#e0ac69","#c68642","#8d5524"];
// norm: completa e ripulisce un personaggio (serve anche per i file importati, che potrebbero contenere di tutto)
const HEX=/^#[0-9a-f]{6}$/i,isImg=s=>typeof s==="string"&&s.startsWith("data:image/");
function norm(c){
  if(c.testa==="enorme")c.testa="grande";// la testa "enorme" non c'è più
  for(const k in LOOK_DEF)if(c[k]===undefined)c[k]=LOOK_DEF[k];
  for(const[k]of COL_LABEL)if(!HEX.test(c[k]))c[k]=LOOK_DEF[k];
  for(const k in OPTS)if(!OPTS[k].some(o=>o[0]===c[k]))c[k]=LOOK_DEF[k];
  if(!isImg(c.foto))c.foto=null;if(!isImg(c.fotoSrc))c.fotoSrc=c.foto;
  const cr=c.crop;c.crop=cr&&[cr.cx,cr.cy,cr.z].every(Number.isFinite)?{cx:cr.cx,cy:cr.cy,z:Math.min(4,Math.max(1,cr.z))}:{cx:.5,cy:.5,z:1};
  c.nome=String(c.nome||"?").slice(0,14);
  if(c.frasi!==undefined)c.frasi=Array.isArray(c.frasi)?c.frasi.filter(s=>typeof s==="string"&&s.trim()).map(s=>s.slice(0,80)):[];
  return c;
}
function prepCast(c){norm(c.protagonista);delete c.protagonista.frasi;c.amici=c.amici.filter(a=>a&&typeof a==="object").slice(0,30).map(norm);return c}
// accetta sia il file esportato ({gioco,versione,cast}) sia il cast "nudo"
function parseCast(o){const c=o&&o.cast?o.cast:o;return c&&c.protagonista&&typeof c.protagonista==="object"&&Array.isArray(c.amici)?prepCast(c):null}

const DEFAULT_CAST={
  protagonista:{nome:"Vasco",colore:"#1b1b1b",giacca:"#2a2522",pantaloni:"#2c3e50",capelli:"#5a4a3c",pelle:"#e0ac69",pettinatura:"pelato",barba:"barba",vestito:"giacca",fisico:"robusto"},
  amici:[
    {nome:"Marco",colore:"#e74c3c",capelli:"#1a1a1a",pelle:"#f1c27d",barba:"baffi",extra:"catena",frasi:["Aò, offri tu stasera?","Me devi ancora 10 euro!","Ho la macchina dal meccanico…"]},
    {nome:"Giulia",colore:"#9b59b6",capelli:"#7a4a1e",pelle:"#ffdbac",pettinatura:"lunghi",occhiali:"vista",vestito:"felpa",altezza:"basso",frasi:["Siete sempre in ritardo!","Chi guida stasera?","Ho fame, andiamo a mangiare?"]},
    {nome:"Luca",colore:"#27ae60",capelli:"#d4a017",pelle:"#e0ac69",pettinatura:"ricci",cappello:"cappellino",cappelloCol:"#2980b9",fisico:"magro",altezza:"alto",frasi:["Fra, hai visto la partita?","Io domani lavoro eh…","Ultima birra e andiamo, giuro"]},
    {nome:"Sara",colore:"#f39c12",capelli:"#3b2314",pelle:"#f1c27d",pettinatura:"coda",occhiali:"sole",vestito:"canotta",frasi:["Fammi una foto!","Ma chi t'ha dato la patente?","Stasera si esce o no?"]},
    {nome:"Fede",colore:"#16a085",capelli:"#555555",pelle:"#c68642",pettinatura:"rasati",barba:"pizzetto",cappello:"berretto",cappelloCol:"#34495e",extra:"sigaretta",fisico:"robusto",testa:"grande",frasi:["Ce l'hai un accendino?","Raga, ho un'idea geniale","Conosco una scorciatoia"]}
  ]
};

const KEY="gta-amici-cast-v1";
function clone(o){return JSON.parse(JSON.stringify(o))}

// ---- foto del viso ----
let onFaceLoad=null;// chi usa i disegni può farsi avvisare quando una foto finisce di caricarsi
const imgCache=new Map();
function faceImg(cfg){if(!cfg.foto)return null;let im=imgCache.get(cfg.foto);if(!im){im=new Image();im.onload=()=>{if(onFaceLoad)onFaceLoad()};im.src=cfg.foto;imgCache.set(cfg.foto,im)}return im.complete&&im.naturalWidth?im:null}

// ---- disegno ----
function rrg(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;r=clamp(Math.round(r*f),0,255);g=clamp(Math.round(g*f),0,255);b=clamp(Math.round(b*f),0,255);return`rgb(${r},${g},${b})`}

const HEAD_K={piccola:.82,normale:1,grande:1.25},BODY_W={magro:.82,normale:1,robusto:1.28},BODY_H={basso:.86,normale:1,alto:1.14};
const headR=cfg=>15*(HEAD_K[cfg.testa]||1);
const topOf=cfg=>27*(BODY_H[cfg.altezza]||1)+2*headR(cfg)-1;// altezza totale del personaggio, dai piedi alla cima della testa
// face: 1 guarda a destra, -1 a sinistra, 0 di fronte (anteprime)
function drawHead(g,cfg,hx,hy,r,face){
  const im=faceImg(cfg),fd=face||1,ex=face*r*.22,st=cfg.pettinatura,hc=cfg.capelli,cc=cfg.cappelloCol,b=cfg.barba;
  g.lineCap="round";
  if(!im){// capelli dietro la testa
    g.fillStyle=hc;
    if(st==="lunghi"){rrg(g,hx-r*1.08,hy-r*.55,r*2.16,r*1.7,r*.55);g.fill()}
    else if(st==="coda"){g.beginPath();g.ellipse(hx-fd*r*1.02,hy+r*.25,r*.32,r*.72,fd*.35,0,TAU);g.fill()}
  }
  if(im){
    g.save();g.beginPath();g.arc(hx,hy,r,0,TAU);g.clip();g.drawImage(im,hx-r,hy-r,r*2,r*2);g.restore();
    g.lineWidth=2.5;g.strokeStyle="#111";g.beginPath();g.arc(hx,hy,r,0,TAU);g.stroke();
  }else{
    g.fillStyle=cfg.pelle;g.beginPath();g.arc(hx,hy,r,0,TAU);g.fill();
    // barba
    g.fillStyle=hc;
    if(b==="sfatta"){g.globalAlpha=.35;g.beginPath();g.arc(hx,hy,r,.25,PI-.25);g.closePath();g.fill();g.globalAlpha=1}
    else if(b==="barba"||b==="barbone"){g.beginPath();g.arc(hx,hy,r,.3,PI-.3);g.closePath();g.fill();
      if(b==="barbone"){g.beginPath();g.ellipse(hx,hy+r*.72,r*.8,r*.68,0,0,PI);g.closePath();g.fill()}}
    else if(b==="pizzetto"){g.beginPath();g.ellipse(hx+ex*.5,hy+r*.8,r*.2,r*.24,0,0,TAU);g.fill()}
    if(b==="baffi"||b==="barba"||b==="barbone"){g.beginPath();g.ellipse(hx+ex,hy+r*.36,r*.36,r*.12,0,0,TAU);g.fill()}
    // capelli davanti
    const cap=()=>{g.beginPath();g.arc(hx,hy-r*.25,r*.98,PI,TAU);g.lineTo(hx+r*.98,hy-r*.2);g.lineTo(hx-r*.98,hy-r*.2);g.fill()};
    if(st==="pelato"){g.fillStyle="rgba(255,255,255,.35)";g.beginPath();g.ellipse(hx-r*.35,hy-r*.55,r*.28,r*.15,-.5,0,TAU);g.fill()}
    else if(st==="rasati"){g.globalAlpha=.45;cap();g.globalAlpha=1}
    else if(st==="cresta"){g.globalAlpha=.3;cap();g.globalAlpha=1;g.beginPath();g.moveTo(hx-r*.28,hy-r*.6);
      for(const[a,c]of[[-.22,-1.45],[-.09,-.9],[0,-1.62],[.09,-.9],[.22,-1.45],[.28,-.6]])g.lineTo(hx+a*r,hy+c*r);g.closePath();g.fill()}
    else if(st==="ricci"){cap();for(let k=0;k<=7;k++){const a=PI*1.02+k*PI*.96/7;g.beginPath();g.arc(hx+Math.cos(a)*r*.88,hy+Math.sin(a)*r*.88-r*.05,r*.34,0,TAU);g.fill()}}
    else{cap();g.beginPath();g.arc(hx,hy,r,PI*1.05,PI*1.95);g.lineTo(hx,hy-r*.35);g.closePath();g.fill()}
    // occhi, sopracciglia, bocca
    g.fillStyle="#111";g.beginPath();g.arc(hx-r*.32+ex,hy+r*.1,r*.11,0,TAU);g.arc(hx+r*.32+ex,hy+r*.1,r*.11,0,TAU);g.fill();
    g.strokeStyle=st==="pelato"?shade(hc,.9):shade(hc,.8);g.lineWidth=Math.max(1,r*.08);g.beginPath();
    g.moveTo(hx-r*.46+ex,hy-r*.12);g.lineTo(hx-r*.2+ex,hy-r*.1);g.moveTo(hx+r*.2+ex,hy-r*.1);g.lineTo(hx+r*.46+ex,hy-r*.12);g.stroke();
    g.strokeStyle=b==="barba"||b==="barbone"?"#2a1010":"#6b2b2b";g.lineWidth=Math.max(1.2,r*.1);g.beginPath();g.arc(hx+ex,hy+r*.4,r*.22,.25,PI-.25);g.stroke();
    g.lineWidth=2;g.strokeStyle="rgba(0,0,0,.6)";g.beginPath();g.arc(hx,hy,r,0,TAU);g.stroke();
  }
  // cappelli (valgono anche sopra la foto)
  const hat=cfg.cappello;
  if(hat==="cappellino"){g.fillStyle=cc;g.beginPath();g.arc(hx,hy-r*.2,r*1.02,PI,TAU);g.closePath();g.fill();
    g.fillStyle=shade(cc,.7);g.beginPath();g.ellipse(hx+face*r*.75,hy-r*.2,r*(face?.62:.95),r*.17,0,0,TAU);g.fill()}
  else if(hat==="berretto"){g.fillStyle=cc;g.beginPath();g.arc(hx,hy-r*.15,r*1.04,PI,TAU);g.closePath();g.fill();
    g.fillStyle=shade(cc,.78);rrg(g,hx-r*1.08,hy-r*.32,r*2.16,r*.34,r*.15);g.fill();g.fillStyle=shade(cc,1.25);g.beginPath();g.arc(hx,hy-r*1.2,r*.22,0,TAU);g.fill()}
  else if(hat==="coppola"){g.fillStyle=cc;g.beginPath();g.ellipse(hx-face*r*.08,hy-r*.5,r*1.04,r*.52,0,PI,TAU);g.closePath();g.fill();
    g.fillStyle=shade(cc,.72);g.beginPath();g.ellipse(hx+face*r*.38,hy-r*.48,r*(face?.8:1.08),r*.16,0,0,TAU);g.fill()}
  // occhiali
  const gy=im?hy-r*.05:hy+r*.1,gx=im?0:ex;
  if(cfg.occhiali==="vista"){g.strokeStyle="#111";g.lineWidth=Math.max(1.2,r*.09);g.beginPath();
    g.arc(hx-r*.33+gx,gy,r*.24,0,TAU);g.moveTo(hx+r*.57+gx,gy);g.arc(hx+r*.33+gx,gy,r*.24,0,TAU);g.moveTo(hx-r*.09+gx,gy);g.lineTo(hx+r*.09+gx,gy);g.stroke()}
  else if(cfg.occhiali==="sole"){g.fillStyle="#0d0d12";rrg(g,hx-r*.62+gx,gy-r*.17,r*.5,r*.34,r*.12);g.fill();rrg(g,hx+r*.12+gx,gy-r*.17,r*.5,r*.34,r*.12);g.fill();
    g.fillRect(hx-r*.14+gx,gy-r*.08,r*.28,r*.08);g.fillStyle="rgba(255,255,255,.35)";g.fillRect(hx-r*.52+gx,gy-r*.1,r*.13,r*.06);g.fillRect(hx+r*.22+gx,gy-r*.1,r*.13,r*.06)}
  // extra sulla testa
  if(cfg.extra==="sigaretta"){const mx=hx+gx+fd*r*.12,my=hy+r*.48;g.strokeStyle="#f5f5f5";g.lineWidth=Math.max(1.5,r*.1);g.beginPath();g.moveTo(mx,my);g.lineTo(mx+fd*r*.5,my+r*.06);g.stroke();
    g.fillStyle="#ff6a00";g.beginPath();g.arc(mx+fd*r*.53,my+r*.06,r*.07,0,TAU);g.fill()}
  else if(cfg.extra==="cuffie"){g.strokeStyle="#222";g.lineWidth=r*.16;g.beginPath();g.arc(hx,hy,r*1.08,PI*1.08,PI*1.92);g.stroke();
    g.fillStyle=cc;rrg(g,hx-r*1.24,hy-r*.3,r*.36,r*.62,r*.12);g.fill();rrg(g,hx+r*.88,hy-r*.3,r*.36,r*.62,r*.12);g.fill()}
}
function drawFigure(g,cfg,x,y,sw2,face,punch){
  const wf=BODY_W[cfg.fisico]||1,hf=BODY_H[cfg.altezza]||1,r=headR(cfg),v=cfg.vestito;
  const long=v==="giacca"||v==="felpa",tc=v==="giacca"?cfg.giacca:cfg.colore;
  g.save();g.translate(x,y);g.scale(wf,hf);g.lineCap="round";
  // gambe e scarpe
  g.strokeStyle=cfg.pantaloni;g.lineWidth=5;g.beginPath();g.moveTo(-3,-10);g.lineTo(-3+sw2,0);g.moveTo(3,-10);g.lineTo(3-sw2,0);g.stroke();
  g.fillStyle="#151515";g.beginPath();g.ellipse(-3+sw2,0,3,2.2,0,0,TAU);g.fill();g.beginPath();g.ellipse(3-sw2,0,3,2.2,0,0,TAU);g.fill();
  // braccia
  let hlx=-12-sw2*.4,hly=-12,hrx=12+sw2*.4,hry=-12;
  if(punch===true){if((face||1)>0){hrx=25;hry=-22}else{hlx=-25;hly=-22}}// braccio teso per lo schiaffo
  else if(punch){[hlx,hly]=punch.l;[hrx,hry]=punch.r}// mani in posizione libera (minigiochi)
  g.strokeStyle=long?tc:cfg.pelle;g.lineWidth=4;g.beginPath();g.moveTo(-9,-23);g.lineTo(hlx,hly);g.moveTo(9,-23);g.lineTo(hrx,hry);g.stroke();
  if(punch===true){g.fillStyle=cfg.pelle;g.beginPath();g.arc((face||1)>0?hrx:hlx,-22,3.4,0,TAU);g.fill()}
  if(v==="maglietta"){g.strokeStyle=cfg.colore;g.lineWidth=5;g.beginPath();g.moveTo(-9,-23);g.lineTo(-10.3,-19.5);g.moveTo(9,-23);g.lineTo(10.3,-19.5);g.stroke()}
  if(long){g.fillStyle=cfg.pelle;g.beginPath();g.arc(hlx,hly,2.3,0,TAU);g.fill();g.beginPath();g.arc(hrx,hry,2.3,0,TAU);g.fill()}
  // busto
  g.fillStyle=tc;rrg(g,-9,-27,18,19,5);g.fill();g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=1.5;g.stroke();
  if(cfg.fisico==="robusto"){g.beginPath();g.ellipse(0,-14,10.5,6.5,0,0,TAU);g.fill()}
  if(v==="giacca"){g.fillStyle=cfg.colore;g.fillRect(-2.8,-26.5,5.6,18);g.strokeStyle=shade(cfg.giacca,.55);g.lineWidth=1;g.beginPath();g.moveTo(-3,-26);g.lineTo(-3,-8.5);g.moveTo(3,-26);g.lineTo(3,-8.5);g.stroke()}
  else if(v==="canotta"){g.fillStyle=cfg.pelle;g.beginPath();g.moveTo(-5,-27.2);g.quadraticCurveTo(0,-18,5,-27.2);g.closePath();g.fill()}
  else if(v==="felpa"){g.fillStyle=shade(cfg.colore,.8);rrg(g,-6,-16,12,6,2);g.fill();g.strokeStyle="#eee";g.lineWidth=1;g.beginPath();g.moveTo(-2,-26);g.lineTo(-2,-21);g.moveTo(2,-26);g.lineTo(2,-21);g.stroke()}
  if(cfg.extra==="catena"){g.strokeStyle="#ffd700";g.lineWidth=1.6;g.beginPath();g.arc(0,-27,5.5,.35,PI-.35);g.stroke()}
  g.restore();
  const hy=y-(27*hf+r-1);
  if(v==="felpa"){g.fillStyle=shade(cfg.colore,.82);g.beginPath();g.ellipse(x,hy+r*.6,r*.95,r*.5,0,0,TAU);g.fill()}// cappuccio
  drawHead(g,cfg,x,hy,r,face);
}
