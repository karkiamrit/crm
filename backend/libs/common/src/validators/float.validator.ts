import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFloat(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'isFloat',
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         validator: {
            validate(value: any, args: ValidationArguments) {
               return Number(value) === value && value % 1 !== 0;
            }
         }
      });
   };
}