import { useEffect, useState } from 'react';
import './Settings.css';

const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

const isValidIPv4 = (ip) => {
  if (!ipv4Regex.test(ip)) return false;
  const octets = ip.split('.');
  return octets.every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
};

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  

  const [settings, setSettings] = useState({
    asteriskVersion: 'Загрузка данных...',
    webVersion: 'Загрузка данных...',
    ipConfig: 'Загрузка данных...',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/settings');
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setSettings({
          asteriskVersion: data.asteriskVersion,
          webVersion: data.webVersion,
          ipConfig: data.ipConfig
        });
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
        setMessage({ type: 'error', text: 'Не удалось загрузить данные с сервера' });
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawValue = e.target.ipAddress.value;
    
    const ipValuetoValidate = rawValue
      .replace(/[^0-9.]/g, '')      
      .replace(/\.{2,}/g, '.')      
      .replace(/\.$/, '')           
      .trim();

    console.log('🔍 Submit:', { raw: rawValue, clean: ipValuetoValidate });

    if (!ipValuetoValidate) {
      setMessage({ type: 'error', text: 'Введите IP-адрес' });
      return;
    }

    if (!isValidIPv4(ipValuetoValidate)) {
      setMessage({ type: 'error', text: 'Неверный формат IP-адреса' });
      return;
    }
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: ipValuetoValidate })  
      });
      
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setMessage({ type: 'success', text: `${data.message}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при сохранении' });
      console.error(error);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">Настройка системы</h1>
      
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Версия Armtelics:</label>
          <input 
            type="text" 
            className="form-input" 
            value={settings.asteriskVersion}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Версия Web:</label>
          <input 
            type="text" 
            className="form-input" 
            value={settings.webVersion}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Конфигурация IP:</label>
          <input 
            type="text" 
            name="ipAddress"
            className="form-input" 
            placeholder="192.168.1.100"
            defaultValue={settings.ipConfig}
            inputMode="numeric"
            pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
            title="Введите IP в формате 192.168.1.1"
            key={settings.ipConfig}
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="button-group">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Изменить конфигурацию'}
          </button>
          
        </div>
      </form>

    </div>
  );
};

export default Settings;