import { AuthProvider } from "./AuthProvider";

export class LinkedAccount {
  id: string;
  authProvider: AuthProvider;
  token: string;
}