import { InterAdmClients } from "./interAdmClients";

export interface InterAdmAllClients {
  content: InterAdmClients[],
  first: boolean,
  last: boolean,
  size: number,
  totalPages: number,
  totalElements: number,
  page: number,
  pageElements: number
}
