'use strict';

const { repoToOwnerAndOwner } = require('../../scripts/repo-utils');
const { Octokit } = require("@octokit/rest");

const { REPOSITORY, BRANCH, TOKEN, MAINTAIN_USERNAME , MAINTAIN_EMAIL, TAG_NAME_FILTER } = process.env;
const octokit = new Octokit({ auth: TOKEN });

(async () => {
	try {

		const { owner, repo } = repoToOwnerAndOwner(REPOSITORY);
		const releases = octokit.rest.repos.listReleases({
			owner,
			repo,
			per_page: 100
		});

		const cloudReleases = releases.data.find(release => release.tag_name.includes(TAG_NAME_FILTER));
		if (!cloudReleases) {
			throw new Error(`No releases found with tag name containing "${TAG_NAME_FILTER}"`);
		}

		const releasesJson = JSON.stringify(cloudReleases, null, 2);
		console.log(releasesJson);
		const contentEncoded = Buffer.from(releasesJson).toString('base64');
		const { data } = await octokit.repos.createOrUpdateFileContents({
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
