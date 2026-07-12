import Modal from './Modal';
import Button from './Button';
import { HiExclamation } from 'react-icons/hi';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
        <HiExclamation className="text-red-600 dark:text-red-400" size={24} />
      </div>
      <div>
        <p className="text-sm text-secondary leading-relaxed">{message}</p>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
