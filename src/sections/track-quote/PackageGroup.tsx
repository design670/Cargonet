import { TextField } from '../../components/Field';
import { Icon } from '../../components/Icon';
import type { DimUnit, PackageInput, WeightUnit } from '../../lib/quote-engine';

type Props = {
  index: number;
  value: PackageInput;
  weightUnit: WeightUnit;
  dimUnit: DimUnit;
  dimensionsRequired: boolean;
  errors: Partial<Record<keyof PackageInput, string>>;
  canRemove: boolean;
  onChange: (field: keyof PackageInput, v: string) => void;
  onRemove: () => void;
};

/** Grupo de paquete: cantidad, peso por caja, dimensiones y valor declarado. */
export function PackageGroup({ index, value, weightUnit, dimUnit, dimensionsRequired, errors, canRemove, onChange, onRemove }: Props) {
  const key = (f: keyof PackageInput) => `pkg-${index}-${f}`;
  const n = index + 1;
  const dimError = errors.length ?? errors.width ?? errors.height;

  return (
    <fieldset className="tq-pkg">
      <legend className="tq-pkg__title">Paquete {n}</legend>
      {canRemove ? (
        <button type="button" className="tq-pkg__remove" onClick={onRemove}>
          <Icon name="close" size={16} />
          <span>Eliminar</span>
          <span className="sr-only"> paquete {n}</span>
        </button>
      ) : null}

      <div className="tq-pkg__grid">
        <TextField
          data-field={key('qty')}
          name={key('qty')}
          label="Cantidad de cajas"
          inputMode="numeric"
          value={value.qty}
          onChange={(e) => onChange('qty', e.target.value)}
          error={errors.qty}
          className="tq-pkg__qty"
        />
        <TextField
          data-field={key('weight')}
          name={key('weight')}
          label="Peso por caja"
          inputMode="decimal"
          unit={weightUnit}
          value={value.weight}
          onChange={(e) => onChange('weight', e.target.value)}
          error={errors.weight}
          className="tq-pkg__weight"
        />

        <fieldset className="tq-dims">
          <legend className="field__label">
            Dimensiones por caja ({dimUnit === 'in' ? 'pulgadas' : 'cm'})
            {dimensionsRequired ? null : <span className="field__optional"> (opcional)</span>}
          </legend>
          <div className="tq-dims__row">
            {(['length', 'width', 'height'] as const).map((f, i) => (
              <div key={f} className="tq-dims__cell">
                {i > 0 ? (
                  <span className="tq-dims__x" aria-hidden="true">
                    ×
                  </span>
                ) : null}
                <TextField
                  data-field={key(f)}
                  name={key(f)}
                  label={f === 'length' ? 'Largo' : f === 'width' ? 'Ancho' : 'Alto'}
                  inputMode="decimal"
                  unit={dimUnit}
                  value={value[f]}
                  onChange={(e) => onChange(f, e.target.value)}
                  aria-invalid={errors[f] ? true : undefined}
                />
              </div>
            ))}
          </div>
          {dimError ? <p className="field__error">{dimError}</p> : null}
        </fieldset>

        <TextField
          data-field={key('value')}
          name={key('value')}
          label="Valor de la mercancía por caja"
          inputMode="decimal"
          unit="USD"
          value={value.value}
          onChange={(e) => onChange('value', e.target.value)}
          error={errors.value}
          className="tq-pkg__value"
        />
      </div>
    </fieldset>
  );
}
