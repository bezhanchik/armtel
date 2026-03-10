import Nav from '../Nav/Nav';
import './Layout.css';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <Nav />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;