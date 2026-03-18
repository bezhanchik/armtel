import { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      modal.close();
      document.body.style.overflow = '';
    }

    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ← НОВОЕ: Слушаем событие close (срабатывает при Esc, клике вне, close())
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();  // ← Синхронизируем стейт с реальным состоянием диалога
    };

    modal.addEventListener('close', handleClose);
    return () => modal.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <dialog 
      ref={modalRef} 
      className="modal" 
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;