// Learnt from:
// https://git.vnv.ch/snippets/17#more-documentations-options
// https://www.digitalocean.com/community/tutorials/how-to-automate-your-node-js-production-deployments-with-shipit-on-centos-7
module.exports = (shipit) => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '.',
      deployTo: process.env.DEPLOY_PATH,

      keepReleases: 5,

      // The workspace dir won't be removed after deploy
      keepWorkspace: true,

      // Disable the setup of Git repository (fetch, pull, merge, submodules, etc.)
      // because the current context is already up to date(CI/ CD)
      shallowClone: false,
      branch: 'HEAD',
      copy: false,
    },

    production: {
      servers: {
        user: process.env.HOST_JP_1_USER,
        host: process.env.HOST_HK_1_IP,
      },
    },
  });

  shipit.on('published', () => {
    shipit.start('server:reload');
  });

  shipit.blTask('server:reload', async () => {
    await shipit.remote(`npm run server:reload`, {
      cwd: `${process.env.DEPLOY_PATH}/current/project`,
    });
  });
};