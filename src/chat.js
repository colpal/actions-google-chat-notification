const github = require('@actions/github');
const axios = require('axios');

const statusColorPalette = (status) => {
  switch (status) {
    case 'success':
      return '#2cbe4e';
    case 'failure':
      return '#ff0000';
    case 'cancelled':
      return '#ffc107';
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const statusText = (status) => {
  switch (status) {
    case 'success':
      return 'Succeeded';
    case 'failure':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const textButton = (text, url) => ({
  textButton: {
    text,
    onClick: { openLink: { url } },
  },
});

const notify = async (name, url, status) => {
  const { owner, repo } = github.context.repo;
  const {
    eventName, sha, ref, actor,
  } = github.context;
  const actorAvatar = github.context.payload.sender.avatar_url;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const branch = ref.split('/').pop();
  const refUrl = `${repoUrl}/tree/${branch}`;
  console.log(refUrl);
  const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
  const checksUrl = `${repoUrl}${eventPath}/checks`;
  const profileUrl = `https://github.com/${actor}`;

  const body = {
    cards: [{
      sections: [
        {
          widgets: [{
            textParagraph: {
              text: `<b>${name} <font color="${statusColorPalette(status)}">${statusText(status)}</font></b>`,
            },
          }],
        },
        {
          widgets: [
            {
              keyValue: {
                topLabel: 'repository',
                content: `${owner}/${repo}`,
                contentMultiline: true,
                onClick: {
                  openLink: {
                    url: repoUrl,
                  },
                },
              },
            },
            {
              keyValue: {
                topLabel: 'event name',
                content: eventName,
                onClick: {
                  openLink: {
                    url: eventUrl,
                  },
                },
              },
            },
            {
              keyValue: {
                topLabel: 'ref',
                content: ref,
                onClick: {
                  openLink: {
                    url: refUrl,
                  },
                },
              },
            },
          ],
        },
        {
          widgets: [{
            buttons: [textButton('OPEN CHECKS', checksUrl)],
          }],
        },
      ],
    }],
  };

  const response = await axios.default.post(url, body);
  if (response.status !== 200) {
    throw new Error(`Google Chat notification failed. response status=${response.status}\nResponse message=${response.data}`);
  }
};

module.exports = { notify };
