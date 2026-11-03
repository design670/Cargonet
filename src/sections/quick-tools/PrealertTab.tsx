import { useState, type FormEvent } from 'react';
import { Icon } from '../../components/Icon';
import { TextField } from '../../components/Field';
import { links, whatsappLink } from '../../content/site';
import { parseNum } from '../../lib/quote-engine';

type Data = { locker: string; store: string; tracking: string; content: string; value: string };
const empty: Data = { locker: '', store: '', tracking: '', content: '', value: '' };

/** Pestaña "Prealertar": arma la prealerta y la envía por WhatsApp (sin servicio conectado). */
export function PrealertTab() {
  const [data, setData] = useState<Data>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Data) => (e: { target: { value: string } }) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    setSent(false);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!data.locker.trim()) er.locker = 'Escribe tu número de casillero.';
    if (!data.store.trim()) er.store = 'Indica la tienda.';
    if (!data.tracking.trim()) er.tracking = 'Escribe el tracking de la tienda.';
    if (!data.content.trim()) er.content = 'Cuéntanos qué contiene.';
    if (!(parseNum(data.value) > 0)) er.value = 'Indica el valor en USD.';
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLInputElement>(`[name="qt-pa-${first}"]`)?.focus();
      return;
    }

    const text = [
      'Hola, quiero prealertar un paquete:',
      `Casillero: ${data.locker.trim()}`,
      `Tienda: ${data.store.trim()}`,
      `Tracking: ${data.tracking.trim()}`,
      `Contenido: ${data.content.trim()}`,
      `Valor declarado: USD ${data.value.trim()}`,
      file ? `Adjunto la factura (${file.name}).` : 'Adjunto la factura de compra.',
    ].join('\n');
    window.open(whatsappLink(text), '_blank', 'noopener');
    setSent(true);
  };

  return (
    <form className="qt-prealert" onSubmit={submit} noValidate>
      <p className="qt-intro">
        Para identificar tu paquete necesitamos la factura de compra donde se vea el producto, el valor y el número de tracking.
      </p>

      <div className="qt-grid">
        <TextField label="Tu casillero" name="qt-pa-locker" className="qt-mono-field" placeholder="CNU-00000" autoComplete="off" value={data.locker} onChange={set('locker')} error={errors.locker} />
        <TextField label="Tienda" name="qt-pa-store" placeholder="Amazon" value={data.store} onChange={set('store')} error={errors.store} />
        <TextField
          label="Tracking de la tienda"
          name="qt-pa-tracking"
          className="qt-span-2 qt-mono-field"
          placeholder="1Z999AA10123456784"
          autoComplete="off"
          value={data.tracking}
          onChange={set('tracking')}
          error={errors.tracking}
        />
        <TextField label="¿Qué contiene?" name="qt-pa-content" className="qt-span-2" placeholder="Ej. 2 pares de tenis" value={data.content} onChange={set('content')} error={errors.content} />
        <TextField label="Valor declarado" name="qt-pa-value" inputMode="decimal" unit="USD" value={data.value} onChange={set('value')} error={errors.value} />

        <div className="field">
          <span className="field__label" id="qt-pa-file-label">
            Factura de compra
          </span>
          <label className="qt-file">
            <input
              type="file"
              accept=".pdf,image/*"
              aria-labelledby="qt-pa-file-label"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Icon name="file" size={18} />
            <span>{file ? file.name : 'Seleccionar archivo'}</span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn qt-btn-navy qt-btn-block">
        Enviar prealerta
      </button>

      <div aria-live="polite">
        {sent ? (
          <p className="qt-msg qt-msg--ok">
            <Icon name="check" size={18} />
            <span>Abrimos WhatsApp con tu prealerta. Envía allí también la factura de compra.</span>
          </p>
        ) : null}
      </div>

      <p className="qt-note">
        También puedes prealertar directamente en{' '}
        <a className="qt-link" href={links.prealert} target="_blank" rel="noopener noreferrer">
          tu casillero ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </p>
    </form>
  );
}
