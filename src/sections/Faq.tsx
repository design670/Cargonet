import { TwoToneTitle } from '../components/TwoToneTitle';
import { Accordion, type AccordionItem } from '../components/Accordion';
import { Button } from '../components/Button';
import { SectionHeading } from '../components/SectionHeading';
import { commercialWhatsappLink, contact, links, whatsappLink } from '../content/site';
import { courier } from '../lib/courier-rates';
import { steps } from './StepsCarousel';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * Preguntas en orden de prioridad: casillero, prealerta, mercancías no aceptadas,
 * límites Courier, impuestos, tiempos, rastreo, novedades y contacto.
 * Los datos salen de site.ts, courier-rates.ts y la línea de tiempo de estados.
 */
const items: AccordionItem[] = [
  {
    question: '¿Cómo creo mi casillero?',
    answer: (
      <p>
        <a href={links.register} {...ext}>
          Regístrate en el portal de CargoNet USA
        </a>{' '}
        en 2 pasos. Recibes tu dirección en Miami con tu código personal; úsala como dirección de envío al pagar en
        cualquier tienda de EE.UU.
      </p>
    ),
  },
  {
    question: '¿Cómo prealerto mi compra?',
    answer: (
      <p>
        Antes de que tu paquete llegue a Miami, regístralo en{' '}
        <a href={links.prealert} {...ext}>
          la prealerta de tu casillero
        </a>{' '}
        con la tienda, el número de tracking, qué contiene y su valor, y adjunta la factura donde se vea el producto y el
        valor. Así lo identificamos sin demoras. También puedes enviarla desde la pestaña{' '}
        <a href="#cotizar-envio" data-qt-tab="prealert">
          Prealertar
        </a>{' '}
        de esta página.
      </p>
    ),
  },
  {
    question: '¿Qué mercancías no se aceptan?',
    answer: (
      <p>
        Hay mercancías que no se admiten y otras que requieren validación especial o no aplican para Courier. Revisa la
        lista en los{' '}
        <a href={links.requirementsPdf} {...ext}>
          requisitos de envío (PDF)
        </a>{' '}
        antes de comprar y, si tienes dudas sobre un producto, consúltalo con un asesor.
      </p>
    ),
  },
  {
    question: '¿Cuáles son los límites del servicio Courier?',
    answer: (
      <p>
        Hasta {courier.maxWeightLb} lb de peso real, un valor de hasta US${courier.maxValueUsd.toLocaleString('es-CO')} y la
        suma de los 3 lados del paquete hasta 3 m. Si tu envío supera alguno de estos límites, lo gestionamos como carga
        con un asesor.
      </p>
    ),
  },
  {
    question: '¿Tengo que pagar impuestos?',
    answer: (
      <p>
        Los productos de EE.UU. con valor de hasta US${courier.dutyFreeUsd} no pagan arancel ni IVA. Si el producto es de
        otro país o vale más, aplican impuestos y un asesor te confirma los valores. En el{' '}
        <a href="#cotizar-envio">cotizador</a> ves el estimado de tu envío.
      </p>
    ),
  },
  {
    question: '¿Cuánto tarda en llegar mi paquete?',
    answer: (
      <p>
        Los tiempos dependen de la modalidad y de las etapas del proceso. CargoNet USA realiza despachos semanales desde
        Miami y te avisamos en cada estado hasta la entrega.
      </p>
    ),
  },
  {
    question: '¿Cómo rastreo mi envío?',
    answer: (
      <>
        <p>
          Con tu número de guía en la pestaña{' '}
          <a href="#cotizar-envio" data-qt-tab="track">
            Rastrear
          </a>{' '}
          de esta página o en el{' '}
          <a href={links.tracking} {...ext}>
            portal de rastreo
          </a>
          . Tu envío pasa por estos estados:
        </p>
        <p>{steps.map((s) => s.title).join(' → ')}.</p>
      </>
    ),
  },
  {
    question: '¿Qué pasa si hay una novedad con mi paquete?',
    answer: (
      <p>
        Si falta la factura o algún documento, hay un faltante, un daño o una diferencia con lo prealertado, el paquete
        queda en validación hasta resolverlo. Revisa las novedades en tu cuenta y un asesor revisa tu caso. Si el tracking
        de la tienda dice que se entregó y no aparece en tu cuenta, escríbenos.
      </p>
    ),
  },
  {
    question: '¿Cómo me comunico con CargoNet USA?',
    answer: (
      <p>
        Por{' '}
        <a href={whatsappLink('Hola, tengo una pregunta sobre mi envío.')} {...ext}>
          WhatsApp al {contact.whatsappLabel}
        </a>{' '}
        o al correo <a href={`mailto:${contact.email}`}>{contact.email}</a>. Nuestra bodega está en{' '}
        {contact.warehouse.join(', ')}.
      </p>
    ),
  },
];

export function Faq() {
  return (
    <section id="preguntas" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__intro">
          <SectionHeading id="faq-title" title={<TwoToneTitle light="Resolvemos tus dudas" bold="antes de" accent="enviar." />} />
          <div className="faq__help" data-reveal>
            <p>¿No encuentras tu respuesta? Un asesor puede orientarte sobre tu caso.</p>
            <Button href={commercialWhatsappLink('Hola, tengo una pregunta sobre mi envío.')} variant="secondary" icon="arrowUpRight" target="_blank" rel="noopener noreferrer">
              Hablar con un asesor
            </Button>
          </div>
        </div>
        <div data-reveal>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
