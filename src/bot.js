require("dotenv").config();

const http = require("http");
const { Telegraf } = require("telegraf");
const { readChats, removeChat, saveChat } = require("./store");

const token = process.env.BOT_TOKEN;
const intervalMinutes = Number(process.env.AUTO_MESSAGE_INTERVAL_MINUTES || 60);
const autoMessage = process.env.AUTO_MESSAGE || "Hola, este es un mensaje automatico.";
const port = Number(process.env.PORT || 3000);

if (!token || token === "pon_aqui_el_token_de_botfather") {
  console.error("Falta BOT_TOKEN. Copia .env.example a .env y agrega el token de BotFather.");
  process.exit(1);
}

const bot = new Telegraf(token);

const menuKeyboard = {
  reply_markup: {
    keyboard: [
      ["Que es My Wealth 100", "Membresia"],
      ["Servicios tecnologicos", "Reventa 50%"],
      ["Wealthy Trip", "Wealthy Car"],
      ["Wealthy Home", "Sistema Follow Me"],
      ["Temporada 1", "Temporada 2"],
      ["Temporada 3", "Premios"],
      ["Como empezar", "Hablar con asesor"],
      ["Iniciar matriz"],
      ["Que es matriz 2x2", "Como funciona"],
      ["Cuantas personas necesito", "Quien me ayuda"],
      ["Puedo retirar", "Es obligatorio invitar"],
      ["Ventajas", "Riesgos"],
      ["Clave del exito"]
    ],
    resize_keyboard: true
  }
};

