import { NotFoundException } from '@nestjs/common';

export function profileNotFound(): NotFoundException {
  return new NotFoundException('Profile not found');
}

export function entityNotFound(entity: string, id?: string): NotFoundException {
  return new NotFoundException(id ? `${entity} with id "${id}" not found` : `${entity} not found`);
}