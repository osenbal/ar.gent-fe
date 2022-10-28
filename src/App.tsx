import React, { useMemo, useState, useEffect } from 'react';
import AppRoutes from './routes/App.routes';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import ColorModeContext from './Context/ColorMode.context';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App: React.FC = () => {
  const locales = ['en', 'fr', 'de', 'ru', 'ar-sa'] as const;
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [locale] = React.useState<typeof locales[number]>('en');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        if (mode === 'light') {
          setMode('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          setMode('light');
          localStorage.setItem('theme', 'light');
        }
      },
    }),
    [mode]
  );

  useEffect(() => {
    const existingPreference = localStorage.getItem('theme');
    if (existingPreference) {
      existingPreference === 'light' ? setMode('light') : setMode('dark');
    } else {
      setMode('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <Box bgcolor={'background.default'} color={'text.primary'}>
                <HelmetProvider>
                  <AppRoutes />
                </HelmetProvider>
              </Box>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </LocalizationProvider>
      </Provider>
    </>
  );
};

export default App;
