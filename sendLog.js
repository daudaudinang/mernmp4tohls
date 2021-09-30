import { Telegraf } from "telegraf";
import getCpuDataServer from "./dataServer.js";
import getCpuAuthServer from "./authServer.js";
import getCpuUserServer from "./userServer.js";

const bot = new Telegraf("2034834875:AAHOPcO5baK2JhLkLhGfrbLE5lXTQHE71UI");

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Xin chào tới Logging Bot, nếu Server của bạn quá tải, tôi sẽ thông báo cho bạn!",
    {}
  );

  const message1 = `Hãy chọn Server bạn muốn xem!`+`Nếu muốn kết thúc, hãy nhập: /exit`;

  bot.telegram.sendMessage(ctx.chat.id, message1, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "authServer",
            callback_data: "authServer",
          },
          {
            text: "dataServer",
            callback_data: "dataServer",
          },
          {
            text: "userServer",
            callback_data: "userServer",
          },
          {
            text: "allServer",
            callback_data: "allServer",
          },
        ],
      ],
    },
  });
});

    var interval1 = 0;
    var interval2 = 0;
    var interval3 = 0;
    var interval4 = 0;
    let x = 0;
    bot.action("authServer", (ctx) => {
        clearInterval(interval2);
        clearInterval(interval3);
        clearInterval(interval4);
        interval1 = setInterval(async () => {
            if (await getCpuAuthServer() >= 90){
              bot.telegram.sendMessage(ctx.chat.id, "AuthServer quá tải", {});
            }
        }, 1000);
    });

    bot.action("dataServer", (ctx) => {
        clearInterval(interval1);
        clearInterval(interval3);
        clearInterval(interval4);
        interval2 = setInterval(async() => {
            if (await getCpuDataServer() >= 90) {
              bot.telegram.sendMessage(ctx.chat.id, "DataServer quá tải", {});
            }
        }, 1000);
    });

    bot.action("userServer", (ctx) => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval4);
        interval3 = setInterval(async() => {
            if (await getCpuUserServer() >= 90) {
              bot.telegram.sendMessage(ctx.chat.id, "UserServer quá tải", {});
            }
        }, 1000);
    });

    bot.action("allServer", (ctx) => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
        interval3 = setInterval(async() => {
            if (await getCpuAuthServer() >= 90)
            bot.telegram.sendMessage(ctx.chat.id, "AuthServer quá tải", {});
            if (await getCpuDataServer() >= 90)
            bot.telegram.sendMessage(ctx.chat.id, "DataServer quá tải", {});
            if (await getCpuUserServer() >= 90)
            bot.telegram.sendMessage(ctx.chat.id, "UserServer quá tải", {});
        }, 1000);
    });

    bot.command('/exit', (ctx) => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      clearInterval(interval4);
      // Explicit usage
      ctx.telegram.leaveChat(ctx.message.chat.id);
    
      // Using context shortcut
      ctx.leaveChat();
    });
    
bot.launch();
