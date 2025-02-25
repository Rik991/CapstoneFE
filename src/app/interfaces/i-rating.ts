export interface iRating {
  id?: number;
  rating: number;
  comment?: string;
  resellerId: number;
  userId: number;
  user?: {
    id: number;
    username: string;
  };
  reseller?: {
    id: number;
    username: string;
  };
}
