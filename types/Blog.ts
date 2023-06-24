export type BlogImage = {
  url: string;
};

export type Blog = {
  id: number;
  title: string;
  image: BlogImage;
  content: string;
  comments_count: number;
  created_at: string;
  updated_at: string;
};
