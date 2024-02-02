let bumps = [
  { filename: 'package.json' },
  { filename: 'examples/admin-cli/package.json' },
  { filename: 'examples/client-cli/package.json' },
  { filename: 'examples/client-react/package.json' },
]; // update the global project

module.exports = {
  bumpFiles: [...bumps],
};
