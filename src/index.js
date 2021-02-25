const core = require('@actions/core');
const JobStatus = require('./status');
const GoogleChat = require('./chat');

const run = async () => {
  try {
    const name = core.getInput('name', { required: true });
    const url = core.getInput('url', { required: true });
    const user = core.getInput('user', { required: false });
    const status = JobStatus.parse(core.getInput('status', { required: true }));
    const customText = core.getInput('custom_text', { required: false });

    core.debug(`input params: name=${name}, `
               + `status=${status}, `
               + `url=${url}, `
               + `user=${user}, `
               + `custom_text=${customText}`);

    await GoogleChat.notify(name, url, status);
    console.info('Sent message.');
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
