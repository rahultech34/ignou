module.exports = {
  apps: [
    {
      name: "ignou-portal",
      script: "npm",
      args: "start",
      env: {
        PORT: 3005, // Set to any free port on your VPS (e.g. 3005, 3010, 4005)
        NODE_ENV: "production",
      },
    },
  ],
};

