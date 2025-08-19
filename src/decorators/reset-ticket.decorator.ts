import { SetMetadata } from '@nestjs/common';

export const IS_RESET_TICKET = 'isResetTicket';
export const Reset = () => SetMetadata(IS_RESET_TICKET, true);
