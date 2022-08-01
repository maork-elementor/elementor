'use strict';

const { repoToOwnerAndOwner } = require('../../scripts/repo-utils');
const OctokitCore = { octokit } = require('@octokit/core');
const OctokitRest = { octokit } = require('@octokit/rest');

const { REPOSITORY, BRANCH, TOKEN, MAINTAIN_USERNAME , MAINTAIN_EMAIL } = process.env;
const octokitCoreInstance = new OctokitCore({ auth: TOKEN });
const octokitRestInstance = new OctokitRest({ auth: TOKEN });

(async () => {
	try {

		const { owner, repo } = repoToOwnerAndOwner(REPOSITORY);
		const releases = await octokitCoreInstance.request(
			'GET /repos/{owner}/{repo}/releases?per_page=100',
			{ owner, repo }
		);

		const cloudReleases = releases.data.find(release => release.tag_name.includes('cloud'));
		if (!cloudReleases) {
			throw new Error(`No releases found with tag name containing "cloud"`);
		}

		const releasesJson = JSON.stringify(cloudReleases, null, 2);
		console.log(releasesJson);
		const contentEncoded = Buffer.from(releasesJson).toString('base64');
		const { data } = await octokitRestInstance.repos.createOrUpdateFileContents({
			owner,
			repo: REPOSITORY,
			path: `cloudReleases.json`,
			message: `Update cloudReleases.json`,
			content: contentEncoded,
			committer: {
				name: MAINTAIN_USERNAME,
				email: MAINTAIN_EMAIL,
			},
			author: {
				name: MAINTAIN_USERNAME,
				email: MAINTAIN_EMAIL,
			},
			branch: BRANCH,
		});
		console.log(data);
		console.log(`Releases.json updated with sha ${releasesJsonSha.data.content.sha}`);
	} catch (err) {
		console.error(`Failed to update releases.json: ${err}`);
		process.exit(1);
	}
})();
