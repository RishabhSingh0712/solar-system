import React, { createContext, useContext, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress } from '@mui/material';

// Context
const DialogContext = createContext();

// Provider Component
export const DialogProvider = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    type: '', // 'loading' or 'message'
    title: '',
    message: '',
    actions: null,
  });

  const showDialog = ({ type, title, message, actions }) => {
    setDialogConfig({ open: true, type, title, message, actions });
  };

  const hideDialog = () => {
    setDialogConfig({ ...dialogConfig, open: false });
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <Dialog
        open={dialogConfig.open}
        onClose={hideDialog}
        maxWidth="xs"
        fullWidth
        aria-labelledby="dialog-title"
      >
        {dialogConfig.type === 'loading' ? (
          <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <CircularProgress />
            <p className="text-xs text-gray-400">{dialogConfig.message}</p>
          </Box>
        ) : (
          <>
            <DialogTitle id="dialog-title">{dialogConfig.title}</DialogTitle>
            <DialogContent>
              <p className="text-xs text-gray-400">{dialogConfig.message}</p>
            </DialogContent>
            {dialogConfig.actions && (
              <DialogActions>
                {dialogConfig.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    onClick={action.onClick}
                    color={action.color || 'primary'}
                  >
                    {action.label}
                  </Button>
                ))}
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

// Custom Hook
export const useDialog = () => useContext(DialogContext);
