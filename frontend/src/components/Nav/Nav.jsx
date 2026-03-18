import { NavLink } from 'react-router-dom';
import './Nav.css';
import logo from '../../../public/armtel.png'

const menuItems = [
  { path: '/monitoring', label: 'Мониторинг' },
  { path: '/inventory', label: 'Инвентаризация' },
  { path: '/settings', label: 'Настройка' },
  { path: '/reports', label: 'Отчёты' },
  { path: '/admin', label: 'Администрирование' },
  { path: '/plan', label: 'План нумерации' },
];

function Nav() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img 
          src={logo} 
          alt="armtel-logo" 
        />
      </div>

      <nav className="nav-class">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Nav;