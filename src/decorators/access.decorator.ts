import { applyDecorators, SetMetadata } from '@nestjs/common';

export const PERMISSION_RESOURCE = 'permission_resource';
export const PERMISSION_ACTION = 'permission_action';

export type AccessAction = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
export type AccessResource =
  | 'funnel'
  | 'pipeline'
  | 'pipeitem'
  | 'contacts'
  | 'conversation'
  | 'message'
  | 'quickmessage'
  | 'scheduledmessage';

export const Access = (resource: AccessResource, action: AccessAction) =>
  applyDecorators(
    SetMetadata(PERMISSION_RESOURCE, resource),
    SetMetadata(PERMISSION_ACTION, action),
  );
