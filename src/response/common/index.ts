import type {
  ErrorResponse,
  MessageRespons,
  PaginationResponse,
  SuccessResponse,
} from '../../type/common';

export const createResponse = (data: SuccessResponse) => {
  return {
    status: data.statusCode,
    description: data.description ? data.description : data.message,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: data.statusCode,
        },
        message: {
          type: 'string',
          example: data.message,
        },
        data: {
          type: 'any',
          example: data.data,
        },
      },
    },
  };
};

export const createPaginationResponse = (data: PaginationResponse) => {
  return {
    status: data.statusCode,
    description: data.description ? data.description : data.message,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: data.statusCode,
        },
        message: {
          type: 'string',
          example: data.message,
        },
        data: {
          type: 'any',
          example: data.data,
        },
        count: {
          type: 'number',
          example: data.count,
        },
      },
    },
  };
};

export const createMessageResponse = (data: MessageRespons) => {
  return {
    status: data.statusCode,
    description: data.description ? data.description : data.message,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: data.statusCode,
        },
        message: {
          type: 'string',
          example: data.message,
        },
      },
    },
  };
};

export const createErrorResponse = (data: ErrorResponse) => {
  return {
    status: data.fakeCode ? data.fakeCode : data.statusCode,
    description: data.description ? data.description : data.message,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: data.statusCode,
        },
        message: {
          type: 'string',
          example: data.message,
        },
        error: {
          type: 'string',
          example: data.error,
        },
      },
    },
  };
};
