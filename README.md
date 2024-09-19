## Conexão com o MySQL

![image](https://github.com/user-attachments/assets/f0f81299-314a-4d89-afc4-d2245d741317)

## Criando o Banco de dados

![image](https://github.com/user-attachments/assets/eade94c5-4b59-4444-873f-a255021229fc)

### Script SQL

```
CREATE DATABASE IF NOT EXISTS my_events;
USE my_events;

CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    eventDate DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registration (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES event(id) ON DELETE CASCADE
);
```

![image](https://github.com/user-attachments/assets/a9209437-1f80-4b36-b180-6ca503b27170)

## Conexão entre Cliente e Servidor

![image](https://github.com/user-attachments/assets/7e600e1a-bb15-494c-b3d0-a0ec069f1b21)

## Funcionamento

### Swagger do Projeto

![image](https://github.com/user-attachments/assets/3a8d870b-f7f6-4241-a935-fec4a0d8de0e)

### Criação de Usuário Administrador

![image](https://github.com/user-attachments/assets/24182dc1-92a2-4e36-bdab-d7568d6d88ff)

![image](https://github.com/user-attachments/assets/231e456c-df2f-4662-8c46-3b6b03c7c2c1)

### Criação de Usuário Comum

![image](https://github.com/user-attachments/assets/e95b07d4-422c-49fc-872d-dc43874c6c82)

![image](https://github.com/user-attachments/assets/b7a41cd1-7bbc-404b-8a72-4d344f31a0b4)

### Resultado da Tabela User

![image](https://github.com/user-attachments/assets/6427740e-396d-4b14-a571-a2d539be57e7)

### GET de um Usuário

![image](https://github.com/user-attachments/assets/5b3b08fc-7875-476a-b962-f145eb46aa28)

### PUT de um Usuário

![image](https://github.com/user-attachments/assets/17bc2170-61f6-47a0-9900-880277b13ee5)

![image](https://github.com/user-attachments/assets/34f19b32-75b7-4e2b-84bf-40a0b6c42bd7)

![image](https://github.com/user-attachments/assets/6b0ee678-b0c3-454f-a10a-d62080d25765)


### Criação de um Evento

-> Resposta de erro:

* Usuários comuns não podem criar eventos

![image](https://github.com/user-attachments/assets/5df6cd62-ab25-4713-98d4-9a4a3e42478f)

![image](https://github.com/user-attachments/assets/618b3ac2-a369-462b-8f85-067492ae1533)

![image](https://github.com/user-attachments/assets/80eb96f8-98ba-48e7-a453-c626a40933a3)

![image](https://github.com/user-attachments/assets/c21cca0a-db94-4643-97b9-47b33cacfaec)

![image](https://github.com/user-attachments/assets/6bcc351d-af73-46a3-8d69-7989ec7c20d3)



