export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

export const headerStyle = {
  p: 2,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'space-between',
};

export const contentStyle = {
  flex: 1,
  overflow: 'auto',
};

export const footerStyle = {
  p: 2,
  borderTop: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};
