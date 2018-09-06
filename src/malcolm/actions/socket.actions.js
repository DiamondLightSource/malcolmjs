import axios from 'axios';
import { updateVersionNumber } from '../../viewState/viewState.actions';
import { MalcolmSocketConnect } from '../malcolm.types';

export const registerSocketAndConnect = (worker, socketUrl) => ({
  type: MalcolmSocketConnect,
  payload: {
    worker,
    socketUrl,
  },
});

export const configureSocket = worker => dispatch => {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  return axios.get(`${baseUrl}/settings.json`).then(res => {
    const settings = res.data;
    dispatch(
      updateVersionNumber(settings.version, settings.title || 'MalcolmJS')
    );

    // in production no socket will be defined and it will default to ws://{{host}}/ws
    if (settings.malcolmSocket) {
      dispatch(registerSocketAndConnect(worker, settings.malcolmSocket));
    }
  });
};

export default {
  configureSocket,
  registerSocketAndConnect,
};
