import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { DialogProvider } from './context/dialog.context.tsx'
import { HeaderPageProvider } from './context/header-page.context.tsx'
import { ToastProvider } from './context/toast.context.tsx'
import './index.css'
import { router } from './routes/config.tsx'

// Router configuration

// TODO: agregar strict mode cuando vaya a producción
createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <DialogProvider>
      <HeaderPageProvider>
        <RouterProvider router={router} />
      </HeaderPageProvider>
    </DialogProvider>
  </ToastProvider>
)
