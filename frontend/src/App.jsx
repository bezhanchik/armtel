import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Settings from './pages/Settings.jsx';
import Plan from './pages/Plan.jsx';

// Заглушки страниц
const Monitoring = () => (
  <div>
    <h1>📊 Мониторинг</h1>
    <p>Здесь будет основной контент мониторинга</p>
  </div>
);

const Inventory = () => (
  <div>
    <h1>📦 Инвентаризация</h1>
    <p>Здесь будет контент инвентаризации</p>
  </div>
);


const Reports = () => (
  <div>
    <h1>📈 Отчёты</h1>
    <p>Здесь будут отчёты</p>
  </div>
);

const Admin = () => (
  <div>
    <h1>🔧 Администрирование</h1>
    <p>Панель администратора</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/monitoring" replace />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </Layout>
  );
}

export default App;