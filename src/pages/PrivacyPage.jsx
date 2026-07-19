import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { useConfig } from "../hooks/useConfig.js";

export function PrivacyPage() {
  const cfg = useConfig();
  const email = cfg?.email || "atendimento@dgmodas.com.br";
  const brand = cfg?.brand || "DG Modas";

  return (
    <>
      <PageHero label="Legal" title="Política de" script="Privacidade" />
      <div className="container legal-page">
        <p className="legal-page__updated">Última atualização: 18 de julho de 2026</p>

        <section>
          <h2>1. Quem somos</h2>
          <p>
            A {brand} (“nós”) opera a loja virtual disponível em d-g-modas.vercel.app. Esta política explica como
            tratamos dados pessoais no contexto de navegação, pedidos via WhatsApp e atendimento.
          </p>
        </section>

        <section>
          <h2>2. Dados que podemos coletar</h2>
          <ul>
            <li>
              <strong>Dados de navegação:</strong> páginas visitadas, dispositivo, preferências salvas no navegador
              (carrinho, favoritos, comparação e consentimento de cookies).
            </li>
            <li>
              <strong>Dados de pedido:</strong> nome, telefone/WhatsApp, endereço de entrega, CEP e informações
              fornecidas voluntariamente no checkout para montar o pedido.
            </li>
            <li>
              <strong>Comunicações:</strong> mensagens trocadas pelo WhatsApp, e-mail ou Instagram no atendimento.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidades</h2>
          <ul>
            <li>Processar pedidos e organizar entrega/retirada;</li>
            <li>Atendimento comercial e pós-venda;</li>
            <li>Melhorar a experiência da loja (preferências locais no dispositivo);</li>
            <li>Cumprir obrigações legais e prevenir fraudes.</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies e armazenamento local essenciais ao funcionamento do site (ex.: carrinho e consentimento).
            Você pode gerenciar preferências pelo banner de cookies ou limpar os dados do navegador a qualquer momento.
          </p>
        </section>

        <section>
          <h2>5. Compartilhamento</h2>
          <p>
            Não vendemos seus dados. Podemos compartilhar informações necessárias com prestadores de entrega,
            meios de pagamento (quando aplicável) e ferramentas de comunicação (ex.: WhatsApp), sempre para cumprir
            o pedido ou obrigação legal.
          </p>
        </section>

        <section>
          <h2>6. Seus direitos (LGPD)</h2>
          <p>
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar acesso, correção,
            anonimização, portabilidade ou exclusão de dados pessoais, além de informações sobre o tratamento.
          </p>
        </section>

        <section>
          <h2>7. Contato</h2>
          <p>
            Dúvidas sobre privacidade:{" "}
            <a href={`mailto:${email}`}>{email}</a>
            {cfg?.whatsapp ? (
              <>
                {" "}
                ou WhatsApp{" "}
                <a href={`https://wa.me/${cfg.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {cfg.whatsapp}
                </a>
              </>
            ) : null}
            .
          </p>
        </section>

        <p className="legal-page__nav">
          Veja também os <Link to="/termos">Termos de Uso</Link>.
        </p>
      </div>
    </>
  );
}
