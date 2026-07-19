import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { useConfig } from "../hooks/useConfig.js";
import { formatBRL } from "../lib/utils.js";

export function TermsPage() {
  const cfg = useConfig();
  const brand = cfg?.brand || "DG Modas";
  const freeMin = cfg ? formatBRL(cfg.freeShippingMin) : "R$ 299,00";
  const email = cfg?.email || "atendimento@dgmodas.com.br";

  return (
    <>
      <PageHero label="Legal" title="Termos de" script="Uso" />
      <div className="container legal-page">
        <p className="legal-page__updated">Última atualização: 18 de julho de 2026</p>

        <section>
          <h2>1. Aceitação</h2>
          <p>
            Ao acessar e usar o site da {brand}, você concorda com estes Termos de Uso e com a{" "}
            <Link to="/privacidade">Política de Privacidade</Link>. Se não concordar, não utilize a loja.
          </p>
        </section>

        <section>
          <h2>2. Sobre a loja</h2>
          <p>
            A {brand} comercializa moda feminina, masculina e infantil. Os pedidos são finalizados de forma assistida
            via WhatsApp: o site organiza o carrinho e encaminha os dados para confirmação com nossa equipe.
          </p>
        </section>

        <section>
          <h2>3. Produtos e preços</h2>
          <ul>
            <li>Imagens e descrições são ilustrativas; pequenas variações de cor/caimento podem ocorrer.</li>
            <li>Preços, estoque e promoções podem mudar sem aviso prévio até a confirmação do pedido.</li>
            <li>Ofertas e cupons têm regras próprias (validade, valor mínimo e exclusões).</li>
          </ul>
        </section>

        <section>
          <h2>4. Pedidos e pagamento</h2>
          <p>
            O envio do pedido pelo WhatsApp não garante a reserva automática. A confirmação ocorre após validação de
            disponibilidade e forma de pagamento (Pix, cartão ou boleto, conforme combinado no atendimento). Parcelamento
            sujeito às condições informadas na loja.
          </p>
        </section>

        <section>
          <h2>5. Entrega e frete</h2>
          <p>
            Prazos e valores de frete são estimativas e podem variar por região/CEP. Frete grátis pode ser aplicado
            acima de {freeMin}, conforme regras vigentes. A {brand} não se responsabiliza por atrasos causados por
            transportadoras ou dados de endereço incorretos.
          </p>
        </section>

        <section>
          <h2>6. Trocas e devoluções</h2>
          <p>
            Em regra, aceitamos troca em até 7 dias após o recebimento, com etiquetas e sem indícios de uso, conforme
            orientação no atendimento. Produtos sob encomenda ou personalizados podem ter regras específicas.
          </p>
        </section>

        <section>
          <h2>7. Conduta do usuário</h2>
          <p>
            É proibido usar o site para fins ilícitos, tentar acessar áreas restritas, interferir no funcionamento ou
            enviar conteúdo ofensivo. Reservamo-nos o direito de recusar pedidos em caso de inconsistências ou abuso.
          </p>
        </section>

        <section>
          <h2>8. Propriedade intelectual</h2>
          <p>
            Marcas, textos, fotos e layout do site pertencem à {brand} ou a licenciantes. É vedada a reprodução sem
            autorização.
          </p>
        </section>

        <section>
          <h2>9. Contato</h2>
          <p>
            Dúvidas: <a href={`mailto:${email}`}>{email}</a>
            {cfg?.whatsapp ? (
              <>
                {" "}
                · WhatsApp{" "}
                <a href={`https://wa.me/${cfg.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  atendimento
                </a>
              </>
            ) : null}
            .
          </p>
        </section>

        <p className="legal-page__nav">
          Consulte também a <Link to="/privacidade">Política de Privacidade</Link>.
        </p>
      </div>
    </>
  );
}
