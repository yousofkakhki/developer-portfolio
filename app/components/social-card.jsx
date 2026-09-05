const palette = {
  paper: '#f4f1e8',
  chalk: '#fbfaf6',
  carbon: '#17201e',
  graphite: '#47504d',
  petrol: '#1f5c58',
  copper: '#ad4e30',
  rule: '#c8c4b8',
};

export function safeTitleSize(title = '', locale = 'en') {
  const length = Array.from(title).length;
  const base = locale === 'fa' ? 58 : 64;
  if (length > 100) return base - 16;
  if (length > 72) return base - 10;
  if (length > 48) return base - 5;
  return base;
}

export default function SocialCard({
  locale = 'en',
  eyebrow,
  title,
  description,
  kind = 'Portfolio',
}) {
  const isPersian = locale === 'fa';
  const dir = isPersian ? 'rtl' : 'ltr';
  const titleSize = safeTitleSize(title, locale);
  const name = isPersian ? 'یوسف کاخکی' : 'Yousef Kakhki';
  const role = isPersian ? 'معمار راهکار و رهبر مهندسی' : 'Solutions Architect & Engineering Lead';

  return (
    <div
      dir={dir}
      lang={locale}
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        padding: '62px 72px 54px',
        color: palette.carbon,
        backgroundColor: palette.paper,
        backgroundImage: `linear-gradient(90deg, rgba(31,92,88,.06) 1px, transparent 1px), linear-gradient(rgba(31,92,88,.06) 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        fontFamily: isPersian ? 'Vazirmatn, DejaVu Sans, sans-serif' : 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', position: 'absolute', inset: '0 auto 0 0', width: '18px', backgroundColor: palette.petrol }} />
      <div style={{ display: 'flex', position: 'absolute', inset: '0 0 auto 0', height: '9px', backgroundColor: palette.copper }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', width: '46px', height: '46px', alignItems: 'center', justifyContent: 'center', color: palette.chalk, backgroundColor: palette.carbon, fontSize: '18px', fontWeight: 700 }}>YK</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '22px', fontWeight: 700 }}>{name}</span>
            <span style={{ marginTop: '4px', color: palette.graphite, fontSize: '17px' }}>{role}</span>
          </div>
        </div>
        <span style={{ color: palette.petrol, fontSize: '18px', fontWeight: 700, letterSpacing: isPersian ? '0' : '0.08em', textTransform: isPersian ? 'none' : 'uppercase' }}>{kind}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1020px', marginTop: '24px' }}>
        {eyebrow && (
          <span style={{ color: palette.copper, fontSize: '20px', fontWeight: 700, marginBottom: '18px' }}>{eyebrow}</span>
        )}
        <div style={{ display: 'flex', fontSize: `${titleSize}px`, lineHeight: isPersian ? 1.35 : 1.08, fontWeight: 750, letterSpacing: isPersian ? '0' : '-0.035em' }}>
          {title}
        </div>
        {description && (
          <div style={{ display: 'flex', maxWidth: '930px', marginTop: '24px', color: palette.graphite, fontSize: '22px', lineHeight: 1.45 }}>
            {description}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px solid ${palette.rule}`, paddingTop: '22px', color: palette.graphite, fontSize: '18px' }}>
        <span>kakhki.me</span>
        <span style={{ color: palette.petrol, fontWeight: 700 }}>{isPersian ? 'شواهد، معماری، اجرا' : 'Evidence · Architecture · Delivery'}</span>
      </div>
    </div>
  );
}
