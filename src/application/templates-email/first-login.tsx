import React from 'react';

interface FirstAccessEmailProps {
  password: string;
}

export function EmailFirstAcces({ password }: FirstAccessEmailProps) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            color: '#333',
            fontSize: '24px',
            marginBottom: '20px',
          }}
        >
          Bemvindo a Loomis!
        </h1>

        <p
          style={{
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}
        >
          Temos o prazer de recebê-lo(a) na Loomis! Sua conta foi criada com
          sucesso e agora você pode acessar nossa plataforma usando a senha
          temporária fornecida abaixo.
        </p>

        <div
          style={{
            backgroundColor: '#f8f8f8',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              color: '#333',
              fontSize: '16px',
              margin: '0',
            }}
          >
            <strong>Senha temporária:</strong> {password}
          </p>
        </div>

        <p
          style={{
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}
        >
          <strong>Importante:</strong> Para sua segurança, não compartilhe esta
          senha com ninguém. Recomendamos que você altere sua senha
          imediatamente após o primeiro login.
        </p>

        <a
          href="https://example.com/login"
          style={{
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          Log In Now
        </a>

        <p
          style={{
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}
        >
          Caso tenha alguma dúvida ou precise de assistência, entre em contato
          com nossa equipe de suporte pelo e-mail support@loomis.com.
        </p>

        <p
          style={{
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.6',
          }}
        >
          Atenciosamente, Equipe Loomis.
        </p>
      </div>

      <div
        style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          marginTop: '20px',
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} Loomis. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  );
}
