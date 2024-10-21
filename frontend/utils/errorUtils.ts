export const extractErrorMessages = (error: any): string[] => {
    return error.response?.data?.errors?.map((err: any) => err.msg) || [error.message];
  };