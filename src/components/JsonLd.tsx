type Props = {
  data: object | object[];
};

const LESS_THAN = "\\u003c";

/**
 * Structured data is emitted as one script per page. JSON.stringify does not escape
 * the less-than sign, so we do it by hand and make closing the script tag from
 * inside a string value impossible.
 *
 * LESS_THAN has to carry an escaped backslash: written with a single one it is the
 * character "<" all over again, and the replace turns into a no-op.
 */
export function JsonLd({ data }: Props) {
  const payload = JSON.stringify(data).replaceAll("<", LESS_THAN);

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: payload }} />
  );
}
