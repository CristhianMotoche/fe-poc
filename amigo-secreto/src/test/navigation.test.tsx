import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AppRoutes from '../AppRoutes';

describe('Navigation Tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the Home page initially', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Amigo Secreto')).toBeInTheDocument();
    expect(screen.getByText('Crear nuevo juego')).toBeInTheDocument();
  });

  it('should navigate to GameSetup page when clicking "Crear nuevo juego"', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    const createButton = screen.getByText('Crear nuevo juego');
    await user.click(createButton);
    
    expect(screen.getByText('Configurar Juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Participantes')).toBeInTheDocument();
  });

  it('should navigate back to Home page when clicking "Cancelar"', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    // Navigate to setup page
    const createButton = screen.getByText('Crear nuevo juego');
    await user.click(createButton);
    
    // Verify we're on setup page
    expect(screen.getByText('Configurar Juego')).toBeInTheDocument();
    
    // Click cancel button
    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);
    
    // Should be back on home page
    expect(screen.getByText('Amigo Secreto')).toBeInTheDocument();
    expect(screen.getByText('Crear nuevo juego')).toBeInTheDocument();
  });

  it('should render GameSetup page directly when navigating to /setup', () => {
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Configurar Juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del juego')).toBeInTheDocument();
  });

  it('should support full navigation flow: home -> setup -> home', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    // Start on home
    expect(screen.getByText('Amigo Secreto')).toBeInTheDocument();
    
    // Navigate to setup
    const createButton = screen.getByText('Crear nuevo juego');
    await user.click(createButton);
    expect(screen.getByText('Configurar Juego')).toBeInTheDocument();
    
    // Navigate back home
    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);
    expect(screen.getByText('Crear nuevo juego')).toBeInTheDocument();
  });
});
