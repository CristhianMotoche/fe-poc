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
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1234567890');
    await user.click(addButton);
    
    expect(screen.getByText('Juan — +1234567890')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (1)')).toBeInTheDocument();
  });

  it('should add multiple participants', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1111111111');
    await user.click(addButton);
    
    await user.type(nameInput, 'Maria');
    await user.type(phoneInput, '+2222222222');
    await user.click(addButton);
    
    await user.type(nameInput, 'Pedro');
    await user.type(phoneInput, '+3333333333');
    await user.click(addButton);
    
    expect(screen.getByText('Juan — +1111111111')).toBeInTheDocument();
    expect(screen.getByText('Maria — +2222222222')).toBeInTheDocument();
    expect(screen.getByText('Pedro — +3333333333')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (3)')).toBeInTheDocument();
  });

  it('should remove a participant when clicking "Eliminar"', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1111111111');
    await user.click(addButton);
    
    await user.type(nameInput, 'Maria');
    await user.type(phoneInput, '+2222222222');
    await user.click(addButton);
    
    expect(screen.getByText('Lista de participantes (2)')).toBeInTheDocument();
    
    const removeButtons = screen.getAllByText('Eliminar');
    await user.click(removeButtons[0]);
    
    expect(screen.queryByText('Juan — +1111111111')).not.toBeInTheDocument();
    expect(screen.getByText('Maria — +2222222222')).toBeInTheDocument();
    expect(screen.getByText('Lista de participantes (1)')).toBeInTheDocument();
  });

  it('should clear input after adding a participant', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante') as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText('Teléfono') as HTMLInputElement;
    const addButton = screen.getByText('Agregar');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1234567890');
    await user.click(addButton);
    
    expect(nameInput.value).toBe('');
    expect(phoneInput.value).toBe('');
  });

  it('should add participant when pressing Enter', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1234567890{Enter}');
    
    expect(screen.getByText('Juan — +1234567890')).toBeInTheDocument();
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
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');
    const submitButton = screen.getByText('Crear Juego');
    
    await user.type(gameNameInput, 'Amigo Secreto 2026');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1111111111');
    await user.click(addButton);
    
    await user.type(nameInput, 'Maria');
    await user.type(phoneInput, '+2222222222');
    await user.click(addButton);
    
    await user.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Juego: Amigo Secreto 2026\nParticipantes:\nJuan (+1111111111)\nMaria (+2222222222)');
    
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
    
    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+1111111111');
    await user.click(addButton);
    
    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, '+9999999999');
    await user.click(addButton);
    
    const participants = screen.getAllByText('Juan — +1111111111');
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

  it('should show error when phone is empty', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const addButton = screen.getByText('Agregar');

    await user.type(nameInput, 'Juan');
    await user.click(addButton);

    expect(screen.getByText('El teléfono es requerido')).toBeInTheDocument();
    expect(screen.queryByText('Lista de participantes (1)')).not.toBeInTheDocument();
  });

  it('should show error when phone is invalid', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');

    await user.type(nameInput, 'Juan');
    await user.type(phoneInput, 'abc');
    await user.click(addButton);

    expect(screen.getByText('Número de teléfono inválido')).toBeInTheDocument();
    expect(screen.queryByText('Lista de participantes (1)')).not.toBeInTheDocument();
  });

  it('should clear phone error when typing a valid phone', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <GameSetup />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('Nombre del participante');
    const phoneInput = screen.getByPlaceholderText('Teléfono');
    const addButton = screen.getByText('Agregar');

    await user.type(nameInput, 'Juan');
    await user.click(addButton);
    expect(screen.getByText('El teléfono es requerido')).toBeInTheDocument();

    await user.type(phoneInput, '+1234567890');
    expect(screen.queryByText('El teléfono es requerido')).not.toBeInTheDocument();
  });
});
