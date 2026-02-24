import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  overflow: auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #48bb78;
  color: white;

  &:hover {
    background-color: #38a169;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #e2e8f0;
  color: #4a5568;

  &:hover {
    background-color: #cbd5e0;
  }
`;

const AddButton = styled(Button)`
  background-color: #667eea;
  color: white;

  &:hover {
    background-color: #5568d3;
  }
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: #f7fafc;
  border-radius: 8px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ParticipantName = styled.span`
  font-size: 1rem;
  color: #2d3748;
`;

const RemoveButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e53e3e;
  background-color: #fff5f5;
  border: 1px solid #fc8181;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #feb2b2;
    color: #742a2a;
  }
`;

const ParticipantInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');

  const handleAddParticipant = () => {
    if (currentName.trim() && !participants.includes(currentName.trim())) {
      setParticipants([...participants, currentName.trim()]);
      setCurrentName('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participants.length < 2) {
      alert('Debes agregar al menos 2 participantes');
      return;
    }
    alert(`Juego: ${gameName}\nParticipantes:\n${participants.join('\n')}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container>
      <Card>
        <Title>Configurar Juego</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="gameName">Nombre del juego</Label>
            <Input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Ej: Amigo Secreto 2026"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="participantName">Participantes</Label>
            <ParticipantInputGroup>
              <Input
                id="participantName"
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nombre del participante"
              />
              <AddButton type="button" onClick={handleAddParticipant}>
                Agregar
              </AddButton>
            </ParticipantInputGroup>
          </FormGroup>

          {participants.length > 0 && (
            <FormGroup>
              <Label>Lista de participantes ({participants.length})</Label>
              <ParticipantsList>
                {participants.map((name, index) => (
                  <ParticipantItem key={index}>
                    <ParticipantName>{name}</ParticipantName>
                    <RemoveButton onClick={() => handleRemoveParticipant(index)}>
                      Eliminar
                    </RemoveButton>
                  </ParticipantItem>
                ))}
              </ParticipantsList>
            </FormGroup>
          )}

          <ButtonGroup>
            <SecondaryButton type="button" onClick={handleCancel}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit">
              Crear Juego
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default GameSetup;
