'use strict';

const { repoToOwnerAndOwner } = require('../../scripts/repo-utils');
const { Octokit } = require("@octokit/rest");

const { REPOSITORY, BRANCH, TOKEN, MAINTAIN_USERNAME , MAINTAIN_EMAIL, TAG_NAME_FILTER } = process.env;
const octokit = new Octokit({ auth: TOKEN });

(async () => {
	try {
		const { owner, repo } = repoToOwnerAndOwner(REPOSITORY);
		const releases = await octokit.rest.repos.listReleases({
			owner,
			repo,
			per_page: 100
		});
		console.log(releases);
		let cloudReleases = releases.data.filter(release => release.tag_name.includes(TAG_NAME_FILTER));
		cloudReleases = cloudReleases.slice(0, 15);
		if (!cloudReleases) {
			throw new Error(`No releases found with tag name containing "${TAG_NAME_FILTER}"`);
		}
		const releasesJson = JSON.stringify(cloudReleases, null, 2);
		console.log(releasesJson);
		const contentEncoded = Buffer.from(releasesJson).toString('base64');
		const options = {
			owner,
			repo,
			path: `releases/cloud.json`,
			message: `releases/cloud.json`,
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
		};
		console.log(options);
		const { data } = await octokit.rest.repos.createOrUpdateFileContents(options);
		console.log(data);
		console.log(`releases/cloud.json updated`);
	} catch (err) {
		console.error(`Failed to update cloudReleases.json: ${err}`);
		process.exit(1);
	}
})();
