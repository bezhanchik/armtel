import './Header.css';

const Header = () => {
  return (
    <header className="header">

      <nav className="header-nav">
        <a href="/" className="header-link">Главная</a>
        <a href="/help" className="header-link">Помощь</a>
        <a href="/support" className="header-link">Поддержка</a>
      </nav>

      <div className="header-right">
        {/* Переключатель языка */}
        <select className="lang-selector">
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>

        {/* Аватар пользователя */}
        <div className="user-avatar">
          <img 
            src="https://ui-avatars.com/api/?name=User&background=fff&color=F25511" 
            alt="User" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;