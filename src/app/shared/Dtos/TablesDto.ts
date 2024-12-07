import { IDropdownList } from "src/app/companies/Dtos/SharedDto";

export interface IFilteredListDto {
    filtered: IDropdownList[],
    isDropdownOpen : boolean,
    index : string;
}