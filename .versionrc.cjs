let bumps = [
  { filename: 'package.json' },
  { filename: 'examples/simple-cli/package.json' },
  { filename: 'examples/simple-react/package.json' },
]; // update the global project

module.exports = {
  bumpFiles: [...bumps],
};
