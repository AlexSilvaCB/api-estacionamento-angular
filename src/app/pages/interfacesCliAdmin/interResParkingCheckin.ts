export interface InterResParkingCheckin {
  plate:string,
  model:string,
  color:string,
  clientCpf:string,
  receipt:string,
  entryData:string,
  vacancyCode:string
}

export interface InterResParkingVacancy {
  freeVancacy:number
  vacancyOccupied:number
}
