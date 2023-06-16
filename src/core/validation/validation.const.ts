import { ValidationError } from '@nestjs/common';
import { ValidationException } from './validation.exception';

export const customExceptionFactory = (errors: ValidationError[]) => {
  const messages = formatMessage(errors);
  return new ValidationException(messages);
};

const formatMessage = (errors: ValidationError[], message: string[] = []): string[] => {
  errors.forEach((error) => {
    if (error && error.children && error.children.length > 0) {
      formatMessage(error.children, message);
    }
    if (error.constraints) {
      message.push(
        `${error.property} is not valid. ${error.constraints ? Object.values(error.constraints).join(', ') : ''} `,
      );
    }
  });

  return message;
};