import Nav from '../Nav/Nav';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Nav />
      <main className="main-content">
        {children}
        {/* <div className="container">
            
        </div> */}
      </main>
    </div>
  );
};

export default Layout;