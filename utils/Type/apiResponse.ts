type ApiResponse<T> = {
  status: "success" | "error";
  statusCode: number;
  message?: string;
  data: T;
};
export type { ApiResponse };

