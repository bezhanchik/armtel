import { useState } from 'react';
import { useIMask } from 'react-imask';
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

  // Маска для IP
  const { ref: ipRef } = useIMask({
    mask: '0[0[0]].0[0[0]].0[0[0]].0[0[0]].',
    blocks: {
      IP: {
        mask: Number,
        from: 0,
        to: 255,
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const ipValue = e.target.ipAddress.value;

    if (!ipValue || ipValue.trim() === '') {
      setMessage({ type: 'error', text: '❌ Введите IP-адрес' });
      return;
    }

    if (!isValidIPv4(ipValue)) {
      setMessage({ 
        type: 'error', 
        text: '❌ Неверный формат IP-адреса' 
      });
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Отправка на бэкенд:', { ip: ipValue });
      setMessage({ 
        type: 'success', 
        text: `✅ IP-адрес успешно обновлён: ${ipValue}` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: '❌ Ошибка при сохранении настроек' 
      });
    } finally {
      setLoading(false);
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
            defaultValue="18.20.0"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Версия Web:</label>
          <input 
            type="text" 
            className="form-input" 
            defaultValue="2.4.1"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Конфигурация IP:</label>
          <input 
            type="text" 
            name="ipAddress"
            className="form-input" 
            ref={ipRef}
            placeholder="000.000.000.000"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Изменить конфигурацию'}
        </button>
      </form>
    </div>
  );
};

export default Settings;