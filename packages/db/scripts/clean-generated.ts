import fs from "node:fs";
import path from "node:path";

const generatedPath = path.resolve(process.cwd(), "prisma", "generated");

try {
	if (fs.existsSync(generatedPath)) {
		fs.rmSync(generatedPath, { recursive: true, force: true });
		console.info(`Removed Prisma generated artifacts at ${generatedPath}`);
	} else {
		console.info("No Prisma generated artifacts found – skipping cleanup");
	}
} catch (error) {
	console.error(
		`Failed to clean Prisma generated artifacts at ${generatedPath}:`,
		error,
	);
	process.exitCode = 1;
}
