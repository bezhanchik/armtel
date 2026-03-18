import { useState, useEffect } from 'react';
import './plan.css';
import Modal from '../components/UI/Modal';
import IcsForm from '../components/UI/IcsForm';

const Plan = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);  
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/ics/accounts');
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data = await res.json();
      
      if (data.success) {
        setAccounts(data.accounts);
      } else {
        setError('Не удалось загрузить список аккаунтов');
      }
    } catch (error) {
      console.error('Ошибка загрузки аккаунтов:', error);
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот аккаунт?')) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ics/accounts/${filename}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Аккаунт успешно удалён' });
        loadAccounts();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        alert('Ошибка при удалении аккаунта');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении аккаунта');
    }
  };

  const handleView = (account) => {
    alert(JSON.stringify(account, null, 2));
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    try {
      // Создаем JSON файл с данными формы
      const filename = `ics_account_${formData.number || 'new'}_${new Date().toISOString().slice(0,10)}.json`;
      downloadJsonFile(formData, filename);
      
      // Отправляем данные на сервер
      const res = await fetch('http://127.0.0.1:8000/api/ics/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Учётная запись создана! JSON файл сохранён' });
        setIsModalOpen(false);
        loadAccounts(); // Обновляем список после создания
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Ошибка при создании' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при создании' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadJsonFile = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="plan-container">
        <div className="loading">Загрузка аккаунтов...</div>
      </div>
    );
  }

  return (
    <div className="plan-container">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="📋 Создание учётной записи сервера ICS"
      >
        <IcsForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>

      <div className="plan-header">
        <h1 className="plan-title">Список ICS аккаунтов</h1>
        <div className="header-actions">
          <button 
            className="create-btn" 
            type="button" 
            onClick={openModal}
          >
            ➕ Создать аккаунт
          </button>
          <button className="refresh-btn" onClick={loadAccounts}>
            🔄 Обновить
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="empty-state">
          <p>Нет созданных аккаунтов</p>
          <p className="empty-hint">
            Создайте новый аккаунт, нажав кнопку "Создать аккаунт"
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Имя пользователя</th>
                <th>Приоритет</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.filename}>
                  <td className="cell-number">{account.data.number || '—'}</td>
                  <td className="cell-username">{account.data.username || '—'}</td>
                  <td className="cell-priority">{account.data.priority || '0'}</td>
                  <td className="cell-status">
                    <span className={`status-badge ${account.data.deactivated ? 'status-inactive' : 'status-active'}`}>
                      {account.data.deactivated ? 'Деактивирован' : 'Активен'}
                    </span>
                  </td>
                  <td className="cell-date">
                    {new Date(account.data.created_at || account.data.uploaded_at || Date.now()).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="cell-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleView(account.data)}
                      title="Просмотр"
                    >
                      Просмотреть
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(account.filename)}
                      title="Удалить"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Plan;