import { Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState } from 'react';

type SnackBarState = {
  open: boolean;
  message: string;
};

const adminSnackbarContext = createContext<{
  snackbar: (message: string) => void;
}>({
  snackbar: () => {},
});

export const useAdminSnackbar = () => {
  return useContext(adminSnackbarContext);
};

export const AdminSnackbarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState<SnackBarState>({
    open: false,
    message: '',
  });

  const setMessage = useCallback((message: string) => {
    setSnackbarState({ open: true, message });
  }, []);

  return (
    <adminSnackbarContext.Provider value={{ snackbar: setMessage }}>
      {children}
      <Snackbar
        className="test"
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState({ open: false, message: '' })}
        message={snackbarState.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </adminSnackbarContext.Provider>
  );
};
