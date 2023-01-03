import { registerDecorator, ValidationOptions } from "class-validator";
import { isCuid } from "cuid";

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: "isCuid",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "id 형식이 올바르지 않습니다.",
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isCuid(value);
        },
      },
    });
  };
}
