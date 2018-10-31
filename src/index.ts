import {
    BuildEvent, Builder, BuilderConfiguration, BuilderContext
} from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';

import { Observable, bindNodeCallback, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { writeFile } from 'fs';
import { EOL } from 'os';
import { version } from 'pjson';

import { VersionFilesBuilderSchema } from './schema';

export default class VersionFilesBuilder
  implements Builder<VersionFilesBuilderSchema> {
  constructor(private context: BuilderContext) {}

  run(
    builderConfig: BuilderConfiguration<Partial<VersionFilesBuilderSchema>>,
  ): Observable<BuildEvent> {
    const root = this.context.workspace.root;

    const { jsonOutputPath, tsOutputPath } = builderConfig.options;

    const tsFilepath = `${getSystemPath(
      builderConfig.sourceRoot,
    )}/${tsOutputPath}`;
    const jsonFilepath = `${getSystemPath(
      builderConfig.sourceRoot,
    )}/${jsonOutputPath}`;

    const moduleSrc = `export const version = '${version}';${EOL}`;

    const jsonSrc = JSON.stringify({ version });

    const writeFileObservable = bindNodeCallback(writeFile);

    return forkJoin(
      writeFileObservable(tsFilepath, moduleSrc),
      writeFileObservable(jsonFilepath, jsonSrc),
    ).pipe(
      map(() => ({ success: true })),
      tap(() =>
        this.context.logger.info(
          `Version files created with version ${version}`,
        ),
      ),
      catchError(e => {
        this.context.logger.error('Failed create version files', e);
        return of({ success: false });
      }),
    );
  }
}
