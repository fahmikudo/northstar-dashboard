import { BrowserRouter } from 'react-router-dom';
import { ToastViewport } from '@astryxdesign/core/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastViewport position="bottomEnd" maxVisible={3}>
            <AppRoutes />
          </ToastViewport>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
