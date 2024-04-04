import { InterParkingCustomer }from "./interParkingCustomer"

export interface InterAllParkingCustomer {
  "content": InterParkingCustomer[],
  "first": boolean,
  "last": boolean,
  "size": number,
  "totalPages": number,
  "totalElements": number,
  "page": number,
  "pageElements": number
}
