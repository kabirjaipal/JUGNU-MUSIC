import { Bot } from "./handlers/Client.js";
import {
  ApplicationCommandNonOptions,
  CommandInteraction,
  ContextMenuCommandInteraction,
  InteractionReplyOptions,
  Message,
  UserContextMenuCommandInteraction,
  InteractionResponse,
  ApplicationCommandDataResolvable,
  PermissionResolvable,
} from "discord.js/typings";

interface McommandOptions {
  client?: Bot;
  message?: Message;
  args?: string[];
  prefix?: string;
}

export interface Mcommand {
  name: string;
  description: string;
  userPermissions: PermissionResolvable[];
  botPermissions: PermissionResolvable[];
  category: string;
  owneronly: boolean;
  run: (options: McommandOptions) => {};
}

interface ScommandOptions {
  client?: Bot;
  interaction?: CommandInteraction;
}

export interface CustomSCommand {
  name: string;
  description: string;
  userPermissions: PermissionResolvable[];
  botPermissions: PermissionResolvable[];
  category: string;
  type: number;
  options?: ApplicationCommandNonOptions[];
  run: (options: ScommandOptions) => {};
}

type Scommand = ApplicationCommandDataResolvable & CustomSCommand;

export interface CMcommand {
  name: string;
  category: string;
  type: number;
  run: (client: Bot, interaction: ContextMenuCommandInteraction) => {};
}

export interface CUcommand {
  name: string;
  category: string;
  type: number;
  run: (client: Bot, interaction: UserContextMenuCommandInteraction) => {};
}

export type send = (
  interactionOrMessage: CommandInteraction | Message,
  options: InteractionReplyOptions
) => Promise<Message | InteractionResponse>;

export type SendEmbedFunction = (
  interaction: CommandInteraction,
  data: string,
  ephemeral?: boolean
) => Promise<Message | InteractionResponse>;
