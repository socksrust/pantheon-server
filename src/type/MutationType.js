// @flow

import { GraphQLObjectType } from 'graphql';

import LoginEmail from '../mutation/LoginEmailMutation';
import RegisterEmail from '../mutation/RegisterEmailMutation';
import ChangePassword from '../mutation/ChangePasswordMutation';
import AddEvent from '../mutation/AddEventMutation';
import AttendToEvent from '../mutation/AttendToEventMutation';
import CantGoToEvent from '../mutation/CantGoToEventMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // auth
    LoginEmail,
    RegisterEmail,
    ChangePassword,
    // events
    AddEvent,
    AttendToEvent,
    CantGoToEvent,
  }),
});
