export const pluralize = (count: number, noun: string, plural = `${noun}s`) =>
	`${count === 1 ? noun : plural}`;

export const contributionTitle = ({
	action,
	count,
	noun,
	repositoryCount,
}: {
	action: string;
	count: number;
	noun: string;
	repositoryCount: number;
}) =>
	`${action} ${count} ${pluralize(count, noun)} in ${repositoryCount} ${pluralize(
		repositoryCount,
		'repository',
		'repositories',
	)}`;

export const prettyDate = (date: string) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};
