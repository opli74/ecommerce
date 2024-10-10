
export interface ApiResponse<T = any> 
{
    success: boolean;
    message: string;
    data: T | null;
    error: any;
}

export function response< T > (
  success: boolean,
  message: string,
  data: T | null = null,
  error: any = null
): ApiResponse< T > {
  return {
    success,
    message,
    data,
    error,
  };
}