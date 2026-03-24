export type VideoStatus = "processing" | "ready" | "error";

export type CatalogVideo = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  coverUrl: string;
  mimeType: string;
  sizeBytes: number;
  status: VideoStatus;
  uploadedById: string;
  createdAt: string;
};

export type VideoListResponse = {
  data: CatalogVideo[];
  total: number;
  page: number;
  limit: number;
};
