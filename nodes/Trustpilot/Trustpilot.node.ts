import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~trustpilot-scraper-reviews-ratings-api';
const list = (value: string): string[] => value.split(/[,\n]/).map((entry) => entry.trim()).filter(Boolean);

export class Trustpilot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trustpilot Reviews & Ratings',
		name: 'trustpilot',
		icon: 'file:trustpilot.svg',
		group: ['transform'],
		version: 1,
		description: 'Collect reviews, ratings, replies and company insights from Trustpilot.',
		defaults: { name: 'Trustpilot Reviews & Ratings' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
			{ displayName: 'Company URLs or Domains', name: 'startUrls', type: 'string', typeOptions: { rows: 4 }, default: '', description: 'One company website, domain, or Trustpilot URL per line.' },
			{ displayName: 'Company Names', name: 'searchTerms', type: 'string', typeOptions: { rows: 3 }, default: '', description: 'Optional brand or company names, one per line.' },
			{ displayName: 'Content', name: 'contentMode', type: 'options', options: [
				{ name: 'Company Information and Reviews', value: 'companyInformationAndReviews' },
				{ name: 'Reviews Only', value: 'reviews' },
				{ name: 'Company Information Only', value: 'companyInformation' },
			], default: 'companyInformationAndReviews' },
			{ displayName: 'Maximum Reviews per Company', name: 'maxReviews', type: 'number', typeOptions: { minValue: 0, maxValue: 1000000 }, default: 100, description: 'Use 0 for every available review.' },
			{ displayName: 'Date Range', name: 'dateRange', type: 'options', options: [
				{ name: 'All Time', value: 'all' }, { name: 'Last 30 Days', value: 'last30days' },
				{ name: 'Last 3 Months', value: 'last3months' }, { name: 'Last 6 Months', value: 'last6months' },
				{ name: 'Last 12 Months', value: 'last12months' },
			], default: 'all' },
			{ displayName: 'Star Ratings', name: 'filterStars', type: 'multiOptions', options: [1, 2, 3, 4, 5].map((rating) => ({ name: `${rating} Star${rating === 1 ? '' : 's'}`, value: String(rating) })), default: [] },
			{ displayName: 'Languages', name: 'filterLanguages', type: 'string', default: '', placeholder: 'en, de, fr', description: 'Optional ISO language codes.' },
			{ displayName: 'Reviewer Countries', name: 'filterCountries', type: 'string', default: '', placeholder: 'US, DE, GB', description: 'Optional country codes.' },
			{ displayName: 'Verified Reviews Only', name: 'verifiedOnly', type: 'boolean', default: false },
			{ displayName: 'Reviews With Company Replies Only', name: 'repliesOnly', type: 'boolean', default: false },
			{ displayName: 'Strict Company Name Match', name: 'strictNameMatch', type: 'boolean', default: false },
			{ displayName: 'Add Review Insights', name: 'includeReviewInsights', type: 'boolean', default: true, description: 'Include a company-level rating and sentiment summary.' },
			{ displayName: 'Include Company Details', name: 'includeCompanyDetails', type: 'boolean', default: true },
			{ displayName: 'Compact Review Rows', name: 'compact', type: 'boolean', default: false },
			{ displayName: 'Sort Reviews', name: 'sortBy', type: 'options', options: [
				{ name: 'Auto (Most Recent)', value: 'auto' }, { name: 'Most Recent', value: 'recency' }, { name: 'Most Relevant', value: 'relevance' },
			], default: 'auto' },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const startUrls = list(this.getNodeParameter('startUrls', i, '') as string);
				const searchTerms = list(this.getNodeParameter('searchTerms', i, '') as string);
				if (!startUrls.length && !searchTerms.length) {
					throw new NodeOperationError(this.getNode(), 'Add at least one company URL, domain, or company name.', { itemIndex: i });
				}
				const body = {
					startUrls, searchTerms,
					contentMode: this.getNodeParameter('contentMode', i),
					maxReviews: this.getNodeParameter('maxReviews', i),
					dateRange: this.getNodeParameter('dateRange', i),
					filterStars: this.getNodeParameter('filterStars', i),
					filterLanguages: list(this.getNodeParameter('filterLanguages', i, '') as string),
					filterCountries: list(this.getNodeParameter('filterCountries', i, '') as string),
					verifiedOnly: this.getNodeParameter('verifiedOnly', i),
					repliesOnly: this.getNodeParameter('repliesOnly', i),
					strictNameMatch: this.getNodeParameter('strictNameMatch', i),
					includeReviewInsights: this.getNodeParameter('includeReviewInsights', i),
					includeCompanyDetails: this.getNodeParameter('includeCompanyDetails', i),
					compact: this.getNodeParameter('compact', i),
					sortBy: this.getNodeParameter('sortBy', i),
				};
				const options: IRequestOptions = { method: 'POST' as IHttpRequestMethods, url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`, body, json: true };
				const response = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				for (const result of Array.isArray(response) ? response : [response]) returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
