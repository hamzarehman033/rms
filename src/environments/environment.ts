const domain = window.location.hostname === 'localhost' ? 'https://localhost:7170' : 'hamzarehman033-001-site1.jtempurl.com';

export const environment = {
  production: false,
  isLocal: true,
  baseUrl: domain + '/api',
  signalrHubUrl: domain + '/hubs/device-data',
};
