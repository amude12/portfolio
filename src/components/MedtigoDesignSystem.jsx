// Medtigo design system, rebuilt as live components. Values are approximated from the supplied
// screens (colours sampled from the screenshots; typography is Poppins throughout).
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const panel = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease } }),
};
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.15 } };

const COLORS = [
  {
    group: 'Brand',
    items: [
      { name: 'Sidebar', hex: '#1A3C87', use: 'Navigation background' },
      { name: 'Primary', hex: '#1F4FA3', use: 'Buttons, links, active states' },
      { name: 'Info', hex: '#1F5BB5', use: 'Upcoming, informational' },
    ],
  },
  {
    group: 'Neutral',
    items: [
      { name: 'Ink', hex: '#111827', use: 'Titles, key numbers' },
      { name: 'Body', hex: '#6B7280', use: 'Labels, supporting text' },
      { name: 'Border', hex: '#E5E9F0', use: 'Cards, tables, inputs' },
      { name: 'Canvas', hex: '#F4F6FA', use: 'Page background' },
      { name: 'Surface', hex: '#FFFFFF', use: 'Cards, panels' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'Success', hex: '#2E7D3E', tint: '#E4F5EB', use: 'On track, active, paid' },
      { name: 'Warning', hex: '#B7691A', tint: '#FDF1DA', use: 'At risk, pending, medium' },
      { name: 'Danger', hex: '#C0392B', tint: '#FAE8E9', use: 'Expired, critical, high' },
    ],
  },
];

const TYPE = [
  { role: 'Page title', size: 20, weight: 600, sample: 'Your Activity Dashboard' },
  { role: 'Key number', size: 24, weight: 600, sample: '1,650' },
  { role: 'Card title', size: 16, weight: 600, sample: 'Credentials to renew' },
  { role: 'Body', size: 14, weight: 400, sample: 'Credential health across 20,000 providers' },
  { role: 'Label', size: 12, weight: 500, sample: 'Expired credentials' },
  { role: 'Caption', size: 11, weight: 400, sample: 'Expire within 90 days' },
];

const TAGS = [
  { group: 'Status', items: [['Active', 'success'], ['Inactive', 'danger'], ['On Track', 'success'], ['At Risk', 'warning'], ['Expired', 'danger']] },
  { group: 'Priority', items: [['Critical', 'danger'], ['High', 'danger'], ['Medium', 'warning'], ['Low', 'success']] },
  { group: 'Progress & billing', items: [['Upcoming', 'info'], ['Pending', 'warning'], ['Paid', 'success']] },
];

function Panel({ title, note, i, className = '', children }) {
  return (
    <motion.section className={`mds-panel ${className}`} variants={panel} custom={i} {...inView}>
      <header className="mds-panel__head">
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </header>
      {children}
    </motion.section>
  );
}

const Tag = ({ label, tone }) => <span className={`mds-tag mds-tag--${tone}`}>{label}</span>;

