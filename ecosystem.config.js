module.exports = {
  apps: [
    {
      name: "ignou-portal",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3025",
      cwd: "/var/www/ignou",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};


