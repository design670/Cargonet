import { forwardRef } from 'react';
import { Icon } from './Icon';
import { whatsappLink } from '../content/site';

export type SummaryRow = { label: string; value: string };

type Props =
  | { kind: 'sent' }
  | { kind: 'error'; message: string }
  | { kind: 'not-configured'; summary: SummaryRow[]; whatsappIntro: string; onEdit: () => void };

/**
 * Estado posterior al envío. La confirmación solo aparece con respuesta real
 * del servicio; si no hay integración se explica sin simular una recepción.
 */
export const FormStatus = forwardRef<HTMLDivElement, Props>(function FormStatus(props, ref) {
  if (props.kind === 'sent') {
    return (
      <div ref={ref} tabIndex={-1} className="form-status form-status--ok" role="status">
        <Icon name="check" size={24} />
        <div>
          <p className="form-status__title">Recibimos tu solicitud.</p>
          <p>Nuestro equipo revisará la información y te contactará por los datos que registraste.</p>
        </div>
      </div>
    );
  }

  if (props.kind === 'error') {
    return (
      <div ref={ref} tabIndex={-1} className="form-status form-status--error" role="alert">
        <Icon name="alert" size={24} />
        <p>{props.message}</p>
      </div>
    );
  }

  const text = [props.whatsappIntro, ...props.summary.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`)].join('\n');

  return (
    <div ref={ref} tabIndex={-1} className="form-status form-status--pending" role="status">
      <div className="form-status__head">
        <Icon name="info" size={24} />
        <div>
          <p className="form-status__title">El envío en línea aún no está habilitado.</p>
          <p>
            Tu solicitud <strong>no se ha enviado</strong>. Revisa tus datos y compártelos con un asesor por WhatsApp
            para recibir orientación.
          </p>
        </div>
      </div>
      <dl className="summary">
        {props.summary
          .filter((r) => r.value)
          .map((r) => (
            <div key={r.label} className="summary__row">
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
      </dl>
      <div className="form-status__actions">
        <a className="btn btn--primary" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
          <span>Enviar por WhatsApp</span>
          <Icon name="arrowUpRight" size={18} className="btn__icon" />
        </a>
        <button type="button" className="btn btn--secondary" onClick={props.onEdit}>
          <span>Editar datos</span>
        </button>
      </div>
    </div>
  );
});
