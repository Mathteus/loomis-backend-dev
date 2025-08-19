import { SetMetadata } from '@nestjs/common';

export const IS_RECOVERY_TICKET = 'isRecoveryTicket';
export const Recovery = () => SetMetadata(IS_RECOVERY_TICKET, true);