export default function MedtigoDesignSystem() {
  return (
    <div className="mds">
      {/* ── Foundations ── */}
      <Panel title="Colour" note="Status colours pair a strong text tone with a light tint." i={0} className="mds-span">
        <div className="mds-colors">
          {COLORS.map((g) => (
            <div key={g.group} className="mds-colors__group">
              <p className="mds-eyebrow">{g.group}</p>
              <div className="mds-swatches">
                {g.items.map((c) => (
                  <div key={c.name} className="mds-swatch">
                    <div className="mds-swatch__chip" style={{ background: c.hex }}>
                      {c.tint && <span style={{ background: c.tint }} aria-hidden="true" />}
                    </div>
                    <strong>{c.name}</strong>
                    <code>{c.hex}{c.tint ? ` / ${c.tint}` : ''}</code>
                    <small>{c.use}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Typography" note="Poppins in three weights: Regular 400, Medium 500, SemiBold 600." i={1}>
        <div className="mds-type">
          <div className="mds-type__specimen" aria-hidden="true">
            <span>Aa</span>
            <small>Poppins</small>
          </div>
          <ul className="mds-type__scale">
            {TYPE.map((t) => (
              <li key={t.role}>
                <span className="mds-type__meta">{t.role}<em>{t.size} / {t.weight}</em></span>
                <span className="mds-type__sample" style={{ fontSize: t.size, fontWeight: t.weight }}>{t.sample}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="Spacing, radius & elevation" note="A 4-point spacing scale; flat cards separated by borders, not heavy shadows." i={2}>
        <div className="mds-space">
          {[4, 8, 12, 16, 24, 32].map((s) => (
            <div key={s} className="mds-space__row">
              <code>{s}</code>
              <span className="mds-space__bar" style={{ width: s * 4 }} />
            </div>
          ))}
        </div>
        <div className="mds-shapes">
          {[['Tag', 4], ['Button', 6], ['Card', 8]].map(([n, r]) => (
            <div key={n} className="mds-shape">
              <span style={{ borderRadius: r }} />
              <small>{n} · {r}px</small>
            </div>
          ))}
          <div className="mds-shape">
            <span className="mds-shape--raised" />
            <small>Card · border + soft shadow</small>
          </div>
        </div>
      </Panel>

      {/* ── Components ── */}
      <Panel title="Actions & controls" note="One filled action per area; secondary actions in outline; navigation as text links." i={0}>
        <div>
          <p className="mds-eyebrow">Buttons & links</p>
          <div className="mds-row">
            <span className="mds-btn mds-btn--primary">Order Service +</span>
            <span className="mds-btn mds-btn--outline">View Details</span>
            <span className="mds-btn mds-btn--outline mds-btn--sm">Start Renewal</span>
            <span className="mds-link">View all →</span>
          </div>
        </div>
        <div>
          <p className="mds-eyebrow">Inputs</p>
          <div className="mds-controls">
            <span className="mds-input"><SearchIcon />Search by report name</span>
            <span className="mds-select">Regulatory Certificates<span aria-hidden="true">▾</span></span>
          </div>
        </div>
        <div>
          <p className="mds-eyebrow">Toggle & pagination</p>
          <div className="mds-controls">
            <span className="mds-toggle"><span className="mds-toggle__track" />Admin View</span>
            <span className="mds-pagination" aria-hidden="true">
              <span>‹</span><span className="is-active">1</span><span>2</span><span>3</span><span>›</span>
            </span>
          </div>
        </div>
      </Panel>

      <Panel title="Status tags" note="Colour always comes with a word, so status never relies on colour alone." i={1}>
        <div className="mds-tags">
          {TAGS.map((g) => (
            <div key={g.group}>
              <p className="mds-eyebrow">{g.group}</p>
              <div className="mds-row mds-row--tight">{g.items.map(([l, t]) => <Tag key={l} label={l} tone={t} />)}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Navigation" note="Sidebar with one clear active item; the same structure in both views." i={0}>
        <div className="mds-nav">
          <span className="mds-nav__brand">✚ medtigo</span>
          {['Dashboard', 'Providers', 'Monitoring', 'Acquisition'].map((n, i) => (
            <span key={n} className={`mds-nav__item${i === 0 ? ' is-active' : ''}`}><span className="mds-nav__icon" />{n}</span>
          ))}
        </div>
      </Panel>

      <Panel title="Data display" note="Numbers lead, detail follows: KPI card, health bar and a table row with its action." i={1}>
        <div className="mds-data">
          <div className="mds-kpi">
            <span className="mds-kpi__label"><i className="mds-dot mds-dot--danger" />Expired credentials</span>
            <strong>1,650</strong>
            <small>Across 4 credential types</small>
            <span className="mds-link mds-link--sm">Review →</span>
          </div>
          <div className="mds-health">
            <div className="mds-health__head"><strong>Provider Card</strong><small>20,000 total</small></div>
            <div className="mds-health__bar" aria-hidden="true"><span style={{ width: '2.5%', background: '#C0392B' }} /><span style={{ width: '5.5%', background: '#B7691A' }} /><span style={{ width: '92%', background: '#2E7D3E' }} /></div>
            <div className="mds-health__legend"><span><i className="mds-dot mds-dot--danger" />450 expired</span><span><i className="mds-dot mds-dot--warning" />1,100 at risk</span><span><i className="mds-dot mds-dot--success" />18,450 on track</span></div>
          </div>
          <div className="mds-table" role="table" aria-label="Example table row">
            <div className="mds-table__row mds-table__row--head" role="row"><span>Credential</span><span>State</span><span>Priority</span><span>Action</span></div>
            <div className="mds-table__row" role="row"><span>State License</span><span>Arizona</span><span><Tag label="High" tone="danger" /></span><span><span className="mds-btn mds-btn--outline mds-btn--sm">Start Renewal</span></span></div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
