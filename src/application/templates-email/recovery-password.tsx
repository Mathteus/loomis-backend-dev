// src/templates/ResetPassword.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
} from '@react-email/components';
import React from 'react';

interface ResetPasswordProps {
  username: string;
  code: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const title = {
  fontSize: '24px',
  color: '#333333',
};

const codeStyle = {
  fontWeight: 600,
  fontSize: '2.5rem',
  lineHeight: '38px',
  letterSpacing: '-2%',
  color: '#0c111d',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#666666',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
  margin: '10px 0',
};

export function EmailRecoveryCode({ username, code }: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefina sua senha</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={title}>Olá {username},</Text>
          <Text style={paragraph}>
            Você solicitou a redefinição de senha. Aqui está seu código para
            colocar no nosso site.
          </Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={paragraph}>
            Se você não solicitou isso, ignore este email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
