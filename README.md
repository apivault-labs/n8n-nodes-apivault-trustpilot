# Trustpilot Reviews & Ratings for n8n

Collect public Trustpilot reviews, ratings, company replies and company-level insights by website, domain, Trustpilot URL or company name.

## Install

In n8n, open **Settings → Community Nodes → Install** and enter `n8n-nodes-apivault-trustpilot`. Add an **Apify API** credential, then select it in the node.

## Quickstart

Import [`examples/quickstart-workflow.json`](examples/quickstart-workflow.json), replace the sample company, select your credential, and run it. The final node turns low-rating reviews into an action queue while preserving the original result fields.

## Useful workflows

- reputation and complaint monitoring;
- reply-priority queues;
- review trend reporting;
- competitor experience research.

Runs use the hosted [Trustpilot Scraper](https://apify.com/apivault_labs/trustpilot-scraper-reviews-ratings-api). Actor usage is billed separately on Apify.

## License

[MIT](LICENSE)

<!-- apivault-integrations:start -->
## Hosted Actor and integrations

- [Run Trustpilot Reviews Scraper — Bulk CSV Export & API on Apify](https://apify.com/apivault_labs/trustpilot-scraper-reviews-ratings-api).
- [Current pricing and usage terms](https://apify.com/apivault_labs/trustpilot-scraper-reviews-ratings-api/pricing).
- [n8n community package: n8n-nodes-apivault-trustpilot](https://www.npmjs.com/package/n8n-nodes-apivault-trustpilot).
- [Python client](https://github.com/apivault-labs/apivault-labs/tree/main/python-clients/apivault-trustpilot-scraper-reviews-ratings-api).
- [n8n source and usage](https://github.com/apivault-labs/apivault-labs/tree/main/community-nodes/n8n-nodes-apivault-trustpilot).

An Apify account and API token are required. Hosted Actor/platform charges apply. npm publication is not n8n verification or confirmation of n8n Cloud availability.
<!-- apivault-integrations:end -->
