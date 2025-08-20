import clsx from "clsx";
import { createContext, useContext, useState } from "react";

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const showToast = (toast: Toast) => {
        const { message, type } = toast;

        setToast({ message, type });
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    const onTransitionEnd = () => {
        if (!visible) setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div
                    className={clsx(
                        'toast toast-end z-50 transition-all duration-300 ease-out',
                        visible ? 'opacity-100' : 'opacity-0'
                    )}
                    onTransitionEnd={onTransitionEnd}
                >
                    <div className={clsx('alert', {
                        'alert-success': toast.type === 'success',
                        'alert-error': toast.type === 'error',
                        'alert-info': toast.type === 'info',
                    })}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};