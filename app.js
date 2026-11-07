/* =====================================================================
   PRECIOS DE LOS JABONES  (en pesos colombianos, sin puntos ni signos)
   Cambia aquí los valores y guarda el archivo. Ejemplo: precioAvena: 8000
   Si dejas un 0, la página muestra "Precio por confirmar".
   ===================================================================== */
const PRECIOS = {
  precioAvena: $8.000,
  precioMiel: $5000,
  precioSabila: $6.000,
  precioLavanda: $7.000,
  precioCoco: $8.5000
};
/* ===================================================================== */

class DCLogic{constructor(p){this.props=p;}
 setState(s){const st=typeof s==='function'?s(this.state):s;this.state=Object.assign({},this.state,st);App.schedule();}}
const App=(function(){
 const root=document.getElementById('app');let comp,pending=false;
 const HOLE=/\{\{\s*([^}]+?)\s*\}\}/g, ONE=/^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
 const get=(p,sc)=>p.split('.').reduce((o,k)=>o==null?o:o[k],sc);
 const interp=(s,sc)=>s.replace(HOLE,(_,p)=>{const v=get(p,sc);return v==null?'':String(v)});
 const resolve=(s,sc)=>{const m=s.match(ONE);return m?get(m[1],sc):interp(s,sc)};
 function kids(n,sc,out){n.childNodes.forEach(c=>build(c,sc,out))}
 function build(n,sc,out){
  if(n.nodeType===3){out.appendChild(document.createTextNode(interp(n.data,sc)));return}
  if(n.nodeType!==1)return;
  const tag=n.localName;
  if(tag==='sc-for'){const list=resolve(n.getAttribute('list'),sc)||[],as=n.getAttribute('as');
   list.forEach((it,i)=>{const s=Object.create(sc);s[as]=it;s.$index=i;kids(n,s,out)});return}
  if(tag==='sc-if'){if(resolve(n.getAttribute('value'),sc))kids(n,sc,out);return}
  const el=document.createElementNS(n.namespaceURI,tag);
  for(const a of n.attributes){const name=a.name,v=a.value;
   if(name.startsWith('hint-'))continue;
   if(/^on[a-z]/i.test(name)&&ONE.test(v)){const t=name.slice(2).toLowerCase();
     const type=(t==='change'&&tag!=='select')?'input':t;(el.__ev=el.__ev||{})[type]=resolve(v,sc);continue}
   if(name==='value'&&['input','textarea','select'].includes(tag)){el.__val=interp(v,sc);continue}
   el.setAttribute(name,interp(v,sc));}
  kids(n,sc,el);
  if(el.__val!==undefined)el.value=el.__val;
  out.appendChild(el);}
 function morph(o,n){
  const oc=Array.from(o.childNodes),nc=Array.from(n.childNodes);
  nc.forEach((b,i)=>{const a=oc[i];
   if(!a){o.appendChild(b);return}
   if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName){o.replaceChild(b,a);return}
   if(a.nodeType===3){if(a.data!==b.data)a.data=b.data;return}
   for(const at of Array.from(a.attributes))if(!b.hasAttribute(at.name))a.removeAttribute(at.name);
   for(const at of Array.from(b.attributes))if(a.getAttribute(at.name)!==at.value)a.setAttribute(at.name,at.value);
   a.__ev=b.__ev;morph(a,b);
   if(b.__val!==undefined&&a.value!==b.__val)a.value=b.__val;});
  for(let i=oc.length-1;i>=nc.length;i--)o.removeChild(oc[i]);}
 const tpl=document.getElementById('tpl').content;
 function paint(first){const vals=comp.renderVals();const sc=Object.create(vals);
  const tmp=document.createElement('div');kids(tpl,sc,tmp);
  if(first)while(tmp.firstChild)root.appendChild(tmp.firstChild);else morph(root,tmp);}
 ['click','input','change'].forEach(ev=>root.addEventListener(ev,e=>{let t=e.target;
  while(t&&t!==root.parentNode){if(t.__ev&&t.__ev[ev]){t.__ev[ev](e);break}t=t.parentNode}}));
 return{start(C,props){comp=new C(props);paint(true)},
  schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;paint(false)})}};
})();

class Component extends DCLogic {
  state = {
    q: { avena: 0, miel: 0, sabila: 0, lavanda: 0, coco: 0 },
    form: { nombre: '', correo: '', tel: '', motivo: 'Pedido', mensaje: '' },
    openFaq: -1
  };

