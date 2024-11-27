export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  level_id: number;
  level_name?: string; // Nome do nível para exibição
}