const answers = [
  {
    keywords: ["que es matriz 2x2", "matriz 2x2", "2x2"],
    reply:
      "Que es una matriz 2x2?\n\n" +
      "Es un modelo de organizacion donde cada persona invita a 2 participantes directos en el primer nivel, y estos a su vez invitan a otros 2 cada uno, formando un segundo nivel de 4 personas."
  },
  {
    keywords: ["como funciona", "funciona el sistema"],
    reply:
      "Como funciona el sistema?\n\n" +
      "Cada persona realiza una donacion unica para ingresar. Luego, al completarse su matriz de 2 + 4 personas, recibe las donaciones generadas en el segundo nivel."
  },
  {
    keywords: ["cuantas personas necesito", "personas necesito", "completar matriz"],
    reply:
      "Cuantas personas necesito para completar mi matriz?\n\n" +
      "Solo necesitas 6 personas en total:\n" +
      "- 2 en tu primer nivel\n" +
      "- 4 en tu segundo nivel"
  },
  {
    keywords: ["quien me ayuda", "llenar la matriz", "patrocinador"],
    reply:
      "Quien me ayuda a llenar la matriz?\n\n" +
      "El sistema funciona en equipo. Tu patrocinador y la comunidad te apoyan con el crecimiento, ya que todos se benefician del avance colectivo."
  },
  {
    keywords: ["primer nivel", "donaciones del primer", "nivel superior"],
    reply:
      "Que sucede con las donaciones del primer nivel?\n\n" +
      "Generalmente, las donaciones del primer nivel se dirigen al patrocinador o nivel superior, fortaleciendo la red y creando sostenibilidad."
  },
  {
    keywords: ["retirar", "retiro", "dinero"],
    reply:
      "Puedo retirar todo el dinero?\n\n" +
      "En este sistema, una parte es retirable y otra se reinvierte automaticamente para permitir tu crecimiento continuo dentro del modelo."
  },
  {
    keywords: ["es obligatorio invitar", "obligatorio invitar", "derrame", "spillover"],
    reply:
      "Es obligatorio invitar personas?\n\n" +
      "Si. El crecimiento depende de la expansion de la red. Sin embargo, el sistema tambien puede apoyarte con derrames o spillover del equipo."
  },
  {
    keywords: ["negocio tradicional", "tradicional", "diferencia"],
    reply:
      "Cual es la diferencia con un negocio tradicional?\n\n" +
      "Aqui no vendes productos; participas en una economia colaborativa, donde el valor se genera por la comunidad."
  },
  {
    keywords: ["ventajas", "que ventajas", "beneficios"],
    reply:
      "Que ventajas tiene este sistema?\n\n" +
      "- Bajo costo de entrada\n" +
      "- Sistema simple\n" +
      "- Potencial de crecimiento en equipo\n" +
      "- Ciclos repetibles\n" +
      "- Apalancamiento comunitario"
  },
  {
    keywords: ["riesgos", "que riesgos", "garantizado", "garantia"],
    reply:
      "Cuales son los riesgos?\n\n" +
      "- Depende del crecimiento de la red\n" +
      "- No hay ingresos garantizados\n" +
      "- Requiere compromiso y accion"
  },
  {
    keywords: ["para quien", "modelo"],
    reply:
      "Para quien es este modelo?\n\n" +
      "Para personas que:\n" +
      "- Quieren generar ingresos colaborativos\n" +
      "- Estan dispuestas a aprender y compartir\n" +
      "- Buscan comunidad y crecimiento"
  },
  {
    keywords: ["clave del exito", "exito", "duplicacion"],
    reply:
      "Cual es la clave del exito?\n\n" +
      "La duplicacion: invitar 2 personas.\n\n" +
      "Aqui no se trata solo de ganar dinero, se trata de crecer juntos y multiplicar oportunidades."
  },
  {
    keywords: ["my wealth", "mywealth", "wealth 100", "que es my wealth"],
    reply:
      "Que es My Wealth 100?\n\n" +
      "My Wealth 100 se presenta como una comunidad con servicios tecnologicos, membresia activa y una estructura de crecimiento por rondas.\n\n" +
      "Al activar tu membresia, ingresas al sistema, activas tu posicion dentro de la matriz y accedes a beneficios comerciales."
  },
  {
    keywords: ["membresia", "suscripcion", "activar", "posicion activa"],
    reply:
      "Que incluye la membresia?\n\n" +
      "La membresia activa tu posicion dentro del sistema y tu ingreso a la matriz. Tambien te permite acceder a la reventa de servicios tecnologicos con un descuento preferencial.\n\n" +
      "Tu avance depende de la actividad, la comunidad y el crecimiento de la red."
  },
  {
    keywords: ["servicios tecnologicos", "soluciones digitales", "empresa"],
    reply:
      "Que servicios tecnologicos ofrece My Wealth 100?\n\n" +
      "My Wealth 100 nace desde una empresa de desarrollo de servicios tecnologicos. Desarrolla servicios digitales y soluciones tecnologicas pensadas para comercializarse dentro y fuera de la red."
  },
  {
    keywords: ["reventa", "50", "descuento", "descuento 50"],
    reply:
      "Como funciona la reventa con 50% de descuento?\n\n" +
      "Con tu suscripcion activa puedes revender servicios tecnologicos con el 50% de descuento. La idea es convertir esa ventaja en una oportunidad comercial real para generar margen al vender servicios digitales."
  },
  {
    keywords: ["wealthy trip", "trip", "ronda 1", "viaje", "punta cana", "crucero"],
    reply:
      "Wealthy Trip - Ronda 1\n\n" +
      "Es la primera etapa del recorrido. Representa movimiento, crecimiento y un nuevo comienzo.\n\n" +
      "Objetivos destacados:\n" +
      "- Bono 5.000 USDT para ronda 2\n" +
      "- Bono 2.000 USDT viaje\n" +
      "- Punta Cana + crucero de lujo + todo incluido"
  },
  {
    keywords: ["wealthy car", "car", "ronda 2", "luxury car", "auto"],
    reply:
      "Wealthy Car - Ronda 2\n\n" +
      "Es la segunda etapa, enfocada en mayor impacto, presencia y una recompensa de otro nivel.\n\n" +
      "Objetivos destacados:\n" +
      "- Cierre de segunda ronda con Luxury Car 0 KM\n" +
      "- Bono 100.000 USDT para ronda 3\n" +
      "- Bono 60.000 USDT Lux Car"
  },
  {
    keywords: ["wealthy home", "home", "ronda 3", "mansion", "patrimonio"],
    reply:
      "Wealthy Home - Ronda 3\n\n" +
      "Es la tercera etapa, pensada para una vision patrimonial mas grande y una meta final de mayor escala.\n\n" +
      "Objetivos destacados:\n" +
      "- Bono 500.000 USDT Mansion\n" +
      "- Escala mayor de cobros por ciclo\n" +
      "- Mensaje final de legado y vision"
  },
  {
    keywords: ["follow me", "sigueme", "red te sigue", "arrastre"],
    reply:
      "Que es el sistema Follow Me?\n\n" +
      "Cuando tu red va cerrando y avanzando, te sigue. Ese movimiento ayuda a que el crecimiento del equipo no se pierda y fortalece tu proyeccion dentro del sistema."
  },
  {
    keywords: ["temporada 1", "season 1", "12.100", "12100"],
    reply:
      "Temporada 1 - Proyeccion por ciclos\n\n" +
      "Total proyectado: 12.100 USDT\n\n" +
      "Ciclo 1: 100 USDT\n" +
      "Ciclo 2: 300 USDT\n" +
      "Ciclo 3: 900 USDT\n" +
      "Ciclo 4: 2.700 USDT\n" +
      "Ciclo 5: 8.100 USDT\n\n" +
      "Importante: son valores de referencia del modelo; no representan ingresos garantizados."
  },
  {
    keywords: ["temporada 2", "season 2", "605.000", "605000"],
    reply:
      "Temporada 2 - Proyeccion por ciclos\n\n" +
      "Total proyectado: 605.000 USDT\n\n" +
      "Ciclo 1: 5.000 USDT\n" +
      "Ciclo 2: 15.000 USDT\n" +
      "Ciclo 3: 45.000 USDT\n" +
      "Ciclo 4: 135.000 USDT\n" +
      "Ciclo 5: 405.000 USDT\n\n" +
      "Importante: son valores de referencia del modelo; no representan ingresos garantizados."
  },
  {
    keywords: ["temporada 3", "season 3", "12.100.000", "12100000"],
    reply:
      "Temporada 3 - Proyeccion por ciclos\n\n" +
      "Total proyectado: 12.100.000 USDT\n\n" +
      "Ciclo 1: 100.000 USDT\n" +
      "Ciclo 2: 300.000 USDT\n" +
      "Ciclo 3: 900.000 USDT\n" +
      "Ciclo 4: 2.700.000 USDT\n" +
      "Ciclo 5: 8.100.000 USDT\n\n" +
      "Importante: son valores de referencia del modelo; no representan ingresos garantizados."
  },
  {
    keywords: ["premios", "premio", "recompensas", "recompensa"],
    reply:
      "Premios de temporada\n\n" +
      "- Wealthy Trip: Punta Cana + crucero de lujo\n" +
      "- Wealthy Car: Luxury Car 0 KM\n" +
      "- Wealthy Home: Bono 500.000 USDT Mansion\n\n" +
      "Cada cierre representa una meta visible y una nueva etapa de crecimiento dentro del recorrido."
  },
  {
    keywords: ["empezar", "inicio", "entrar", "acceso", "solicitar acceso"],
    reply:
      "Como empezar?\n\n" +
      "1. Solicita acceso.\n" +
      "2. Activa tu membresia.\n" +
      "3. Toma tu posicion dentro de la matriz.\n" +
      "4. Aprende el sistema y comparte la oportunidad.\n" +
      "5. Duplica: invita 2 personas y apoya el crecimiento del equipo."
  },
  {
    keywords: ["iniciar matriz", "activar matriz", "comenzar matriz"],
    imageUrl:
      "https://web-assets.esetstatic.com/tn/-x700/wls/2018/09/blockchain-que-es-como-funciona.jpg",
    reply:
      "Iniciar matriz\n\n" +
      "Para iniciar tu matriz, activa tu membresia, toma tu posicion y comienza el proceso de duplicacion invitando 2 personas directas.\n\n" +
      "La estructura 2x2 te ayuda a visualizar tu primer nivel y segundo nivel de crecimiento.\n\n" +
      "Inicia aqui:\n" +
      "https://mywealth100.com/?ref=afb78642-d532-4fb4-8bce-bef51ec71164"
  },
  {
    keywords: ["asesor", "whatsapp", "contacto", "hablar"],
    reply:
      "Quieres hablar con un asesor?\n\n" +
      "Puedes solicitar acceso o continuar la conversacion con la persona que te invito.\n\n" +
      "Tambien puedes visitar la pagina oficial:\n" +
      "https://ventas.mywealth100.com/"
  }
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findAnswer(text) {
  const normalizedText = normalizeText(text);

  const exactMatch = answers.find((answer) =>
    answer.keywords.some((keyword) => normalizedText === normalizeText(keyword))
  );

  if (exactMatch) {
    return exactMatch;
  }

  return answers.find((answer) =>
    answer.keywords.some((keyword) => normalizedText.includes(normalizeText(keyword)))
  );
}

function menuMessage() {
  return (
    "Bienvenido a MyWhealt100.\n\n" +
    "Elige una pregunta del menu o escribe una palabra clave como matriz, membresia, reventa, rondas, Follow Me, temporada, premios, ventajas o riesgos."
  );
}

bot.start((ctx) => {
  saveChat(ctx.chat);
  return ctx.reply(menuMessage(), menuKeyboard);
});

bot.help((ctx) => {
  saveChat(ctx.chat);
  return ctx.reply(menuMessage(), menuKeyboard);
});

bot.command("ayuda", (ctx) => {
  saveChat(ctx.chat);
  return ctx.reply(menuMessage(), menuKeyboard);
});

bot.command("estado", (ctx) => {
  saveChat(ctx.chat);
  return ctx.reply("Estoy funcionando correctamente.");
});

bot.command("detener", (ctx) => {
  removeChat(ctx.chat.id);
  return ctx.reply("Listo. Este chat ya no recibira mensajes automaticos.");
});

bot.on("text", (ctx) => {
  saveChat(ctx.chat);

  const answer = findAnswer(ctx.message.text);

  if (answer) {
    if (answer.imageUrl) {
      return ctx.reply(answer.reply, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Ver imagen",
                url: answer.imageUrl
              }
            ]
          ]
        }
      });
    }

    return ctx.reply(answer.reply);
  }

  return ctx.reply(
    "Puedo explicarte como funciona la matriz 2x2. Toca una opcion del menu o escribe /ayuda."
  );
});

async function sendAutomaticMessage() {
  const chats = readChats();

  for (const chat of chats) {
    try {
      await bot.telegram.sendMessage(chat.id, autoMessage);
    } catch (error) {
      console.error(`No pude enviar mensaje al chat ${chat.id}:`, error.message);
    }
  }
}

function startHealthServer() {
  const server = http.createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ ok: true, service: "telegram-auto-bot" }));
      return;
    }

    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Telegram bot running");
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Health server listening on port ${port}.`);
  });

  return server;
}

bot.launch().then(() => {
  console.log("Bot de Telegram iniciado.");
  console.log(`Mensaje automatico cada ${intervalMinutes} minuto(s).`);

  startHealthServer();
  setInterval(sendAutomaticMessage, intervalMinutes * 60 * 1000);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
