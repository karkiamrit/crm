import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export enum Status {
  Live = 'LIVE',
  Blocked = 'BLOCKED',
  Deactivated = 'DEACTIVATED',
  Pending = 'PENDING',
}

export function IsStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStatus',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Object.values(Status).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Status is invalid';
        },
      },
    });
  };
}
