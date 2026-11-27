module.exports = {
  apps: [
    {
      name: "ignou-portal",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3025",
      cwd: "/var/www/ignou",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "450M", // Auto-restart if memory exceeds 450MB to protect VPS RAM
      kill_timeout: 5000,
      listen_timeout: 8000,
      env: {
        NODE_ENV: "production",
        PORT: 3025,
      },
      error_file: "/var/log/pm2/ignou-error.log",
      out_file: "/var/log/pm2/ignou-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
