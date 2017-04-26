import { watch } from 'chokidar';

function wipeCache(regex) {
  Object.keys(require.cache).forEach(id => {
    if (regex.test(id)) delete require.cache[id];
  });
}

export default function configureWatcher(compiler) {
  const watcher = watch(__dirname);
  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('clearing /server/ module cache');
      wipeCache(/\/server\//);
    });
  });
  compiler.plugin('done', () => {
    console.log('clearing /client/ module cache');
    wipeCache(/\/client\//);
  });
}