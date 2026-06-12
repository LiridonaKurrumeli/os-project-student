import { apiRequest } from "../Api";

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const fetchPhotos = async (limit: number = 12): Promise<Photo[]> => {
  const response = await apiRequest<undefined, Photo[]>({
    url: `photos`,
    method: "GET",
    params: { _limit: limit },
  });
  return response.data;
};
