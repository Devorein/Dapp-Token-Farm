module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  migrations_directory: "./migrations/dist",
  compilers: {
    solc: {
      version: "0.8.7",
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  }
}