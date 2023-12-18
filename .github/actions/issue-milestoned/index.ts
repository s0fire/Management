import { OctoKit, OctoKitIssue } from '../api/octokit';
import { Action } from '../common/Action';
import { DevopsClient } from './azdo';
import { getRequiredInput, safeLog } from '../common/utils';
import { context } from '@actions/github';
import { getInput } from '@actions/core';
import { getEmail } from '../teamsfx-utils/utils';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';


const githubToken = getRequiredInput('token');
const milestonePrefix = getRequiredInput('milestone-prefix');
const devopsToken = getRequiredInput('devops-token');
const org = getRequiredInput('devops-org');
const projectId = getRequiredInput('devops-projectId');
const titlePreix = getRequiredInput('title-prefix');
const bugLabel = getRequiredInput('bug-label');
const bugArea = getRequiredInput('bug-area-path');
const bugIteration = getRequiredInput('bug-iteration-path');
const featureLabel = getInput('feature-label');
const featureArea = getInput('feature-area-path');
const featureIteration = getInput('feature-iteration-path');

class Milestoned extends Action {
	id = 'Milestoned';

	async onMilestoned(issue: OctoKitIssue) {
		const content = await issue.getIssue();
		const milestoneTitle = content.milestone?.title ?? "";
		if (milestoneTitle.startsWith(milestonePrefix)) {
			safeLog(`the issue ${content.number} is milestoned with ${milestoneTitle}`);
			let client = await this.createClient();
			const asignee = getEmail(content.assignee);
			if (!asignee) {
				safeLog(`the issue ${content.number} assignee:${content.assignee} is not associated with email address, ignore.`);
			}
			const url = this.issueUrl(content.number);
			const title = titlePreix + `[${milestoneTitle}]` + content.title;
			let workItem: WorkItemTrackingInterfaces.WorkItem;
			if (featureLabel && content.labels.includes(featureLabel)) {
				safeLog(`issue labeled with ${featureLabel}. Feature work item will be created.`);
				workItem = await client.createFeatureItem(title, asignee, undefined, url);
			} else if (content.labels.includes(bugLabel)) {
				safeLog(`issue labeled with ${bugLabel}. Bug work item will be created.`);
				workItem = await client.createBugItem(title, asignee, undefined, url);
			} else {
				safeLog(
					`issue labeled without feature label(${featureLabel}) and bug label(${bugLabel}). Default bug work item will be created.`,
				);
				workItem = await client.createBugItem(title, asignee, undefined, url);
			}
			safeLog(`finished to create work item.`);
			const workItemUrl = workItem._links?.html?.href;
			if (workItemUrl) {
				await issue.postComment(`The issue is milestoned with sprint milestone ${milestoneTitle} and a work item created: ${workItemUrl}`);
			} else {
				safeLog(`no work item url found, ignore to post comment.`);
			}
		} else {
			safeLog(`the issue ${content.number} is not milestoned with prefix ${milestonePrefix}, ignore.`);
		}
	}
	async onTriggered(_: OctoKit) {
		const issueNumber = process.env.ISSUE_NUMBER;
		safeLog(`start manually create work item for issue ${issueNumber}`);
		const issue = new OctoKitIssue(githubToken, context.repo, { number: parseInt(issueNumber || "0") });
		await this.onMilestoned(issue);
	}

	private async createClient() {
		let client = new DevopsClient(
			devopsToken,
			org,
			projectId,
			bugArea,
			bugIteration,
			featureArea,
			featureIteration,
		);
		await client.init();
		return client;
	}

	private issueUrl(id: number) {
		return `https://github.com/${context.repo.owner}/${context.repo.repo}/issues/${id}`;
	}
}

new Milestoned().run(); // eslint-disable-line
