import { ListType } from "@/types";

/**
 * Custom hook to generate navigation paths based on list type and optional ID
 * @param listType - The type of list (MY_DAY, FAVOURITES, IDENTITY, REWARDS)
 * @param id - Optional ID for identity-specific paths
 * @returns The generated path string
 */
export function useNavPath(listType: ListType, id?: string): string {
  switch (listType) {
    case ListType.IDENTITY:
      return `/identity/${id}`; 
    case ListType.REWARDS:
      return `/rewards`;
    case ListType.FAVOURITES:
        return `/favourites`;
    case ListType.MY_DAY:
    default:
      return `/`;
  }
}
