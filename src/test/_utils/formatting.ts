// Print pretty test title
export function printTitle(user: string, desc: string) {
	return "\x1b[33m" + user + "\u001b[00m: \u001b[01;34m" + desc;
}
