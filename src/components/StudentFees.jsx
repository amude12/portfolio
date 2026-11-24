// Student Management: fee payment journey and fee screens. Built from the app structure
// (Fees → Due date / payment history → Due, Overdue, Discounted, Paid, Partially Paid)
// in the app's own visual style. Amounts are sample data.
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const rise = (i = 0) => ({ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.07, ease } } });
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } };

/* ───────────── User flow ───────────── */

const FLOW = [
  {
    title: 'Find what is due',
    steps: [{ t: 'Open Fees', s: 'Left navigation or Home' }, { t: 'Payment history', s: 'Due dates by month' }, { t: 'Filter by status', s: 'Due · Overdue · Partially paid · Paid' }],
  },
  {
    title: 'Review and pay',
    steps: [{ t: 'Select a fee', s: 'Tuition, transport, hostel' }, { t: 'Fee details', s: 'Breakdown, discount, due date' }, { t: 'Pay full or part?', s: 'Choose the amount', decision: true }, { t: 'Payment method', s: 'UPI · Card · Net banking' }],
  },
  {
    title: 'Confirm and keep a record',
    steps: [{ t: 'Confirm payment', s: 'Amount and method summary' }, { t: 'Payment successful?', s: 'No: retry or change method', decision: true }, { t: 'Payment receipt', s: 'Download or share' }, { t: 'Status updated', s: 'Paid or Partially paid' }],
  },
];

export function FeeFlow() {
  return (
    <motion.div className="sf-flow" {...inView} role="img" aria-label="Fee payment user flow: find what is due, review and pay, confirm and keep a receipt">
      {FLOW.map((row, r) => (
        <motion.div key={row.title} className="sf-flow__row" variants={rise(r)}>
          <p className="sf-flow__stage"><span>{String(r + 1).padStart(2, '0')}</span>{row.title}</p>
          <div className="sf-flow__steps">
            {row.steps.map((st, i) => (
              <div key={st.t} className="sf-flow__cell">
                <div className={`sf-step${st.decision ? ' sf-step--decision' : ''}`}>
                  <strong>{st.decision && <span aria-hidden="true">◇ </span>}{st.t}</strong>
                  <small>{st.s}</small>
                </div>
                {i < row.steps.length - 1 && <span className="sf-arrow" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      <motion.div className="sf-flow__legend" variants={rise(3)}>
        <span><i className="sf-key" />Step</span>
        <span><i className="sf-key sf-key--decision" />Decision</span>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Screens ───────────── */

const Status = ({ s }) => <span className={`sf-tag sf-tag--${s.toLowerCase().replace(/\s+/g, '-')}`}>{s}</span>;

function Phone({ title, children, i }) {
  return (
    <motion.div className="sf-phone" variants={rise(i)}>
      <div className="sf-phone__screen">
        <span className="sf-phone__notch" aria-hidden="true" />
        <div className="sf-app-bar"><span aria-hidden="true">←</span>{title}</div>
        <div className="sf-app">{children}</div>
      </div>
    </motion.div>
  );
}

function FeesList() {
  const rows = [
    ['Term 3 tuition fee', 'Due 10 Dec 2022', '₹12,500', 'Due'],
    ['Transport · Route 4', 'Due 05 Nov 2022', '₹3,200', 'Overdue'],
    ['Hostel fee', 'Paid ₹4,000 of ₹8,000', '₹4,000', 'Partially paid'],
    ['Term 2 tuition fee', 'Paid 08 Sep 2022', '₹12,500', 'Paid'],
    ['Sports kit', 'Sibling discount 10%', '₹1,350', 'Discounted'],
  ];
  return (
    <>
      <div className="sf-summary">
        <small>Total due</small>
        <strong>₹19,700</strong>
        <span>Next due date · 10 Dec 2022</span>
      </div>
      <div className="sf-tabs" aria-hidden="true"><span className="is-active">All</span><span>Due</span><span>Overdue</span><span>Paid</span></div>
      <ul className="sf-list">
        {rows.map(([t, s, a, st]) => (
          <li key={t}>
            <div><strong>{t}</strong><small>{s}</small></div>
            <div className="sf-list__end"><b>{a}</b><Status s={st} /></div>
          </li>
        ))}
      </ul>
    </>
  );
}

function FeeDetails() {
  return (
    <>
      <div className="sf-card">
        <div className="sf-card__head"><strong>Term 3 tuition fee</strong><Status s="Due" /></div>
        <small className="sf-muted">Karuna Shinde · Class 10th A · Due 10 Dec 2022</small>
        <dl className="sf-lines">
          <div><dt>Tuition</dt><dd>₹11,000</dd></div>
          <div><dt>Lab and library</dt><dd>₹2,000</dd></div>
          <div><dt>Merit discount</dt><dd className="sf-green">− ₹500</dd></div>
          <div className="sf-lines__total"><dt>Total</dt><dd>₹12,500</dd></div>
        </dl>
      </div>
      <p className="sf-label">Amount</p>
      <div className="sf-options">
        <span className="sf-option is-active"><i />Full · ₹12,500</span>
        <span className="sf-option"><i />Part payment</span>
      </div>
      <p className="sf-label">Pay with</p>
      <div className="sf-methods">
        <span className="is-active">UPI</span><span>Card</span><span>Net banking</span>
      </div>
      <span className="sf-btn">Pay ₹12,500</span>
    </>
  );
}

function Receipt() {
  return (
    <>
      <div className="sf-success">
        <span className="sf-success__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <strong>Payment successful</strong>
        <b>₹12,500</b>
      </div>
      <dl className="sf-card sf-lines sf-lines--receipt">
        <div><dt>Receipt no.</dt><dd>RCPT-2022-1184</dd></div>
        <div><dt>Fee</dt><dd>Term 3 tuition</dd></div>
        <div><dt>Paid on</dt><dd>02 Dec 2022, 11:42 AM</dd></div>
        <div><dt>Method</dt><dd>UPI</dd></div>
        <div><dt>Status</dt><dd><Status s="Paid" /></dd></div>
      </dl>
      <span className="sf-btn">Download receipt</span>
      <span className="sf-btn sf-btn--ghost">Share</span>
    </>
  );
}

export function FeeScreens() {
  return (
    <div className="sf-screens-wrap">
      <motion.div className="sf-screens" {...inView}>
        <span className="sf-bracket" aria-hidden="true"><span>Fee Payment</span></span>
        <Phone title="Fees" i={0}><FeesList /></Phone>
        <Phone title="Fee Details" i={1}><FeeDetails /></Phone>
        <Phone title="Payment Receipt" i={2}><Receipt /></Phone>
      </motion.div>
    </div>
  );
}
