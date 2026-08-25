const domain = window.location.hostname === 'localhost' ? 'https://localhost:7170' : 'https://iotdashboard-cua2ehdzbwgnefba.eastasia-01.azurewebsites.net';

export const environment = {
  production: false,
  isLocal: true,
  baseUrl: domain + '/api',
  signalrHubUrl: domain + '/hubs/device-data',
  cameraStreamHubUrl: domain + '/hubs/camera-stream',
};
