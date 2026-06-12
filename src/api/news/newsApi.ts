import { apiRequest } from "../Api";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export const fetchComments = async (limit: number = 10): Promise<Comment[]> => {
  const response = await apiRequest<undefined, Comment[]>({
    url: `comments`,
    method: "GET",
    params: { _limit: limit },
  });
  return response.data;
};
