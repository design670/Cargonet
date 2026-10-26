/**
 * Título en dos tonos: primera parte ligera, segunda en negrita y palabra
 * destacada en cursiva. El estilo solo se activa en tablet/desktop (≥700px);
 * en móvil se lee como el título original de una sola pieza.
 */
export function TwoToneTitle({ light, bold, accent }: { light: string; bold: string; accent: string }) {
  return (
    <>
      <span className="tt-light">{light}</span>{' '}
      <span className="tt-strong">
        {bold} <em className="tt-accent">{accent}</em>
      </span>
    </>
  );
}
