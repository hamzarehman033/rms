const domain = window.location.hostname.includes("github") ? 
'https://iotdashboard-cua2ehdzbwgnefba.eastasia-01.azurewebsites.net' : 
'https://iotdashboard-qa-c0b8audvfzbkhfd0.eastasia-01.azurewebsites.net';

export const environment = {
  production: true,
  // baseUrl: 'https://localhost:7170/api',
  // signalrHubUrl: 'http://localhost:7170/hubs/device-data',
  baseUrl: domain + '/api',
  signalrHubUrl: domain + '/hubs/device-data',
};
