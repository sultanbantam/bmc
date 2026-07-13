module.exports = {
  apps: [
    {
      name: "bmc-ai-backend",
      script: "src/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3001
      },
      max_memory_restart: "300M",
      time: true
    }
  ]
};
