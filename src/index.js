const core = require('@actions/core');
const JobStatus = require('./status');
const GoogleChat = require('./chat');

const run = async () => {
  try {
    const name = core.getInput('name', { required: true });
    const url = core.getInput('url', { required: true });
    const status = JobStatus.parse(core.getInput('status', { required: true }));
    const customText = core.getInput('custom_text', { required: false });
    const customTextFile = core.getInput('custom_text_file', { required: false });

    console.log(`input params: name=${name}, `
               + `status=${status}, `
               + `url=${url}, `
               + `custom_text=${customText}`
               + `custom_text_file=${customTextFile}`);

    await GoogleChat.notify(name, url, status, customText, customTextFile);
    console.log('Sent message.');
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
