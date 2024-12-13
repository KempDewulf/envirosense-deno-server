import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { MessagingModule } from "EnviroSense/Infrastructure/Messaging/MessagingModule.ts";

new WebApiModule(8101).run();
new MessagingModule().run();