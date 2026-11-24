import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <h1>404</h1>
        <p style={{ color: 'var(--body)', margin: '8px 0 24px' }}>This page doesn’t exist.</p>
        <Link to="/" className="arrow-link arrow-link--lg">Back to home <span className="arr">→</span></Link>
      </div>
    </div>
  );
}
