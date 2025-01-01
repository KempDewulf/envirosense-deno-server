import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { MessagingModule } from "EnviroSense/Infrastructure/Messaging/mod.ts";

new WebApiModule(8101).run();
new MessagingModule().run();
