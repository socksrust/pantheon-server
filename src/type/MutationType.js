// @flow

import { GraphQLObjectType } from 'graphql';

import LoginEmail from '../mutation/LoginEmailMutation';
import RegisterEmail from '../mutation/RegisterEmailMutation';
import ChangePassword from '../mutation/ChangePasswordMutation';

import EventAdd from '../mutation/EventAddMutation';
import AttendToEvent from '../mutation/AttendToEventMutation';
import CantGoToEvent from '../mutation/CantGoToEventMutation';
import MoveToPresenceList from '../mutation/MoveToPresenceListMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // auth
    LoginEmail,
    RegisterEmail,
    ChangePassword,

    // events
    EventAdd,

    // event list management
    AttendToEvent,
    CantGoToEvent,
    MoveToPresenceList,
  }),
});
