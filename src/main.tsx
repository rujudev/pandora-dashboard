import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { DialogProvider } from './context/Dialog.context.tsx'
import './index.css'
import { router } from './routes/config.tsx'

// Router configuration


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogProvider>
      <RouterProvider router={router} />
    </DialogProvider>
  </StrictMode>
)
