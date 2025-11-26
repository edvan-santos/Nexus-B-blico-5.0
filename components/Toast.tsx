
import React, { useEffect } from 'react';
import { Notification, NotificationType } from '../types';

interface ToastProps {
  notification: Notification | null;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;
  
  const baseClasses = "fixed bottom-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg border-l-4 z-50 text-white";
  const typeClasses = {
      [NotificationType.SUCCESS]: "bg-green-600/80 border-green-400",
      [NotificationType.ERROR]: "bg-red-600/80 border-red-400",
      [NotificationType.INFO]: "bg-blue-600/80 border-blue-400",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]} backdrop-blur-sm`}>
      <p className="font-semibold whitespace-pre-wrap">{notification.message}</p>
    </div>
  );
};

export default Toast;
