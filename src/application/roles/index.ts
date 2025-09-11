import { AccountEntity } from '../entities/account';

type PermissionAction = {
  permisions: string[];
  condicion?: (user?: AccountEntity) => boolean;
};

type Permissions = {
  CREATE?: PermissionAction;
  READ?: PermissionAction;
  UPDATE?: PermissionAction;
  DELETE?: PermissionAction;
};

type Resources = {
  funnel?: Permissions;
  pipeline?: Permissions;
  pipeitem?: Permissions;
  contacts?: Permissions;
  conversation?: Permissions;
  message?: Permissions;
  quickmessage?: Permissions;
  scheduledmessage?: Permissions;
};

type Role = {
  name: string;
  permissions: Resources;
};

type Roles = {
  ADMINISTRATOR: Role;
  CLIENT: Role;
};

type RolesName = 'ADMINISTRATOR' | 'CLIENT';
type PermissionsName =
  | 'funnel'
  | 'pipeline'
  | 'pipeitem'
  | 'contacts'
  | 'conversation'
  | 'message'
  | 'quickmessage'
  | 'scheduledmessage';
type AccessType = 'READ' | 'UPDATE' | 'DELETE' | 'CREATE';

export const roles: Roles = {
  ADMINISTRATOR: {
    name: 'adminstrador',
    permissions: {
      funnel: {
        READ: {
          permisions: ['get_funnels', 'get_funnel_by_id'],
        },
        UPDATE: {
          permisions: ['update_funnel'],
        },
        DELETE: {
          permisions: ['delete_funnel'],
        },
        CREATE: {
          permisions: ['create_funnel'],
        },
      },
      pipeline: {
        READ: {
          permisions: ['get_pipelines_by_funnel', 'get_pipeline_by_id'],
        },
        UPDATE: {
          permisions: ['update_pipeline'],
        },
        DELETE: {
          permisions: ['delete_pipeline'],
        },
        CREATE: {
          permisions: ['create_pipeline'],
        },
      },
      pipeitem: {
        READ: {
          permisions: ['get_item_by_id', 'get_items_by_pipeline'],
        },
        UPDATE: {
          permisions: ['update_item'],
        },
        DELETE: {
          permisions: ['delete_item'],
        },
        CREATE: {
          permisions: ['create_item'],
        },
      },
      contacts: {
        READ: {
          permisions: ['get_contacts', 'get_contact_by_id'],
        },
        UPDATE: {
          permisions: ['update_contact'],
        },
        DELETE: {
          permisions: ['delete_contact'],
        },
        CREATE: {
          permisions: ['create_contact'],
        },
      },
      conversation: {
        READ: {
          permisions: ['get_conversations', 'get_conversation_by_id'],
        },
        UPDATE: {
          permisions: ['update_conversation'],
        },
        DELETE: {
          permisions: ['delete_conversation'],
        },
        CREATE: {
          permisions: ['create_conversation'],
        },
      },
      message: {
        READ: {
          permisions: ['get_messages_by_conversation', 'get_message_by_id'],
        },
        UPDATE: {
          permisions: ['update_message'],
        },
        DELETE: {
          permisions: ['delete_message'],
        },
        CREATE: {
          permisions: ['create_message'],
        },
      },
      quickmessage: {
        READ: {
          permisions: ['get_quick_messages', 'get_quick_message_by_id'],
        },
        UPDATE: {
          permisions: ['update_quick_message'],
        },
        DELETE: {
          permisions: ['delete_quick_message'],
        },
        CREATE: {
          permisions: ['create_quick_message'],
        },
      },
      scheduledmessage: {
        READ: {
          permisions: ['get_scheduled_messages', 'get_scheduled_message_by_id'],
        },
        UPDATE: {
          permisions: ['update_scheduled_message'],
        },
        DELETE: {
          permisions: ['delete_scheduled_message'],
        },
        CREATE: {
          permisions: ['create_scheduled_message'],
        },
      },
    },
  },
  CLIENT: {
    name: 'client',
    permissions: {
      funnel: {
        READ: {
          permisions: ['get_funnels', 'get_funnel_by_id'],
        },
      },
      pipeline: {
        READ: {
          permisions: ['get_pipelines_by_funnel', 'get_pipeline_by_id'],
        },
      },
      pipeitem: {
        READ: {
          permisions: ['get_item_by_id', 'get_items_by_pipeline'],
        },
        CREATE: {
          permisions: ['create_item'],
        },
        UPDATE: {
          permisions: ['update_item'],
        },
        DELETE: {
          permisions: ['delete_item'],
        },
      },
      contacts: {
        READ: {
          permisions: ['get_contacts', 'get_contact_by_id'],
        },
        CREATE: {
          permisions: ['create_contact'],
        },
        UPDATE: {
          permisions: ['update_contact'],
        },
        DELETE: {
          permisions: ['delete_contact'],
        },
      },
      conversation: {
        READ: {
          permisions: ['get_conversations', 'get_conversation_by_id'],
        },
        CREATE: {
          permisions: ['create_conversation'],
        },
        UPDATE: {
          permisions: ['update_conversation'],
        },
        DELETE: {
          permisions: ['delete_conversation'],
        },
      },
      message: {
        READ: {
          permisions: ['get_messages_by_conversation', 'get_message_by_id'],
        },
        CREATE: {
          permisions: ['create_message'],
        },
        UPDATE: {
          permisions: ['update_message'],
        },
        DELETE: {
          permisions: ['delete_message'],
        },
      },
      quickmessage: {
        READ: {
          permisions: ['get_quick_messages', 'get_quick_message_by_id'],
        },
        CREATE: {
          permisions: ['create_quick_message'],
        },
        UPDATE: {
          permisions: ['update_quick_message'],
        },
        DELETE: {
          permisions: ['delete_quick_message'],
        },
      },
      scheduledmessage: {
        READ: {
          permisions: ['get_scheduled_messages', 'get_scheduled_message_by_id'],
        },
        CREATE: {
          permisions: ['create_scheduled_message'],
        },
        UPDATE: {
          permisions: ['update_scheduled_message'],
        },
        DELETE: {
          permisions: ['delete_scheduled_message'],
        },
      },
    },
  },
};

export function can(
  user: AccountEntity | undefined,
  roleKey: RolesName,
  resourceKey: PermissionsName,
  accessKey: AccessType,
) {
  const permissions = roles[roleKey as keyof typeof roles].permissions;
  const resource = permissions[resourceKey as keyof typeof permissions];
  if (!resource) return false;
  const access = resource[accessKey as keyof typeof resource];
  if (!access) return false;
  if (access?.condicion) return access.condicion(user);
  return true;
}