  renderVals() {
    const p = this.props;
    const WA = '573113037017';
    const wa = (txt) => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
    const fmt = (n) => '$' + Number(n).toLocaleString('es-CO');
    const q = this.state.q;
    const form = this.state.form;

    const change = (id, d) => this.setState((s) => ({ q: { ...s.q, [id]: Math.max(0, Math.min(99, (s.q[id] || 0) + d)) } }));
    const setF = (k) => (e) => { const v = e && e.target ? e.target.value : ''; this.setState((s) => ({ form: { ...s.form, [k]: v } })); };

    const catalog = [
      { id: 'avena', nombre: 'Jabón de avena', tag: 'Suavidad', tint: '#F4ECDA', price: p.precioAvena || 0, frase: 'Inspirado en uno de los ingredientes más conocidos del cuidado personal. Una limpieza agradable y una sensación de suavidad en la piel.' },
      { id: 'miel', nombre: 'Jabón de miel', tag: 'Calidez', tint: '#FBEBC8', price: p.precioMiel || 0, frase: 'Inspirado en un ingrediente natural de uso tradicional en el cuidado personal. Su presentación transmite calidez y dulzura.' },
      { id: 'sabila', nombre: 'Jabón de sábila', tag: 'Frescura', tint: '#E2EFDA', price: p.precioSabila || 0, frase: 'Inspirado en una planta reconocida por su uso tradicional en el cuidado de la piel. Representa frescura y conexión con la naturaleza.' },
      { id: 'lavanda', nombre: 'Jabón de lavanda', tag: 'Aroma floral', tint: '#E9E3F3', price: p.precioLavanda || 0, frase: 'Inspirado en el aroma de esta planta. Una opción para quienes disfrutan de los aromas florales durante el baño.' },
      { id: 'coco', nombre: 'Jabón de coco', tag: 'Tropical', tint: '#F3EEE4', price: p.precioCoco || 0, frase: 'Inspirado en un ingrediente de origen natural. Una propuesta fresca y agradable para tu rutina de higiene personal.' }
    ];

    const products = catalog.map((c) => ({
      ...c,
      qty: q[c.id] || 0,
      isAvena: c.id === 'avena', isMiel: c.id === 'miel', isSabila: c.id === 'sabila', isLavanda: c.id === 'lavanda', isCoco: c.id === 'coco',
      priceLabel: c.price > 0 ? fmt(c.price) + ' c/u' : 'Precio por confirmar',
      inc: () => change(c.id, 1),
      dec: () => change(c.id, -1)
    }));

    const lines = catalog.filter((c) => (q[c.id] || 0) > 0).map((c) => ({
      nombre: c.nombre,
      qty: q[c.id],
      unidad: q[c.id] === 1 ? 'unidad' : 'unidades',
      sub: c.price > 0 ? '· ' + fmt(c.price * q[c.id]) : '',
      inc: () => change(c.id, 1),
      dec: () => change(c.id, -1)
    }));
    const totalUnits = lines.reduce((a, l) => a + l.qty, 0);
    const allPriced = lines.length > 0 && catalog.filter((c) => (q[c.id] || 0) > 0).every((c) => c.price > 0);
    const total = catalog.reduce((a, c) => a + c.price * (q[c.id] || 0), 0);

    let orderMsg = '¡Hola Esencia Natural! Quisiera hacer el siguiente pedido:\n';
    catalog.filter((c) => (q[c.id] || 0) > 0).forEach((c) => { orderMsg += '• ' + q[c.id] + ' × ' + c.nombre + '\n'; });
    orderMsg += 'Total de jabones: ' + totalUnits + '\n';
    if (allPriced) orderMsg += 'Valor estimado: ' + fmt(total) + '\n';
    orderMsg += '¿Me confirman disponibilidad, precio y entrega?';

    const formMsg = '¡Hola Esencia Natural! Soy ' + (form.nombre || '[mi nombre]') + '.\nMotivo: ' + form.motivo + '\n' + (form.mensaje || '') + '\nContacto: ' + (form.tel || '') + ' ' + (form.correo || '');

    const open = this.state.openFaq;
    const faqData = [
      { q: '¿Dónde se encuentra Esencia Natural?', a: 'Nuestro emprendimiento está ubicado en Maicao, La Guajira, Colombia.' },
      { q: '¿Qué productos ofrecemos?', a: 'Ofrecemos jabones de avena, miel, sábila, lavanda y coco, sujetos a disponibilidad.' },
      { q: '¿Cómo puedo comprar?', a: 'Puedes seleccionar tus productos en el catálogo y comunicarte con nosotros por WhatsApp.' },
      { q: '¿Cuáles son los precios?', a: 'Los precios se informarán directamente a través de nuestros canales de atención.' },
      { q: '¿Los jabones son elaborados con ingredientes naturales?', a: 'Nuestros productos están inspirados en ingredientes de origen natural. Los ingredientes exactos se indicarán en el etiquetado de cada jabón.' },
      { q: '¿Puedo hacer preguntas antes de comprar?', a: '¡Por supuesto! Puedes escribirnos para recibir información sobre los productos.' }
    ].map((f, i) => ({
      ...f,
      open: open === i,
      iconStyle: open === i ? 'transform: rotate(45deg)' : 'transform: rotate(0deg)',
      toggle: () => this.setState((s) => ({ openFaq: s.openFaq === i ? -1 : i }))
    }));

    return {
      accent: p.accent ?? '#2E4D3B',
      waGeneral: wa('¡Hola Esencia Natural! Quisiera información sobre sus jabones.'),
      waOrder: wa(orderMsg),
      waForm: wa(formMsg),
      products,
      lines,
      hasItems: lines.length > 0,
      isEmpty: lines.length === 0,
      totalUnits,
      showTotal: allPriced,
      noTotal: lines.length > 0 && !allPriced,
      totalLabel: fmt(total),
      clearCart: () => this.setState({ q: { avena: 0, miel: 0, sabila: 0, lavanda: 0, coco: 0 } }),
      form,
      setNombre: setF('nombre'), setCorreo: setF('correo'), setTel: setF('tel'), setMotivo: setF('motivo'), setMensaje: setF('mensaje'),
      faq: faqData,
      objetivos: [
        'Ofrecer diferentes variedades de jabones para satisfacer los gustos de nuestros clientes.',
        'Dar a conocer nuestros productos mediante una página web y las redes sociales.',
        'Brindar una atención amable y responsable.',
        'Mejorar continuamente la presentación y calidad de nuestros productos.',
        'Promover el emprendimiento y apoyar el comercio local.',
        'Desarrollar estrategias para ampliar nuestro mercado.'
      ].map((t, i) => ({ n: i + 1, t })),
      valores: [
        { nombre: 'Responsabilidad', desc: 'Cumplimos nuestros compromisos y trabajamos con dedicación.', color: '#2E4D3B' },
        { nombre: 'Honestidad', desc: 'Ofrecemos información verdadera sobre nuestros productos.', color: '#B8741A' },
        { nombre: 'Respeto', desc: 'Valoramos a nuestros clientes, proveedores y colaboradores.', color: '#7B64A8' },
        { nombre: 'Creatividad', desc: 'Buscamos nuevas ideas para mejorar nuestros productos.', color: '#F0B94B' },
        { nombre: 'Compromiso', desc: 'Trabajamos para alcanzar nuestras metas.', color: '#4F8A4B' },
        { nombre: 'Calidad', desc: 'Procuramos ofrecer productos bien elaborados y presentados.', color: '#2E4D3B' },
        { nombre: 'Cuidado ambiental', desc: 'Promovemos prácticas responsables con el entorno.', color: '#6AA463' }
      ],
      ambiente: [
        'Utilizar empaques reciclables o que generen menos residuos cuando sea posible.',
        'Evitar el desperdicio de materiales.',
        'Promover el consumo responsable.',
        'Aprovechar adecuadamente los recursos.',
        'Mantener espacios limpios y organizados.',
        'Fomentar el respeto por la naturaleza.'
      ].map((t) => ({ t })),
      porque: [
        'Variedad de productos.',
        'Presentaciones bonitas y cuidadas.',
        'Atención cercana y amable.',
        'Escuchamos tus necesidades.',
        'Promovemos el emprendimiento local.',
        'Trabajamos con responsabilidad y creatividad.'
      ].map((t) => ({ t })),
      pasos: [
        'Ingresa a nuestra página web.',
        'Explora el catálogo de jabones.',
        'Selecciona los productos que deseas.',
        'Agrégalos al carrito de compras.',
        'Revisa las cantidades y el valor total.',
        'Envía tu pedido por WhatsApp.',
        'Confirma la disponibilidad, el precio y la entrega con nosotros.'
      ].map((t, i) => ({ n: String(i + 1).padStart(2, '0'), t })),
      subsistemas: [
        { nombre: 'Subsistema de información', desc: 'Contiene la historia, misión, visión, valores y datos del emprendimiento.' },
        { nombre: 'Subsistema de productos', desc: 'Presenta el catálogo de jabones, sus características, imágenes y precios.' },
        { nombre: 'Subsistema de ventas', desc: 'Permite seleccionar productos, agregarlos al carrito y organizar los pedidos.' },
        { nombre: 'Subsistema de comunicación', desc: 'Facilita el contacto mediante WhatsApp, formularios y redes sociales.' },
        { nombre: 'Subsistema de ubicación', desc: 'Permite conocer dónde se encuentra el emprendimiento mediante Google Maps.' },
        { nombre: 'Subsistema de estadísticas', desc: 'Permite conocer la cantidad de visitas que recibe la página web.' }
      ]
    };
  }
}

App.start(Component, Object.assign({ accent: "#2E4D3B" }, PRECIOS));
