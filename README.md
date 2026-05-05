# Telegram Auto Bot

Bot automatico para Telegram hecho con Node.js y Telegraf.

## 1. Crear el bot en Telegram

1. Abre Telegram y busca `@BotFather`.
2. Envia `/newbot`.
3. Elige nombre y usuario para tu bot.
4. Copia el token que te entrega BotFather.

## 2. Configurar

Copia `.env.example` como `.env` y cambia el token:

```env
BOT_TOKEN=tu_token_real
AUTO_MESSAGE_INTERVAL_MINUTES=60
AUTO_MESSAGE=Hola, este es un mensaje automatico.
```

## 3. Instalar y ejecutar

```bash
npm install
npm start
```

Para desarrollo:

```bash
npm run dev
```

## Comandos del bot

- `/start` registra el chat y activa el bot.
- `/ayuda` muestra opciones.
- `/estado` confirma que el bot funciona.
- `/detener` deja de recibir mensajes automaticos.

## Notas

Telegram solo permite que el bot envie mensajes automaticos a usuarios o grupos que ya hayan iniciado una conversacion con el bot.

## Hostinger 24/7

Si vas a desplegarlo en Hostinger Node.js Hosting:

1. Sube este proyecto a un repositorio de GitHub.
2. En hPanel crea una `Node.js Web App` y conecta el repositorio.
3. Usa `npm install` como comando de build si Hostinger lo pide.
4. Usa `npm start` como comando de inicio.
5. Agrega las variables:

```env
BOT_TOKEN=tu_token_real
AUTO_MESSAGE_INTERVAL_MINUTES=60
AUTO_MESSAGE=Hola, este es un mensaje automatico.
```

Este proyecto ya expone un endpoint HTTP para que el hosting mantenga el proceso activo.
