/** Conteúdo comercial — proposta Koruvision × D&G Modas */

export const WHATSAPP = "5511987654321";
export const WA_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Olá! Quero conhecer o ecossistema Koruvision para a D&G Modas."
)}`;

export const SECTIONS = [
  { id: "capa", label: "Capa" },
  { id: "problema", label: "Desafio" },
  { id: "ecossistema", label: "Ecossistema" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "catalogo", label: "Catálogo" },
  { id: "landing", label: "Landing" },
  { id: "social", label: "Social" },
  { id: "posts", label: "Posts" },
  { id: "trafego", label: "Tráfego" },
  { id: "bling", label: "Bling" },
  { id: "crm", label: "CRM" },
  { id: "combos", label: "Combos" },
  { id: "fechamento", label: "Próximo passo" },
];

export const HERO = {
  eyebrow: "Proposta comercial exclusiva",
  brand: "Koruvision",
  partner: "D&G Modas",
  title: "Um ecossistema completo para digitalizar e escalar sua marca",
  subtitle:
    "Tecnologia, marketing e automação em uma única parceria — não apenas um site.",
  cta: "Explorar soluções",
};

export const PROBLEM = {
  title: "Operação fragmentada limita o crescimento",
  subtitle: "Ferramentas soltas geram retrabalho, perda de leads e zero visão unificada.",
  points: [
    { title: "Canais desconectados", text: "Loja, WhatsApp e redes sem integração." },
    { title: "Dados espalhados", text: "Estoque, pedidos e leads em planilhas diferentes." },
    { title: "Tempo perdido", text: "Equipe apagando incêndio em vez de vender." },
    { title: "Escala travada", text: "Crescer exige mais pessoas, não mais sistema." },
  ],
};

export const ECOSYSTEM = {
  title: "Tudo centralizado no ecossistema Koruvision",
  subtitle: "Da vitrine ao pós-venda — uma operação organizada, profissional e escalável.",
  pillars: [
    { id: "ecommerce", label: "E-commerce", desc: "Loja que converte 24h" },
    { id: "catalogo", label: "Catálogo Digital", desc: "Venda por link e QR" },
    { id: "landing", label: "Landing Pages", desc: "Campanhas que capturam" },
    { id: "social", label: "Redes Sociais", desc: "Presença com estratégia" },
    { id: "posts", label: "Koruvision Posts", desc: "Gestão inteligente + IA" },
    { id: "trafego", label: "Tráfego Pago", desc: "Aquisição previsível" },
    { id: "bling", label: "Bling", desc: "Estoque e fiscal" },
    { id: "crm", label: "CRM Koruvision", desc: "Atendimento que vende" },
  ],
};

export const ECOMMERCE = {
  id: "ecommerce",
  title: "E-commerce",
  subtitle: "Sua loja profissional — checkout otimizado, integrações e painel completo.",
  image: "/assets/proposta/ecommerce-mockup.webp",
  benefits: [
    "Loja virtual profissional",
    "Checkout otimizado",
    "Carrinho inteligente",
    "Área do cliente",
    "Produtos ilimitados",
    "Cupons e promoções",
    "Pix e cartão",
    "Controle de pedidos",
    "Painel administrativo",
    "Integração com Bling",
    "Integração com CRM",
    "Landing Pages + Catálogo",
  ],
  note: "Pagamento facilitado em até 2x. Mensalidade de suporte (hospedagem, manutenção e atualizações) contratada à parte.",
  plans: [
    {
      name: "Start",
      price: "R$ 2.490",
      period: "setup único",
      badge: null,
      desc: "Ideal para quem está começando.",
      features: ["Loja completa", "Pix + cartão", "Painel admin", "Até 500 produtos", "Suporte onboarding"],
    },
    {
      name: "Pro",
      price: "R$ 4.990",
      period: "setup único",
      badge: "MAIS VENDIDO",
      desc: "Mais recursos. Mais integrações. Melhor custo-benefício.",
      features: [
        "Tudo do Start",
        "Produtos ilimitados",
        "Bling + CRM",
        "Cupons avançados",
        "Catálogo integrado",
        "Prioridade no suporte",
      ],
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "projeto sob medida",
      badge: null,
      desc: "Tudo incluso para operações que exigem escala.",
      features: ["Tudo do Pro", "Multi-loja", "Customizações", "SLA dedicado", "Treinamento equipe"],
    },
  ],
  support: "Suporte mensal a partir de R$ 197 — hospedagem, manutenção, atualizações e suporte contínuo.",
};

export const CATALOG = {
  id: "catalogo",
  title: "Catálogo Digital",
  subtitle: "Funciona sozinho ou integrado ao e-commerce. Venda sem instalar app.",
  image: "/assets/proposta/catalogo-mobile.webp",
  price: "A partir de R$ 890",
  period: "setup",
  benefits: [
    "Compartilhamento por link",
    "WhatsApp nativo",
    "QR Code para loja física",
    "Catálogo inteligente",
    "Atualização rápida",
    "Organização por categorias",
    "Sem app para o cliente",
    "Integração com e-commerce",
  ],
};

export const LANDING = {
  id: "landing",
  title: "Landing Pages",
  subtitle: "Páginas de alta conversão para promoções, coleções e tráfego pago.",
  image: "/assets/proposta/landing-mockup.webp",
  price: "A partir de R$ 690",
  period: "por página",
  uses: ["Promoções", "Coleções", "Campanhas", "Lançamentos", "Captação de leads", "Tráfego pago"],
  note: "Integração direta com CRM Koruvision para nutrir e converter leads.",
};

export const SOCIAL = {
  id: "social",
  title: "Gestão de Redes Sociais",
  subtitle: "Planos sob medida — da estratégia à produção completa.",
  image: "/assets/proposta/social-grid.webp",
  plans: [
    {
      name: "Essencial",
      price: "R$ 990",
      period: "/mês",
      badge: null,
      features: ["Planejamento mensal", "Calendário editorial", "Estratégia", "Ideias de conteúdo"],
    },
    {
      name: "Growth",
      price: "R$ 1.990",
      period: "/mês",
      badge: "MAIS VENDIDO",
      features: [
        "Estratégia + calendário",
        "Produção de artes",
        "Carrosséis e Stories",
        "Reels",
        "Agendamento",
        "Relatórios mensais",
      ],
    },
    {
      name: "Premium",
      price: "R$ 3.490",
      period: "/mês",
      badge: null,
      features: [
        "Tudo do Growth",
        "Produção de fotos",
        "Cobertura de campanhas",
        "Direção criativa",
        "Planejamento completo",
        "Consultoria mensal",
      ],
    },
  ],
};

export const POSTS = {
  id: "posts",
  title: "Koruvision Posts",
  subtitle:
    "Plataforma inteligente de gerenciamento completo de redes sociais — tecnologia open source robusta, personalizada pela Koruvision.",
  image: "/assets/proposta/posts-calendar.webp",
  imageAi: "/assets/proposta/posts-ai.webp",
  platforms: [
    "Instagram",
    "Facebook",
    "TikTok",
    "LinkedIn",
    "Pinterest",
    "X",
    "Threads",
    "YouTube",
  ],
  features: [
    "Agendamento de postagens",
    "Calendário visual",
    "Organização de campanhas",
    "Publicação simultânea",
    "Dashboards modernos",
    "Cards inteligentes",
  ],
  ai: [
    "Geração automática de legendas",
    "Sugestão de hashtags",
    "Horários ideais",
    "Geração de imagens com IA",
    "Ideias de conteúdo",
    "Correção e reescrita",
    "Tradução automática",
    "Planejamento de calendário",
  ],
  plans: [
    {
      name: "Starter",
      price: "R$ 197",
      period: "/mês",
      badge: null,
      desc: "Ideal para pequenas empresas.",
      features: ["2 contas", "Agendamento", "Calendário", "IA básica"],
    },
    {
      name: "Business",
      price: "R$ 397",
      period: "/mês",
      badge: "MAIS VENDIDO",
      desc: "Mais contas. Mais IA. Mais automações.",
      features: ["8 contas", "IA avançada", "Campanhas", "Relatórios", "Automações"],
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "/mês",
      badge: null,
      desc: "Agências, grandes operações e várias marcas.",
      features: ["Contas ilimitadas", "Multi-equipe", "White-label", "SLA", "Onboarding VIP"],
    },
  ],
};

export const TRAFFIC = {
  id: "trafego",
  title: "Tráfego Pago",
  subtitle: "Gestor especializado — planejamento, otimização e conversão com relatório claro.",
  image: "/assets/proposta/ads-dashboard.webp",
  services: [
    "Planejamento e estratégia",
    "Criação de campanhas",
    "Segmentação e públicos",
    "Remarketing",
    "Pixel e eventos",
    "Conversões",
    "Otimização contínua",
    "Testes A/B",
    "Relatórios",
  ],
  plans: [
    {
      name: "Meta Ads",
      price: "R$ 550",
      period: "/mês",
      badge: null,
      desc: "Inclui uma conta Meta.",
      features: ["Instagram + Facebook", "Pixel", "Remarketing", "Relatório mensal"],
    },
    {
      name: "Google Ads",
      price: "R$ 850",
      period: "/mês",
      badge: null,
      desc: "Busca e Performance Max.",
      features: ["Campanhas de busca", "Remarketing", "Conversões", "Relatório mensal"],
    },
    {
      name: "Meta + Google",
      price: "R$ 1.250",
      period: "/mês",
      badge: "PACOTE COMPLETO",
      desc: "Aquisição omnichannel com gestão unificada.",
      features: ["Tudo Meta + Google", "Estratégia cruzada", "Prioridade", "Call semanal"],
    },
  ],
  note: "Investimento em mídia (verba) é à parte da gestão Koruvision.",
};

export const BLING = {
  id: "bling",
  title: "Bling",
  subtitle: "Gestão completa — pode ser contratado mesmo sem e-commerce.",
  image: "/assets/proposta/bling-dashboard.webp",
  benefits: [
    "Controle de estoque",
    "Produtos e compras",
    "Financeiro",
    "Vendas",
    "Nota fiscal",
    "Marketplace",
    "Loja física",
    "E-commerce",
    "Relatórios",
  ],
  plans: [
    {
      name: "Essencial",
      price: "R$ 1.290",
      period: "setup + config",
      badge: null,
      features: ["Cadastro produtos", "Estoque", "NF-e básica", "Treinamento"],
    },
    {
      name: "Growth",
      price: "R$ 2.490",
      period: "setup + config",
      badge: null,
      features: ["Tudo Essencial", "Financeiro", "Marketplace", "Relatórios"],
    },
    {
      name: "Completo",
      price: "R$ 3.990",
      period: "setup + config",
      badge: "MAIS VENDIDO",
      features: [
        "Tudo Growth",
        "Integração e-commerce",
        "Loja física",
        "Automações",
        "Suporte dedicado 30 dias",
      ],
    },
  ],
};

export const CRM = {
  id: "crm",
  title: "CRM Koruvision",
  subtitle: "Centralize atendimento, pipeline e pós-venda — com IA e automações.",
  image: "/assets/proposta/crm-kanban.webp",
  note: "Valores sob apresentação consultiva. Foco em transformação operacional.",
  features: [
    { group: "Atendimento", items: ["WhatsApp", "Multiatendentes", "Distribuição automática", "Histórico completo"] },
    { group: "Vendas", items: ["Pipeline", "Kanban", "Funil", "Leads", "Follow-up", "Agendamentos"] },
    { group: "Automação", items: ["Disparos", "Mensagens programadas", "Campanhas", "IA", "Catálogo inteligente"] },
    { group: "Gestão", items: ["Comissões", "Dashboards", "Indicadores", "Pós-venda", "Centralização"] },
  ],
};

export const COMBOS = {
  id: "combos",
  title: "Soluções completas para acelerar seu crescimento",
  subtitle: "Combos exclusivos — cada um parece um produto premium sob medida.",
  items: [
    {
      name: "Digital Start",
      badge: null,
      price: "R$ 1.890",
      period: "setup + 1º mês ads",
      ideal: "Ideal para gerar os primeiros clientes.",
      includes: ["Catálogo Digital", "Landing Page", "Meta Ads"],
    },
    {
      name: "Vendas",
      badge: "MAIS VENDIDO",
      price: "R$ 7.990",
      period: "setup integrado",
      ideal: "Motor completo de conversão e gestão.",
      includes: ["E-commerce", "Bling", "CRM", "Meta Ads"],
    },
    {
      name: "Social",
      badge: null,
      price: "R$ 2.290",
      period: "/mês",
      ideal: "Presença + ferramenta de publicação.",
      includes: ["Social Media Growth", "Koruvision Posts Business"],
    },
    {
      name: "Performance",
      badge: null,
      price: "R$ 2.490",
      period: "LP + 1º mês ads",
      ideal: "Campanhas que capturam e convertem.",
      includes: ["Landing Page", "Meta Ads", "Google Ads"],
    },
    {
      name: "Gestão",
      badge: null,
      price: "R$ 5.490",
      period: "setup",
      ideal: "Operação e atendimento sob controle.",
      includes: ["CRM", "Bling"],
    },
    {
      name: "Loja Inteligente",
      badge: null,
      price: "R$ 9.990",
      period: "setup + 1º mês social",
      ideal: "Vitrine + gestão + conteúdo.",
      includes: ["E-commerce", "Bling", "CRM", "Social Media", "Koruvision Posts"],
    },
    {
      name: "Crescimento",
      badge: null,
      price: "R$ 3.490",
      period: "setup + ads",
      ideal: "Aquisição com CRM alimentado.",
      includes: ["Landing Page", "CRM", "Meta Ads", "Google Ads"],
    },
    {
      name: "Escala",
      badge: "SOLUÇÃO COMPLETA",
      price: "Sob consulta",
      period: "projeto full",
      ideal: "Tudo incluso para dominar o digital.",
      includes: [
        "CRM",
        "E-commerce",
        "Landing Pages",
        "Catálogo",
        "Bling",
        "Social Media",
        "Koruvision Posts",
        "Meta Ads",
        "Google Ads",
      ],
    },
  ],
};

export const CLOSING = {
  id: "fechamento",
  title: "Você não precisa apenas de um site.",
  accent: "Você precisa do ecossistema Koruvision.",
  subtitle:
    "Tecnologia, estratégia, automação, marketing e gestão em uma única parceria — para a D&G Modas crescer organizada, profissional e escalável.",
  cta: "Quero minha proposta personalizada",
  triggers: [
    "Autoridade técnica",
    "Automação",
    "Inteligência Artificial",
    "Integração",
    "Escalabilidade",
    "Resultado",
  ],
};

export const ASSET_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8a1018"/>
          <stop offset="55%" stop-color="#c41e2a"/>
          <stop offset="100%" stop-color="#c9a76a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#faf7f4"/>
      <rect x="80" y="80" width="1040" height="640" rx="24" fill="url(#g)" opacity="0.92"/>
      <text x="600" y="410" text-anchor="middle" fill="#faf7f4" font-family="Georgia,serif" font-size="42">Koruvision</text>
    </svg>`
  );
