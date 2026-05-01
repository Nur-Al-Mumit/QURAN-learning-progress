import { defineEventHandler, readBody, createError } from "h3";
import { promises as fs } from "fs";
import path from "path";

const allowedKeys = ["students", "classDates", "attendance"];

const buildFileContents = (payload: Record<string, unknown>) => {
  const serialized = JSON.stringify(payload, null, 2);
  return `const studentAttendanceData = ${serialized} as const;

export default studentAttendanceData;
`;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || typeof body !== "object") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid payload",
    });
  }

  for (const key of allowedKeys) {
    if (!(key in body)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing ${key} in payload`,
      });
    }
  }

  const filePath = path.resolve(
    process.cwd(),
    "data",
    "studentAttendanceData.ts"
  );

  await fs.writeFile(filePath, buildFileContents(body as Record<string, unknown>), {
    encoding: "utf-8",
  });

  return {
    success: true,
    updatedAt: new Date().toISOString(),
  };
});

