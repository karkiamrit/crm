import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { parseISO, isValid } from 'date-fns';

export function IsDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isValid(parseISO(value));
        },
        defaultMessage(args: ValidationArguments) {
          return 'dueDate must be a valid date string';
        },
      },
    });
  };
}
