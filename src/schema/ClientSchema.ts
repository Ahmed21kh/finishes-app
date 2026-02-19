/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { object, string, number, InferType } from 'yup';

let clientSchema = object({
  name: string().required(),
  code: number().required().positive().integer(),
  phoneNumber:string().required()
});

export type Client = InferType<typeof clientSchema>;
