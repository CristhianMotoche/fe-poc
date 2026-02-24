import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GameSetup from '../pages/GameSetup';

describe('GameSetup Component Tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the game setup form', () => {
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Configurar Juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del juego')).toBeInTheDocument();
    expect(screen.getByLabelText('Participantes')).toBeInTheDocument();
  });

  it('should add a participant when clicking "Agregar"', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (1)')).toBeInTheDocument();
  });

  it('should add multiple participants', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    await user.type(input, 'Maria');
    await user.click(addButton);
    
    await user.type(input, 'Pedro');
    await user.click(addButton);
    
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Pedro')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (3)')).toBeInTheDocument();
  });

  it('should remove a participant when clicking "Eliminar"', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    await user.type(input, 'Maria');
    await user.click(addButton);
    
    expect(screen.getByText('Lista de participantes (2)')).toBeInTheDocument();
    
    const removeButtons = screen.getAllByText('Eliminar');
    await user.click(removeButtons[0]);
    
    expect(screen.queryByText('Juan')).not.toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (1)')).toBeInTheDocument();
  });

  it('should clear input after adding a participant', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante') as HTMLInputElement;
    const addButton = screen.getByText('Agregar');
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    expect(input.value).toBe('');
  });

  it('should add participant when pressing Enter', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante');
    
    await user.type(input, 'Juan{Enter}');
    
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });

  it('should show alert with game details when submitting with valid data', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const gameNameInput = screen.getByLabelText('Nombre del juego');
    const participantInput = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');
    const submitButton = screen.getByText('Crear Juego');
    
    await user.type(gameNameInput, 'Amigo Secreto 2026');
    await user.type(participantInput, 'Juan{Enter}');
    await user.type(participantInput, 'Maria');
    await user.click(addButton);
    
    await user.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Juego: Amigo Secreto 2026\nParticipantes:\nJuan\nMaria');
    
    alertSpy.mockRestore();
  });

  it('should show alert when submitting with less than 2 participants', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const gameNameInput = screen.getByLabelText('Nombre del juego');
    const participantInput = screen.getByPlaceholderText('Nombre del participante');
    const submitButton = screen.getByText('Crear Juego');
    
    await user.type(gameNameInput, 'Amigo Secreto 2026');
    await user.type(participantInput, 'Juan{Enter}');
    
    await user.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Debes agregar al menos 2 participantes');
    
    alertSpy.mockRestore();
  });

  it('should not add duplicate participants', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    await user.type(input, 'Juan');
    await user.click(addButton);
    
    const participants = screen.getAllByText('Juan');
    expect(participants).toHaveLength(1);
    expect(screen.getByText('Lista de participantes (1)')).toBeInTheDocument();
  });

  it('should not add empty participant names', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const addButton = screen.getByText('Agregar');
    
    await user.click(addButton);
    
    expect(screen.queryByText('Lista de participantes')).not.toBeInTheDocument();
  });
});
