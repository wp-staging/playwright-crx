// @ts-ignore
import { SourceMapConsumer } from 'source-map/lib/source-map-consumer';

const regex = /^ +at.+\((.*):([0-9]+):([0-9]+)/;

class StacktraceSourcemap {

  _mapForUri = new Map<string, SourceMapConsumer | undefined>();

  async register(uri: string) {
    if (this._mapForUri.has(uri)) return;
    this._mapForUri.set(uri, undefined);
    await new Promise<void>(async resolve => {
      try {
        const result = await fetch(`${uri}.map`);
        const sourceMap = await result.json();
        const sourceMapConsumer = result.ok ? await new SourceMapConsumer(sourceMap) : undefined;
        this._mapForUri.set(uri, sourceMapConsumer);
      } catch (e) {
        console.error(e);
      } finally {
        resolve();
      }
    });
  }

  processSourceMaps([firstLine, ...stack]: string[]): string[] {
    const result = [firstLine];

    for (const line of stack) {
      const [_, uri, lineNumberStr, columnStr] = line.match(regex) ?? [];
      if (uri) {
        const lineNumber = parseInt(lineNumberStr, 10);
        const column = parseInt(columnStr, 10);
        const map = this._mapForUri.get(uri);

        if (map) {
          // we think we have a map for that uri. call source-map library
          var origPos = map.originalPositionFor({ line: lineNumber, column });
          if (origPos.source && origPos.line && origPos.column) {
            result.push(this._formatOriginalPosition(
              origPos.source,
              origPos.line,
              origPos.column,
              origPos.name || this._origName(line)
            ));
          }
        } else {
          // we can't find a map for that url, but we parsed the row.
          // reformat unchanged line for consistency with the sourcemapped
          // lines.
          result.push(this._formatOriginalPosition(uri, lineNumber, column, this._origName(line)));
        }
      } else {
        // we weren't able to parse the row, push back what we were given
        result.push(line);
      }
    }

    return result;
  }

  _origName(origLine: string) {
    const [, name] = / +at +([^ ]*).*/.exec(origLine) ?? [];
    return name;
  }

  _formatOriginalPosition(source: string, line: number, column: number, name?: string) {
    // mimic chrome's format
    return `    at ${name ?? "(unknown)"} (${source}:${line}:${column})`;
  };
}

export const stacktraceSourcemap = new StacktraceSourcemap();
