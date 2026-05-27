import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/teams" className="logo">
          만들어보조
        </Link>
        <nav className="nav">
          <Link to="/teams">팀 목록</Link>
          <Link to="/teams/new">팀 생성</Link>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;