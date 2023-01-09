import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListActions } from '@ngdux/list';

export const listActions = createListActions<UserDto, ErrorDto>('Users');
