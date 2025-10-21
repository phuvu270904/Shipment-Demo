import { Mutation as GqlMutation, Query as GqlQuery } from '@nestjs/graphql';

function getPrefix(target: any): string {
  return target.constructor.name.replace('Resolver', '') + '_';
}

export function CustomMutation(type: any, description?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return GqlMutation(type, {
      name: `${getPrefix(target)}${propertyKey}`,
      description,
    })(target, propertyKey, descriptor);
  };
}

export function CustomQuery(type: any, description?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return GqlQuery(type, {
      name: `${getPrefix(target)}${propertyKey}`,
      description,
    })(target, propertyKey, descriptor);
  };
}
