module.exports = {
  apps: [{
    name: 'acontecer-next',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/acontecer-headless',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: '3000'
    },
    error_file: '/var/log/pm2/acontecer-next-error.log',
    out_file: '/var/log/pm2/acontecer-next-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
