export enum TypeCodeEnum {
    NUMBERS_CODE = 'NUMBERS_CODE',
    LETTERS_AND_NUMBERS_CODE = 'LETTERS_AND_NUMBERS_CODE',
    SECURE_CODE = 'SECURE_CODE'
}

export interface EmailTemplateFormData {
  name: string;
  to: string;
  subject: string;
  file?: File;
  text?: string;
  expireAtInMinutes?: number;
  codeSize?: number;
  codeType?: TypeCodeEnum;
  hasLink?: boolean;
  link?: string;
}