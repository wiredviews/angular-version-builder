import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { getSystemPath, json, normalize } from '@angular-devkit/core';

import { Observable, bindNodeCallback, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { writeFile } from 'fs';
import { EOL } from 'os';
import { version } from 'pjson';

import { VersionFilesBuilderSchema } from './schema';

export function createVersionFile(
  { tsOutputPath, jsonOutputPath }: VersionFilesBuilderSchema,
  { workspaceRoot, logger }: BuilderContext,
): Observable<BuilderOutput> {
  const root = workspaceRoot;

  const tsFilepath = getSystemPath(normalize(`${root}/${tsOutputPath}`));
  const jsonFilepath = getSystemPath(normalize(`${root}/${jsonOutputPath}`));

  const moduleSrc = `export const version = '${version}';${EOL}`;

  const jsonSrc = JSON.stringify({ version });

  const writeFileObservable = bindNodeCallback(writeFile);

  return forkJoin(
    writeFileObservable(tsFilepath, moduleSrc),
    writeFileObservable(jsonFilepath, jsonSrc),
  ).pipe(
    tap(() => logger.info(`Version files created with version ${version}`)),
    map(() => ({ success: true })),
    catchError(e => {
      logger.error('Failed create version files');
      logger.error(JSON.stringify(e));

      return of({ success: false });
    }),
  );
}

export default createBuilder<json.JsonObject & VersionFilesBuilderSchema>(
  createVersionFile,
);
