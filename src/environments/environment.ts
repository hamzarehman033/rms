const domain = (window.location.hostname || false) === 'localhost' ? 'https://localhost:7170' : 'https://iotdashboard-cua2ehdzbwgnefba.eastasia-01.azurewebsites.net';

export const environment = {
  production: false,
  isLocal: false,
  baseUrl: 'https://iotdashboard-qa-c0b8audvfzbkhfd0.eastasia-01.azurewebsites.net' + '/api',
  signalrHubUrl: domain + '/hubs/device-data',
};
