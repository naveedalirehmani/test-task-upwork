1. Serving games on each company’s domain:
You can achieve this by using custom subdomains or unique domains for each company. The platform should be designed to allow each company's site (like cool-games.com or luck-games.co.uk) to point to your backend. This can be done through DNS settings.

2. Modifying the users table:
you should add a company_id or similar field to the users table. This way, each user will not only be identified by their email but also by the company they belong to.

3. Validating logins for the correct domain:
With a single backend serving multiple companies, when a user logs in, you need to validate their credentials specifically for their company. You can achieve this by checking that the company_id associated with the user matches the domain they are trying to log in from.