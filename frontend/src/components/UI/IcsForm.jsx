import { useState } from 'react';
import './icsform.css';

const IcsForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    number: '',
    username: '',
    password: '',
    staticAddress: false,
    aclAddress: false,
    address1: '',
    address2: '',
    priority: '0',
    priorityHandling: 'disconnect',
    checkAvailability: true,
    checkFrequency: '60',
    sendRLF: true,
    customRLF: false,
    noiseSuppression: false,
    videoSupport: false,
    registerCalls: false,
    deactivated: false,
    proxy: false,
    selectedCodecs: ['alaw'],
    availableCodecs: ['speex', 'speex16', 'slaw', 'siren7', 'siren14', 'alawdct'],
    selectedFragments: [],
    availableFragments: ['CHIMEshort', 'CHIME'],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Обработчик для множественного выбора в select
  const handleMultiSelectChange = (e, listType) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    // Здесь вы можете обрабатывать выбор, если нужно
    // Например, сохранять выбранные элементы в состоянии
    console.log('Выбрано:', selectedOptions);
  };

  // Перемещение элементов между списками
  const moveItems = (from, to, items) => {
    const fromList = from === 'codecs' ? formData.availableCodecs : formData.availableFragments;
    const toList = to === 'codecs' ? formData.selectedCodecs : formData.selectedFragments;
    
    const itemsToMove = items.filter(item => fromList.includes(item));
    const newFromList = fromList.filter(item => !itemsToMove.includes(item));
    const newToList = [...toList, ...itemsToMove];
    
    if (to === 'codecs') {
      setFormData(prev => ({
        ...prev,
        selectedCodecs: newToList,
        availableCodecs: newFromList
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedFragments: newToList,
        availableFragments: newFromList
      }));
    }
  };

  const moveAll = (from, to) => {
    const fromList = from === 'codecs' ? formData.availableCodecs : formData.availableFragments;
    const toList = to === 'codecs' ? formData.selectedCodecs : formData.selectedFragments;
    
    if (to === 'codecs') {
      setFormData(prev => ({
        ...prev,
        selectedCodecs: [...toList, ...fromList],
        availableCodecs: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedFragments: [...toList, ...fromList],
        availableFragments: []
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="ics-form">
      
      {/* Верхняя секция */}
      <div className="form-section-top">
        <div className="form-row">
          <label className="form-label">Номер</label>
          <input
            type="text"
            name="number"
            className="form-input"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Имя пользователя</label>
          <input
            type="text"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Статический адрес</label>
          <input
            type="checkbox"
            name="staticAddress"
            checked={formData.staticAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">ACL адрес</label>
          <input
            type="checkbox"
            name="aclAddress"
            checked={formData.aclAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label"></label>
          <input
            type="text"
            name="address1"
            className="form-input form-input-disabled"
            value={formData.address1}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="form-row">
          <label className="form-label"></label>
          <input
            type="text"
            name="address2"
            className="form-input form-input-disabled"
            value={formData.address2}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>

      {/* Кодеки */}
      <div className="form-section">
        <div className="dual-list-container">
          <div className="dual-list">
            <div className="dual-list-header">
              <span>Кодеки</span>
              <span>Выбранные</span>
            </div>
            <select 
              multiple 
              className="dual-list-box"
              value={formData.selectedCodecs}
              onChange={(e) => handleMultiSelectChange(e, 'selectedCodecs')}
            >
              {formData.selectedCodecs.map(codec => (
                <option key={codec} value={codec}>{codec}</option>
              ))}
            </select>
          </div>

          <div className="dual-list-buttons">
            <button 
              type="button" 
              className="btn-transfer"
              onClick={() => moveItems('codecs', 'codecs', formData.availableCodecs)}
            >
              &lt;&lt;
            </button>
            <button 
              type="button" 
              className="btn-transfer"
              onClick={() => moveItems('codecs', 'codecs', formData.selectedCodecs)}
            >
              &gt;&gt;
            </button>
          </div>

          <div className="dual-list">
            <div className="dual-list-header">
              <span>Доступен</span>
            </div>
            <select 
              multiple 
              className="dual-list-box"
              value={formData.availableCodecs}
              onChange={(e) => handleMultiSelectChange(e, 'availableCodecs')}
            >
              {formData.availableCodecs.map(codec => (
                <option key={codec} value={codec}>{codec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Настройки */}
      <div className="form-section-settings">
        <div className="form-row">
          <label className="form-label">Приоритет</label>
          <input
            type="text"
            name="priority"
            className="form-input"
            value={formData.priority}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Обработка приоритетов</label>
          <select
            name="priorityHandling"
            className="form-select"
            value={formData.priorityHandling}
            onChange={handleChange}
          >
            <option value="disconnect">Разрыв соединения</option>
            <option value="queue">Очередь</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Проверить доступность</label>
          <input
            type="checkbox"
            name="checkAvailability"
            checked={formData.checkAvailability}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Частота проверки</label>
          <input
            type="text"
            name="checkFrequency"
            className="form-input"
            value={formData.checkFrequency}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Отправлять RLF</label>
          <input
            type="checkbox"
            name="sendRLF"
            checked={formData.sendRLF}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Пользовательский RLF</label>
          <input
            type="checkbox"
            name="customRLF"
            checked={formData.customRLF}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Шумоподавление</label>
          <input
            type="checkbox"
            name="noiseSuppression"
            checked={formData.noiseSuppression}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Поддержка видео</label>
          <input
            type="checkbox"
            name="videoSupport"
            checked={formData.videoSupport}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Регистрировать переговоры</label>
          <input
            type="checkbox"
            name="registerCalls"
            checked={formData.registerCalls}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Деактивировано</label>
          <input
            type="checkbox"
            name="deactivated"
            checked={formData.deactivated}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Прокси</label>
          <input
            type="checkbox"
            name="proxy"
            checked={formData.proxy}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Фрагменты */}
      <div className="form-section">
        <div className="dual-list-container">
          <div className="dual-list">
            <div className="dual-list-header">
              <span>Фрагменты</span>
              <span>Выбранные</span>
            </div>
            <select 
              multiple 
              className="dual-list-box"
              value={formData.selectedFragments}
              onChange={(e) => handleMultiSelectChange(e, 'selectedFragments')}
            >
              {formData.selectedFragments.map(fragment => (
                <option key={fragment} value={fragment}>{fragment}</option>
              ))}
            </select>
          </div>

          <div className="dual-list-buttons">
            <button 
              type="button" 
              className="btn-transfer"
              onClick={() => moveAll('fragments', 'fragments')}
            >
              &lt;&lt;
            </button>
            <button 
              type="button" 
              className="btn-transfer"
              onClick={() => moveAll('fragments', 'fragments')}
            >
              &gt;&gt;
            </button>
          </div>

          <div className="dual-list">
            <div className="dual-list-header">
              <span>Доступен</span>
            </div>
            <select 
              multiple 
              className="dual-list-box"
              value={formData.availableFragments}
              onChange={(e) => handleMultiSelectChange(e, 'availableFragments')}
            >
              {formData.availableFragments.map(fragment => (
                <option key={fragment} value={fragment}>{fragment}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default IcsForm;