/**
 * One-shot generator for data/products.json — run: node scripts/build-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const reviewsPool = [
  { name: "Ana Clara", rating: 5, text: "Peça impecável, tecido premium e caimento perfeito.", verified: true, date: "2026-05-12", photos: [] },
  { name: "Mariana Lopes", rating: 5, text: "Superou expectativas. Atendimento nota 10.", verified: true, date: "2026-04-03", photos: [] },
  { name: "Camila Ferreira", rating: 4, text: "Linda e confortável. Voltarei a comprar.", verified: true, date: "2026-03-18", photos: [] },
  { name: "Rafael Souza", rating: 5, text: "Qualidade DG Modas de verdade. Recomendo.", verified: true, date: "2026-06-01", photos: [] },
  { name: "Juliana Menezes", rating: 5, text: "Chegou rápido e exatamente como nas fotos.", verified: true, date: "2026-02-22", photos: [] },
];

function stockStatus(sizes, forceMadeToOrder = false) {
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  if (forceMadeToOrder) return "made_to_order";
  if (total === 0) return "unavailable";
  if (total <= 2) return "last_units";
  if (total <= 6) return "low";
  return "in_stock";
}

function sizesAdult(seed = 1) {
  const base = [2, 4, 6, 3, 1];
  const keys = ["PP", "P", "M", "G", "GG"];
  const out = {};
  keys.forEach((k, i) => {
    out[k] = Math.max(0, (base[i] + seed + i * 2) % 9);
  });
  return out;
}

function sizesKids(seed = 1) {
  const keys = ["2", "4", "6", "8", "10"];
  const out = {};
  keys.forEach((k, i) => {
    out[k] = Math.max(0, (3 + seed + i) % 8);
  });
  return out;
}

const raw = [
  { id: "fem-conjunto-marrom", slug: "colete-short-marrom", name: "Colete & Short Marrom", cat: "feminino", price: 249.9, img: "fem-conjunto-marrom.jpg", badge: "bestseller", colors: [["Marrom", "#8B5E3C"], ["Preto", "#1a1a1a"], ["Bege", "#D4C4A8"]], desc: "Conjunto sofisticado em alfaiataria leve, ideal para o dia a dia com presença.", benefits: ["Caimento estruturado", "Tecido respirável", "Versátil dia/noite"], specs: { material: "Linho misto", cuidado: "Lavar a seco", origem: "Brasil" }, dims: "Colete 55cm / Short 38cm" },
  { id: "fem-vestido-vermelho", slug: "vestido-vermelho-canelado", name: "Vestido Vermelho Canelado", cat: "feminino", price: 219.9, img: "fem-vestido-vermelho.jpg", badge: "sale", salePrice: 189.9, colors: [["Vermelho", "#c41e2a"], ["Preto", "#1a1a1a"], ["Vinho", "#6e0e16"]], desc: "Vestido canelado com modelagem que valoriza a silhueta e conforto o dia todo.", benefits: ["Elastano premium", "Não marca", "Cor intensa"], specs: { material: "Malha canelada", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 95cm" },
  { id: "fem-jaguar", slug: "camiseta-jaguar-feline", name: "Jaguar Feline", cat: "feminino", price: 129.9, img: "fem-jaguar.jpg", badge: "new", colors: [["Off-white", "#f6f2ee"], ["Preto", "#1a1a1a"]], desc: "Camiseta com estampa feline exclusiva DG — street chic com atitude.", benefits: ["Estampa exclusiva", "Algodão macio", "Caimento oversized"], specs: { material: "Algodão 100%", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga 22cm" },
  { id: "fem-vestido-folk", slug: "vestido-folk-floral", name: "Vestido Folk", cat: "feminino", price: 239.9, img: "fem-vestido-folk.jpg", badge: null, colors: [["Floral", "#c9a76a"], ["Terracota", "#C45C26"]], desc: "Vestido folk com estampa delicada e movimento fluido.", benefits: ["Babados leves", "Forro interno", "Cintura marcada"], specs: { material: "Viscose", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 110cm" },
  { id: "fem-crop-azul", slug: "crop-azul-babado", name: "Crop Azul Babado", cat: "feminino", price: 119.9, img: "fem-crop-azul.jpg", badge: "new", colors: [["Azul", "#4A6FA5"], ["Branco", "#ffffff"], ["Rosa", "#E8A0BF"]], desc: "Crop com babados suaves — peça-chave para looks de verão.", benefits: ["Leveza", "Combina com jeans", "Acabamento delicado"], specs: { material: "Crepe", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 38cm" },
  { id: "fem-short-terracota", slug: "short-terracota-destroyed", name: "Short Terracota", cat: "feminino", price: 139.9, img: "fem-short-terracota.jpg", badge: null, colors: [["Terracota", "#C45C26"], ["Jeans", "#5B7C99"]], desc: "Short destroyed em tom terracota com vibe contemporânea.", benefits: ["Cintura alta", "Destroyed artesanal", "Conforto"], specs: { material: "Jeans stretch", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Comprimento 36cm" },
  { id: "fem-deer-print", slug: "camiseta-deer-print", name: "Deer Print", cat: "feminino", price: 129.9, img: "fem-deer-print.jpg", badge: null, colors: [["Creme", "#f6f2ee"], ["Preto", "#1a1a1a"]], desc: "Camiseta com print artístico deer — peça de assinatura.", benefits: ["Print exclusivo", "Malha premium", "Versátil"], specs: { material: "Algodão penteado", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga 20cm" },
  { id: "fem-camisa-listra", slug: "camisa-listrada-feminina", name: "Camisa Listrada", cat: "feminino", price: 159.9, img: "fem-camisa-listra.jpg", badge: null, colors: [["Listra navy", "#1e3a5f"], ["Listra vinho", "#8a1018"]], desc: "Camisa listrada clássica com toque contemporâneo.", benefits: ["Corte alfaiataria", "Botões dourados", "Leve"], specs: { material: "Tricoline", cuidado: "Máquina 40°C", origem: "Brasil" }, dims: "Comprimento 68cm" },
  { id: "fem-top-menta", slug: "top-menta-canelado", name: "Top Menta", cat: "feminino", price: 99.9, img: "fem-top-menta.jpg", badge: "sale", salePrice: 79.9, colors: [["Menta", "#7BC4A8"], ["Lilás", "#B8A0D0"], ["Preto", "#1a1a1a"]], desc: "Top canelado na cor menta — essencial do guarda-roupa.", benefits: ["Canelado stretch", "Segura bem", "Cores vibrantes"], specs: { material: "Poliamida", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 42cm" },
  { id: "fem-top-lilas", slug: "top-lilas-canelado", name: "Top Lilás", cat: "feminino", price: 99.9, img: "fem-top-lilas.jpg", badge: null, colors: [["Lilás", "#B8A0D0"], ["Menta", "#7BC4A8"]], desc: "Top canelado lilás com caimento elegante.", benefits: ["Conforto total", "Não transparente", "Combina fácil"], specs: { material: "Poliamida", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 42cm" },
  { id: "fem-conjunto-azul", slug: "conjunto-azul-tropical", name: "Conjunto Azul Tropical", cat: "feminino", price: 269.9, img: "fem-conjunto-azul.jpg", badge: "bestseller", colors: [["Azul tropical", "#2E6B8A"], ["Verde folha", "#3D6B4F"]], desc: "Conjunto tropical em azul intenso — presença garantida.", benefits: ["Conjunto coordenado", "Estampa exclusiva", "Caimento fluido"], specs: { material: "Viscose premium", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Top 45cm / Calça 100cm" },
  { id: "fem-macaquinho-preto", slug: "macaquinho-preto-ombro", name: "Macaquinho Preto", cat: "feminino", price: 229.9, img: "fem-macaquinho-preto.jpg", badge: null, colors: [["Preto", "#1a1a1a"], ["Vinho", "#8a1018"]], desc: "Macaquinho ombro só em preto sofisticado.", benefits: ["Decote assimétrico", "Cinto incluso", "Noite & evento"], specs: { material: "Crepe", cuidado: "Lavar a seco", origem: "Brasil" }, dims: "Comprimento 85cm" },
  { id: "fem-vestido-floral", slug: "vestido-floral-terracota", name: "Vestido Floral", cat: "feminino", price: 239.9, img: "fem-vestido-floral.jpg", badge: "new", colors: [["Floral terracota", "#C45C26"], ["Floral azul", "#4A6FA5"]], desc: "Vestido floral em tons terracota com caimento romântico.", benefits: ["Estampa delicada", "Cintura ajustável", "Forrado"], specs: { material: "Viscose", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Comprimento 105cm" },
  { id: "fem-macacao-bege", slug: "macacao-bege-envelope", name: "Macacão Bege", cat: "feminino", price: 259.9, img: "fem-macacao-bege.jpg", badge: null, colors: [["Bege", "#D4C4A8"], ["Off-white", "#f6f2ee"]], desc: "Macacão envelope bege — elegância atemporal.", benefits: ["Envelope versátil", "Cinto faixa", "Tecido nobre"], specs: { material: "Linho misto", cuidado: "Lavar a seco", origem: "Brasil" }, dims: "Comprimento 140cm" },
  { id: "fem-jaguar-2", slug: "camiseta-jaguar-instinct", name: "Jaguar Instinct", cat: "feminino", price: 129.9, img: "fem-jaguar-2.jpg", badge: null, colors: [["Preto", "#1a1a1a"], ["Off-white", "#f6f2ee"]], desc: "Segunda edição da linha Jaguar com print Instinct.", benefits: ["Edição limitada", "Malha premium", "Estampa arte"], specs: { material: "Algodão 100%", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga 22cm" },
  { id: "masc-polo-bordo", slug: "polo-bordo", name: "Polo Bordô", cat: "masculino", price: 169.9, img: "masc-polo-bordo.jpg", imgs: ["masc-polo-bordo.jpg", "masc-polo-bordo-2.jpg"], badge: "bestseller", colors: [["Bordô", "#8a1018"], ["Verde", "#3D6B4F"], ["Preto", "#1a1a1a"]], desc: "Polo piquet bordô com acabamento premium e presença discreta.", benefits: ["Piquet egípcio", "Gola reforçada", "Caimento regular"], specs: { material: "Algodão piquet", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga 22cm" },
  { id: "masc-polo-verde", slug: "polo-verde", name: "Polo Verde", cat: "masculino", price: 169.9, img: "masc-polo-verde.jpg", imgs: ["masc-polo-verde.jpg", "masc-polo-verde-2.jpg"], badge: null, colors: [["Verde", "#3D6B4F"], ["Bordô", "#8a1018"]], desc: "Polo verde sofisticada para o dia a dia elegante.", benefits: ["Respirável", "Cor viva", "Acabamento fino"], specs: { material: "Algodão piquet", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga 22cm" },
  { id: "masc-camisa-preta", slug: "camisa-social-preta", name: "Camisa Preta", cat: "masculino", price: 189.9, img: "masc-camisa-preta.jpg", badge: "new", colors: [["Preto", "#1a1a1a"], ["Branco", "#ffffff"], ["Verde", "#3D6B4F"]], desc: "Camisa social preta com corte moderno e tecido leve.", benefits: ["Anti-amassado", "Botões reforçados", "Manga longa"], specs: { material: "Tricoline premium", cuidado: "Máquina 40°C", origem: "Brasil" }, dims: "Comprimento 74cm" },
  { id: "masc-camisa-branca", slug: "camisa-social-branca", name: "Camisa Branca", cat: "masculino", price: 189.9, img: "masc-camisa-branca.jpg", imgs: ["masc-camisa-branca.jpg", "masc-camisa-branca-2.jpg"], badge: "bestseller", colors: [["Branco", "#ffffff"], ["Preto", "#1a1a1a"]], desc: "Camisa branca clássica — essencial do guarda-roupa masculino.", benefits: ["Branco óptico", "Colarinho estruturado", "Versátil"], specs: { material: "Tricoline", cuidado: "Máquina 40°C", origem: "Brasil" }, dims: "Comprimento 74cm" },
  { id: "masc-camisa-verde", slug: "camisa-social-verde", name: "Camisa Verde", cat: "masculino", price: 189.9, img: "masc-camisa-verde.jpg", badge: null, colors: [["Verde", "#3D6B4F"], ["Branco", "#ffffff"]], desc: "Camisa social verde com presença sofisticada.", benefits: ["Tom exclusivo", "Caimento slim", "Conforto"], specs: { material: "Tricoline", cuidado: "Máquina 40°C", origem: "Brasil" }, dims: "Comprimento 74cm" },
  { id: "masc-short-bege", slug: "short-bege-masculino", name: "Short Bege", cat: "masculino", price: 149.9, img: "masc-short-bege.jpg", badge: null, colors: [["Bege", "#D4C4A8"], ["Marinho", "#1e3a5f"]], desc: "Short bege em tecido leve para o verão urbano.", benefits: ["Cintura elástica", "Bolsos laterais", "Leve"], specs: { material: "Sarja leve", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Comprimento 42cm" },
  { id: "inf-vestido-floral", slug: "vestido-floral-infantil", name: "Vestido Floral Infantil", cat: "infantil", price: 149.9, img: "inf-vestido-floral.jpg", badge: "new", colors: [["Floral rosa", "#E8A0BF"], ["Floral azul", "#4A6FA5"]], desc: "Vestido floral infantil com leveza e charme DG.", benefits: ["Tecido macio", "Fácil de vestir", "Estampa delicada"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Comprimento variável por tamanho" },
  { id: "inf-polo-menino", slug: "polo-short-infantil", name: "Polo & Short", cat: "infantil", price: 159.9, img: "inf-polo-menino.jpg", badge: "bestseller", colors: [["Azul", "#4A6FA5"], ["Verde", "#3D6B4F"]], desc: "Conjunto polo e short para meninos — conforto com estilo.", benefits: ["Conjunto completo", "Elástico confortável", "Durável"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Conforme tabela infantil" },
  { id: "inf-conjunto-rosa", slug: "conjunto-rosa-infantil", name: "Conjunto Rosa", cat: "infantil", price: 169.9, img: "inf-conjunto-rosa.jpg", badge: null, colors: [["Rosa", "#E8A0BF"], ["Lilás", "#B8A0D0"]], desc: "Conjunto rosa delicado para ocasiões especiais.", benefits: ["Doce e confortável", "Acabamento fino", "Presenteável"], specs: { material: "Malha algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Conforme tabela infantil" },
  { id: "inf-stylish-boy", slug: "camiseta-stylish-boy", name: "Stylish Boy", cat: "infantil", price: 89.9, img: "inf-stylish-boy.jpg", badge: "sale", salePrice: 69.9, colors: [["Branco", "#ffffff"], ["Preto", "#1a1a1a"]], desc: "Camiseta Stylish Boy com print divertido.", benefits: ["Print exclusivo", "Malha macia", "Dia a dia"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga curta" },
  { id: "inf-sunshine", slug: "conjunto-daddy-sunshine", name: "Daddy's Sunshine", cat: "infantil", price: 159.9, img: "inf-sunshine.jpg", badge: null, colors: [["Amarelo", "#E8C547"], ["Branco", "#ffffff"]], desc: "Conjunto Daddy's Sunshine — alegria em cada detalhe.", benefits: ["Cores alegres", "Conjunto 2 peças", "Conforto"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Conforme tabela infantil" },
  { id: "inf-regata-vermelha", slug: "regata-vermelha-infantil", name: "Regata Vermelha", cat: "infantil", price: 79.9, img: "inf-regata-vermelha.jpg", badge: null, colors: [["Vermelho", "#c41e2a"], ["Branco", "#ffffff"]], desc: "Regata vermelha infantil para brincar com estilo.", benefits: ["Leve", "Não aperta", "Cor viva"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Regata" },
  { id: "inf-camiseta-barbie", slug: "camiseta-barbie", name: "Camiseta Barbie", cat: "infantil", price: 89.9, img: "inf-camiseta-barbie.jpg", badge: "bestseller", colors: [["Rosa", "#E8A0BF"], ["Branco", "#ffffff"]], desc: "Camiseta temática Barbie com malha macia.", benefits: ["Licenciada vibe", "Malha premium", "Presente perfeito"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga curta" },
  { id: "inf-vestido-bebe", slug: "vestido-perolas-bebe", name: "Vestido Pérolas", cat: "infantil", price: 139.9, img: "inf-vestido-bebe.jpg", badge: "new", colors: [["Rosa bebê", "#F5D0D8"], ["Branco", "#ffffff"]], desc: "Vestido bebê com detalhes de pérolas — ocasiões especiais.", benefits: ["Detalhes delicados", "Forro macio", "Fácil vestir"], specs: { material: "Algodão + tule", cuidado: "Lavar à mão", origem: "Brasil" }, dims: "Conforme tabela bebê" },
  { id: "inf-camisa-menino", slug: "camisa-listrada-infantil", name: "Camisa Listrada Infantil", cat: "infantil", price: 119.9, img: "inf-camisa-menino.jpg", badge: null, colors: [["Listra azul", "#4A6FA5"], ["Listra verde", "#3D6B4F"]], desc: "Camisa listrada infantil com ar clássico.", benefits: ["Estilo clássico", "Conforto", "Versátil"], specs: { material: "Algodão", cuidado: "Máquina 30°C", origem: "Brasil" }, dims: "Manga longa" },
];

const products = raw.map((p, idx) => {
  const isKids = p.cat === "infantil";
  const sizeFn = isKids ? sizesKids : sizesAdult;
  const gallery = (p.imgs || [p.img]).map((f) => `assets/${f}`);
  const variants = p.colors.map(([color, hex], vi) => {
    const sizes = sizeFn(idx + vi + 1);
    // Color variants share base gallery until Gemini recolors (optional paths noted for future)
    const images = gallery;
    return {
      id: `${p.id}-${vi}`,
      color,
      hex,
      sku: `DG-${p.cat.slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, "0")}-${color.slice(0, 3).toUpperCase()}`,
      sizes,
      stockStatus: stockStatus(sizes, idx % 11 === 0 && vi === 1),
      images,
      imageHint: vi === 0 ? null : `assets/${p.img.replace(".jpg", "")}-var-${vi}.jpg`,
      priceDelta: vi === 0 ? 0 : vi * 5,
    };
  });

  const related = raw
    .filter((r) => r.cat === p.cat && r.id !== p.id)
    .slice(0, 4)
    .map((r) => r.id);

  const faq = [
    { q: "Qual o prazo de entrega?", a: "De 2 a 12 dias úteis conforme a modalidade de frete escolhida." },
    { q: "Posso trocar o tamanho?", a: "Sim. Trocas em até 7 dias após o recebimento, com etiquetas." },
    { q: "Como faço o pedido?", a: "Monte o carrinho e finalize pelo WhatsApp com atendimento personalizado." },
  ];

  const reviewSlice = [reviewsPool[idx % 5], reviewsPool[(idx + 2) % 5]].map((r, ri) => ({
    ...r,
    id: `${p.id}-r${ri}`,
  }));

  return {
    id: p.id,
    slug: p.slug,
    skuBase: `DG-${p.cat.slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`,
    name: p.name,
    category: p.cat,
    price: p.price,
    salePrice: p.salePrice || null,
    badge: p.badge,
    description: p.desc,
    longDescription: `${p.desc} Cada peça DG Modas é selecionada com critério de acabamento, caimento e presença — para vestir com elegância no dia a dia e em ocasiões especiais.`,
    benefits: p.benefits,
    specs: p.specs,
    dimensions: p.dims,
    guarantee: "90 dias de garantia contra defeitos de fabricação.",
    deliveryDays: [3, 8],
    variants,
    reviews: reviewSlice,
    faq,
    related,
    features: ["Acabamento premium", "Embalagem cuidadosa", "Atendimento especializado"],
    popular: !!p.badge && (p.badge === "bestseller" || p.badge === "new"),
    createdAt: `2026-0${(idx % 6) + 1}-15`,
  };
});

fs.writeFileSync(path.join(ROOT, "data", "products.json"), JSON.stringify(products, null, 2), "utf8");
console.log(`Wrote ${products.length} products`);
