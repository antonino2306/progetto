## Prerequisiti

È necessario avere installato:
- Node.js (almeno 22.14.1)
- npm (incluso con Node.js)
- Ionic CLI (`npm install -g @ionic/cli`)

## Installazione delle Dipendenze

Prima di avviare i server, è necessario installare i moduli Node.js per entrambe le parti del progetto.

### 1. Backend (Express.js)

Naviga nella cartella del backend e installa le dipendenze:

```bash
cd backend
npm install
```

### 2. Frontend (Ionic Angular)

Naviga nella cartella del frontend e installa le dipendenze:

```bash
cd ticketexpress
npm install
```

## Avvio dei Server

### Backend

Per avviare il server Express.js:

```bash
cd backend
npm start
```

Il backend sarà ora in esecuzione e pronto a ricevere richieste.

### Frontend

Per avviare l'applicazione Ionic Angular:

```bash
cd ticketexpress
ionic serve
```

Il frontend sarà accessibile tramite browser all'indirizzo `http://localhost:8100`.

## Note

- Bisogna avviare prima il backend e poi il frontend
