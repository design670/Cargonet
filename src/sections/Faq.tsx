import { TwoToneTitle } from '../components/TwoToneTitle';
import { Accordion, type AccordionItem } from '../components/Accordion';
import { Button } from '../components/Button';
import { SectionHeading } from '../components/SectionHeading';
import { whatsappLink } from '../content/site';

// La pregunta sobre saldo y pagos se omite: esas funciones pertenecen al panel de usuario.
const items: AccordionItem[] = [
  {
    question: '¿Cómo obtengo mi casillero en Estados Unidos?',
    answer: <p>Regístrate en CargoNet USA y sigue las instrucciones para obtener los datos de tu casillero.</p>,
  },
  {
    question: '¿Qué debo hacer después de comprar?',
    answer: (
      <p>
        Registra una prealerta en tu cuenta, adjunta la factura y proporciona el número de tracking de la transportadora
        de origen.
      </p>
    ),
  },
  {
    question: '¿Cómo sé si mi paquete llegó a la bodega de Miami?',
    answer: (
      <p>
        Consulta el tracking con la transportadora de origen para verificar la entrega. Posteriormente, revisa los
        eventos registrados por CargoNet USA en tu portal.
      </p>
    ),
  },
  {
    question: '¿Por qué mi paquete todavía no aparece recibido?',
    answer: (
      <p>
        Es posible que la transportadora de origen aún no lo haya entregado en la bodega o que esté pendiente su
        identificación y registro. Si el tracking confirma la entrega y el paquete no aparece en tu cuenta, contacta al
        equipo de atención.
      </p>
    ),
  },
  {
    question: '¿Cuánto tarda en llegar mi paquete?',
    answer: (
      <p>
        Los tiempos dependen de la modalidad contratada y de las etapas del proceso. CargoNet USA realiza despachos
        semanales; consulta las condiciones específicas de tu servicio.
      </p>
    ),
  },
  {
    question: '¿Qué sucede si falta la factura o algún documento?',
    answer: (
      <p>
        El paquete puede requerir una validación adicional antes de continuar. Revisa las novedades en tu cuenta y
        completa la documentación solicitada.
      </p>
    ),
  },
  {
    question: '¿Qué ocurre si mi mercancía tiene restricciones?',
    answer: (
      <p>
        Algunas mercancías requieren validaciones especiales o no son elegibles para determinadas modalidades. Consulta
        los requisitos antes de realizar la compra o contratar el envío.
      </p>
    ),
  },
  {
    question: '¿Cómo solicito una cotización?',
    answer: (
      <p>
        Ingresa al <a href="#cotizar-envio">cotizador</a>, selecciona el tipo de operación y proporciona la información de tu
        envío.
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
            <Button href={whatsappLink('Hola, tengo una pregunta sobre mi envío.')} variant="secondary" icon="arrowUpRight" target="_blank" rel="noopener noreferrer">
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
