export default function Header() {
  return (
    <header className="topbar">
      <div className="brand">ElevenLabs</div>
      <nav className="auth">
        <button className="link">Log in</button>
        <button className="btn primary">Sign up</button>
      </nav>
    </header>
  );
}
