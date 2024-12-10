export interface IAddGeneralIndicator{
    codeId:number,
    codeName:string,
    yearFrom:number,
    yearTo:number,
    chartType:number,
    isSector : boolean,
    sectorId : number,
    sectorName : string
}
export interface IAddOmanMap{
    governorateId :number;
    wilayatId :number[];
    codesId :number[];
}
