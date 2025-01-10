const config = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: false
    }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};

export default config; 